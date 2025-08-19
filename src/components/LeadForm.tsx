'use client'

import { useState, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { LeadFormService } from '@/services/LeadFormService'
import AddressAutocomplete from './AddressAutocomplete'
import { ChevronRight, Loader2, Check, X, AlertCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  phone: string
  zip: string
  serviceType: string
  address: string
}

interface FieldValidation {
  isValid: boolean
  error?: string
  showFeedback: boolean
}

export default function LeadForm() {
  const { brand } = useBrand()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    zip: '',
    serviceType: '',
    address: ''
  })

  const [fieldValidations, setFieldValidations] = useState<Record<string, FieldValidation>>({
    name: { isValid: false, showFeedback: false },
    email: { isValid: false, showFeedback: false },
    phone: { isValid: false, showFeedback: false },
    zip: { isValid: false, showFeedback: false },
    address: { isValid: false, showFeedback: false }
  })

  const formService = new LeadFormService()
  const serviceTypes = formService.getServiceTypes()

  // Load saved form data on mount
  useEffect(() => {
    const savedData = formService.loadSavedFormData()
    if (savedData.name || savedData.email) {
      setFormData(savedData)
      // Validate saved data
      Object.keys(savedData).forEach(field => {
        if (savedData[field as keyof FormData]) {
          validateField(field, savedData[field as keyof FormData])
        }
      })
      
      // Auto-advance to next step based on saved data
      if (savedData.name && savedData.email && formService.canAdvanceToStep(2, savedData)) {
        setStep(2)
      }
      if (savedData.phone && savedData.zip && formService.canAdvanceToStep(3, savedData)) {
        setStep(3)
      }
    }
  }, [])

  // Save form data on changes
  useEffect(() => {
    formService.saveFormData(formData)
  }, [formData])

  const validateField = (field: string, value: string) => {
    const validation = formService.validateFieldRealTime(field, value)
    const shouldShowFeedback = value.length >= 3

    setFieldValidations(prev => ({
      ...prev,
      [field]: {
        isValid: validation.isValid,
        error: validation.error,
        showFeedback: shouldShowFeedback
      }
    }))
  }

  const updateField = (field: keyof FormData, value: string, autoZip?: string) => {
    let processedValue = value

    // Special processing for phone field
    if (field === 'phone') {
      // Only allow digits and format
      const cleaned = value.replace(/\D/g, '')
      if (cleaned.length <= 10) {
        processedValue = formService.formatPhoneNumber(cleaned)
      } else {
        return // Don't update if more than 10 digits
      }
    }

    // Special processing for ZIP field
    if (field === 'zip') {
      // Only allow digits, max 5
      const cleaned = value.replace(/\D/g, '').slice(0, 5)
      processedValue = cleaned
    }

    // Handle address autocomplete with automatic ZIP population
    const updates: Partial<FormData> = { [field]: processedValue }
    if (field === 'address' && autoZip) {
      updates.zip = autoZip
      validateField('zip', autoZip)
    }

    setFormData(prev => ({ ...prev, ...updates }))
    validateField(field, processedValue)
  }

  const handleAddressValidation = (isValid: boolean, error?: string) => {
    setFieldValidations(prev => ({
      ...prev,
      address: {
        isValid,
        error,
        showFeedback: formData.address.length >= 3
      }
    }))
  }

  const canAdvanceFromStep = (stepNumber: number): boolean => {
    return formService.canAdvanceToStep(stepNumber + 1, formData)
  }

  const nextStep = () => {
    if (step < 3 && canAdvanceFromStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await formService.submitLead(formData, brand.id)
      
      if (success) {
        // Clear validations
        setFieldValidations({
          name: { isValid: false, showFeedback: false },
          email: { isValid: false, showFeedback: false },
          phone: { isValid: false, showFeedback: false },
          zip: { isValid: false, showFeedback: false },
          address: { isValid: false, showFeedback: false }
        })
        
        alert('Thank you! We\'ll contact you within 24 hours.')
        setFormData({
          name: '', email: '', phone: '', zip: '', serviceType: '', address: ''
        })
        setStep(1)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderInputWithValidation = (
    type: string,
    field: keyof FormData,
    placeholder: string,
    label: string,
    maxLength?: number
  ) => {
    const validation = fieldValidations[field]
    const hasError = validation.showFeedback && !validation.isValid && validation.error
    const hasSuccess = validation.showFeedback && validation.isValid
    
    return (
      <div className="space-y-1">
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {label}
        </label>
        <div className="relative">
          <input
            type={type}
            placeholder={placeholder}
            value={formData[field]}
            onChange={(e) => updateField(field, e.target.value)}
            maxLength={maxLength}
            className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-colors ${
              hasError 
                ? 'border-red-500 focus:ring-red-200' 
                : hasSuccess 
                  ? 'border-green-500 focus:ring-green-200' 
                  : 'border-gray-300 focus:ring-blue-500'
            }`}
            required
          />
          
          {/* Validation feedback icon */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validation.showFeedback && (
              <>
                {validation.isValid ? (
                  <Check size={20} className="text-green-500" />
                ) : validation.error ? (
                  <AlertCircle size={20} className="text-red-500" />
                ) : null}
              </>
            )}
          </div>
        </div>
        
        {/* Error message */}
        {hasError && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <X size={14} />
            {validation.error}
          </p>
        )}
      </div>
    )
  }

  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700'
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Your Free Security Quote</h3>
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i <= step ? `bg-${brand.primaryColor}-600` : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            {renderInputWithValidation('text', 'name', 'John Doe', 'Full Name')}
            {renderInputWithValidation('email', 'email', 'john@example.com', 'Email Address')}
            <button
              type="button"
              onClick={nextStep}
              disabled={!canAdvanceFromStep(1)}
              className={`w-full ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {renderInputWithValidation('tel', 'phone', '(555) 123-4567', 'Phone Number', 14)}
            {renderInputWithValidation('text', 'zip', '12345', 'ZIP Code', 5)}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={!canAdvanceFromStep(2)}
                className={`flex-1 ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                Continue <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <select
              value={formData.serviceType}
              onChange={(e) => updateField('serviceType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            >
              <option value="" className="text-gray-500">Select Service Type</option>
              {serviceTypes.map(service => (
                <option key={service} value={service} className="text-gray-900">{service}</option>
              ))}
            </select>
<AddressAutocomplete
              value={formData.address}
              onChange={(address, zipCode) => updateField('address', address, zipCode)}
              onValidationChange={handleAddressValidation}
              placeholder="123 Main Street, City, State"
              label="Property Address"
              isValid={fieldValidations.address.isValid}
              error={fieldValidations.address.error}
              showFeedback={fieldValidations.address.showFeedback}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.serviceType || !fieldValidations.address.isValid || isLoading}
                className={`flex-1 ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Get Free Quote'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}