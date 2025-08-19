'use client'

import { useState, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { LeadFormService } from '@/services/LeadFormService'
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

  // Load saved form data on mount
  useEffect(() => {
    const saved = localStorage.getItem('leadFormData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setFormData(parsedData)
        // Auto-advance to next empty field
        if (parsedData.name && parsedData.email) setStep(2)
        if (parsedData.phone && parsedData.zip) setStep(3)
      } catch (e) {
        console.error('Error loading saved form data:', e)
      }
    }
  }, [])

  // Save form data on changes
  useEffect(() => {
    localStorage.setItem('leadFormData', JSON.stringify(formData))
  }, [formData])

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const utmParams = new URLSearchParams(window.location.search)
      const leadData = {
        ...formData,
        brand: brand.id,
        timestamp: new Date().toISOString(),
        utmSource: utmParams.get('source') || 'direct',
        utmMedium: utmParams.get('medium') || '',
        utmCampaign: utmParams.get('campaign') || '',
        sessionId: sessionStorage.getItem('sessionId') || 'unknown'
      }

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        localStorage.removeItem('leadFormData')
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
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
            <button
              type="button"
              onClick={nextStep}
              disabled={!formData.name || !formData.email}
              className={`w-full ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white p-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Continue <ChevronRight size={20} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={(e) => updateField('zip', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              maxLength={5}
              required
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
                type="button"
                onClick={nextStep}
                disabled={!formData.phone || !formData.zip}
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
            <input
              type="text"
              placeholder="Property Address"
              value={formData.address}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              required
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
                disabled={!formData.serviceType || !formData.address || isLoading}
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