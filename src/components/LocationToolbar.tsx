'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBrand } from './BrandProvider'
import { LocationService } from '@/services/LocationService'
import { NavigationService } from '@/services/NavigationService'
import { AnalyticsService } from '@/services/AnalyticsService'
import { Phone, MapPin, ChevronDown } from 'lucide-react'

export default function LocationToolbar() {
  const { brand, dynamicPhone } = useBrand()
  const [isOpen, setIsOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<string>('')
  const [locationSuggestion, setLocationSuggestion] = useState<string | null>(null)
  const [hasLocationAccess, setHasLocationAccess] = useState<boolean>(false)
  const router = useRouter()

  const locationService = LocationService.getInstance()
  const navigationService = NavigationService.getInstance()
  const analyticsService = AnalyticsService.getInstance()

  useEffect(() => {
    initializeLocationDetection()
  }, [])

  const initializeLocationDetection = async () => {
    const locationData = await locationService.detectUserLocation()
    
    if (locationData) {
      setUserLocation(locationData.userRegion)
      setHasLocationAccess(true)
      
      const suggestion = locationService.getBrandSuggestion(brand, locationData.detectedBrand)
      setLocationSuggestion(suggestion)

      // Auto-redirect if needed
      if (locationData.detectedBrand.id !== brand.id && locationData.detectedBrand.id !== 'safehaven') {
        analyticsService.trackBrandSwitch(brand.id, locationData.detectedBrand.id, 'location_detection')
        navigationService.navigateToBrand(locationData.detectedBrand, router)
      }
    } else {
      setHasLocationAccess(false)
    }
  }

  const handleBrandSwitch = (newBrand: any) => {
    analyticsService.trackBrandSwitch(brand.id, newBrand.id, 'manual_switch')
    navigationService.navigateToBrand(newBrand, router)
    setIsOpen(false)
  }

  const handlePhoneClick = () => {
    analyticsService.trackPhoneClick(dynamicPhone, brand)
  }

  return (
    <div className="bg-gray-900 text-white py-2 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Brand Name */}
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-white">
            {brand.name}
          </h1>
        </div>

        {/* Right: Location Selector & Phone */}
        <div className="flex items-center gap-3">
          {locationSuggestion && (
            <div className="hidden md:block text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
              {locationSuggestion}
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
              title={`Switch Region ${userLocation ? `(Currently: ${userLocation})` : ''}`}
            >
              <MapPin size={16} className={hasLocationAccess ? 'text-green-400' : 'text-gray-400'} />
              <span className="hidden sm:inline text-sm font-medium">Region</span>
              <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white text-gray-900 rounded-lg shadow-lg border min-w-64 z-50">
                <div className="p-2 border-b">
                  <p className="text-xs text-gray-600 font-medium">Switch to your region:</p>
                </div>
{locationService.getAllBrands().map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleBrandSwitch(b)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center justify-between ${
                      b.id === brand.id ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{b.name}</div>
                      <div className="text-xs text-gray-500">{b.states.join(', ')}</div>
                    </div>
                    {b.id === brand.id && (
                      <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Current
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={`tel:${dynamicPhone}`}
            onClick={handlePhoneClick}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg font-semibold transition-colors"
            title={`Call ${dynamicPhone}`}
          >
            <Phone size={16} />
            <span className="hidden sm:inline">Call</span>
            <span className="hidden sm:inline">{dynamicPhone}</span>
          </a>
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}