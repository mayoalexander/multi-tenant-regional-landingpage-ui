export interface LeadFormData {
  name: string
  email: string
  phone: string
  zip: string
  serviceType: string
  address: string
}

export interface LeadSubmissionPayload extends LeadFormData {
  brand: string
  timestamp: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  sessionId: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export interface FormStepConfig {
  stepNumber: number
  title: string
  fields: string[]
  canAdvance: (data: LeadFormData) => boolean
}

export class LeadFormService {
  private static readonly STORAGE_KEY = 'leadFormData'
  private static readonly SESSION_ID_KEY = 'sessionId'
  
  private readonly formSteps: FormStepConfig[] = [
    {
      stepNumber: 1,
      title: 'Contact Information',
      fields: ['name', 'email'],
      canAdvance: (data) => !!data.name && !!data.email && this.isValidEmail(data.email)
    },
    {
      stepNumber: 2,
      title: 'Location Details', 
      fields: ['phone', 'zip'],
      canAdvance: (data) => !!data.phone && !!data.zip && data.zip.length === 5
    },
    {
      stepNumber: 3,
      title: 'Service Requirements',
      fields: ['serviceType', 'address'],
      canAdvance: (data) => !!data.serviceType && !!data.address
    }
  ]

  getFormSteps(): FormStepConfig[] {
    return this.formSteps
  }

  getServiceTypes(): string[] {
    return [
      'Home Security System',
      'Business Security',
      'Video Surveillance',
      'Smart Home Automation',
      'Fire & Smoke Detection'
    ]
  }

  saveFormData(data: LeadFormData): void {
    try {
      localStorage.setItem(LeadFormService.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save form data:', error)
    }
  }

  loadSavedFormData(): LeadFormData {
    const emptyForm: LeadFormData = {
      name: '', email: '', phone: '', zip: '', serviceType: '', address: ''
    }

    try {
      const saved = localStorage.getItem(LeadFormService.STORAGE_KEY)
      return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm
    } catch {
      return emptyForm
    }
  }

  clearSavedFormData(): void {
    localStorage.removeItem(LeadFormService.STORAGE_KEY)
  }

  validateFormStep(stepNumber: number, data: LeadFormData): FormValidationResult {
    const step = this.formSteps.find(s => s.stepNumber === stepNumber)
    if (!step) return { isValid: false, errors: { general: 'Invalid step' } }

    const errors: Record<string, string> = {}

    step.fields.forEach(field => {
      const value = data[field as keyof LeadFormData]
      
      if (!value) {
        errors[field] = `${this.getFieldLabel(field)} is required`
        return
      }

      if (field === 'email' && !this.isValidEmail(value)) {
        errors[field] = 'Please enter a valid email address'
      }

      if (field === 'phone' && !this.isValidPhone(value)) {
        errors[field] = 'Please enter a valid phone number'
      }

      if (field === 'zip' && !this.isValidZip(value)) {
        errors[field] = 'Please enter a valid 5-digit ZIP code'
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  canAdvanceToStep(targetStep: number, data: LeadFormData): boolean {
    for (let i = 1; i < targetStep; i++) {
      const stepConfig = this.formSteps.find(s => s.stepNumber === i)
      if (!stepConfig || !stepConfig.canAdvance(data)) {
        return false
      }
    }
    return true
  }

  async submitLead(data: LeadFormData, brandId: string): Promise<boolean> {
    try {
      const payload = this.buildSubmissionPayload(data, brandId)
      
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        this.clearSavedFormData()
        return true
      }

      throw new Error(`HTTP ${response.status}`)
    } catch (error) {
      console.error('Lead submission failed:', error)
      return false
    }
  }

  getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem(LeadFormService.SESSION_ID_KEY)
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem(LeadFormService.SESSION_ID_KEY, sessionId)
    }

    return sessionId
  }

  private buildSubmissionPayload(data: LeadFormData, brandId: string): LeadSubmissionPayload {
    const urlParams = new URLSearchParams(window.location.search)
    
    return {
      ...data,
      brand: brandId,
      timestamp: new Date().toISOString(),
      utmSource: urlParams.get('source') || 'direct',
      utmMedium: urlParams.get('medium') || '',
      utmCampaign: urlParams.get('campaign') || '',
      sessionId: this.getOrCreateSessionId()
    }
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      zip: 'ZIP Code',
      serviceType: 'Service Type',
      address: 'Address'
    }
    return labels[field] || field
  }

  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (cleaned.length >= 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    } else if (cleaned.length >= 6) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    } else if (cleaned.length >= 3) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`
    }
    return cleaned
  }

  validateFieldRealTime(field: string, value: string): { isValid: boolean; error?: string } {
    if (value.length < 3) {
      return { isValid: false }
    }

    switch (field) {
      case 'name':
        if (value.length < 2) return { isValid: false, error: 'Name must be at least 2 characters' }
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
        return { isValid: true }

      case 'email':
        if (value.length < 5) return { isValid: false }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return { isValid: false, error: 'Please enter a valid email address' }
        return { isValid: true }

      case 'phone':
        const cleaned = value.replace(/\D/g, '')
        if (cleaned.length < 10) return { isValid: false, error: 'Phone number must be 10 digits' }
        if (cleaned.length > 10) return { isValid: false, error: 'Phone number cannot exceed 10 digits' }
        return { isValid: true }

      case 'zip':
        if (!/^\d{5}$/.test(value)) return { isValid: false, error: 'ZIP code must be 5 digits' }
        return { isValid: true }

      case 'address':
        if (value.length < 5) return { isValid: false, error: 'Please enter a complete address' }
        return { isValid: true }

      default:
        return { isValid: false }
    }
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length === 10
  }

  private isValidZip(zip: string): boolean {
    return /^\d{5}$/.test(zip)
  }
}