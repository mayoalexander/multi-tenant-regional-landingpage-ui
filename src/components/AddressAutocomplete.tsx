'use client'

import { useState, useEffect, useRef } from 'react'
import { GoogleMapsService, AddressSuggestion } from '@/services/GoogleMapsService'
import { Check, AlertCircle, MapPin, Loader2 } from 'lucide-react'

interface AddressAutocompleteProps {
  value: string
  onChange: (value: string, zipCode?: string) => void
  onValidationChange?: (isValid: boolean, error?: string) => void
  placeholder?: string
  label?: string
  isValid?: boolean
  error?: string
  showFeedback?: boolean
}

export default function AddressAutocomplete({
  value,
  onChange,
  onValidationChange,
  placeholder = '123 Main Street, City, State',
  label = 'Property Address',
  isValid = false,
  error,
  showFeedback = false
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const mapsService = GoogleMapsService.getInstance()
  const hasError = showFeedback && !isValid && error
  const hasSuccess = showFeedback && isValid

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length < 3) {
        setSuggestions([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await mapsService.getAddressSuggestions(value)
        setSuggestions(results)
        setIsOpen(results.length > 0)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Error fetching address suggestions:', error)
        setSuggestions([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimeout = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimeout)
  }, [value])

  const handleSuggestionSelect = async (suggestion: AddressSuggestion) => {
    setIsLoading(true)
    try {
      const placeDetails = await mapsService.getPlaceDetails(suggestion.placeId)
      if (placeDetails) {
        const formattedAddress = mapsService.formatAddressForForm(placeDetails)
        const zipCode = mapsService.extractZipFromAddress(placeDetails)
        
        onChange(formattedAddress, zipCode || undefined)
        setIsOpen(false)
        setSuggestions([])
        
        // Validate the selected address
        if (onValidationChange) {
          onValidationChange(true)
        }
      }
    } catch (error) {
      console.error('Error getting place details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Basic validation for manual input
    if (onValidationChange) {
      if (newValue.length < 5) {
        onValidationChange(false, 'Please enter a complete address')
      } else if (newValue.length >= 10) {
        onValidationChange(true)
      }
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wide">
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-colors ${
            hasError 
              ? 'border-red-500 focus:ring-red-200' 
              : hasSuccess 
                ? 'border-green-500 focus:ring-green-200' 
                : 'border-gray-300 focus:ring-blue-500'
          }`}
          required
        />
        
        {/* Loading/Validation feedback icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 size={20} className="text-blue-500 animate-spin" />
          ) : showFeedback ? (
            <>
              {isValid ? (
                <Check size={20} className="text-green-500" />
              ) : error ? (
                <AlertCircle size={20} className="text-red-500" />
              ) : null}
            </>
          ) : null}
        </div>

        {/* Suggestions dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.placeId}
                type="button"
                onClick={() => handleSuggestionSelect(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {suggestion.structuredFormatting.mainText}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.structuredFormatting.secondaryText}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {hasError && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  )
}