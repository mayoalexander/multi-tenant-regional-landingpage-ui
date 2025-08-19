'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'

export default function LocationPermissionBanner() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user has already been asked or dismissed
    const hasAsked = localStorage.getItem('locationAsked')
    const hasDismissed = localStorage.getItem('locationDismissed')
    
    if (!hasAsked && !hasDismissed && 'geolocation' in navigator) {
      setShow(true)
    }
  }, [])

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => {
        localStorage.setItem('locationAsked', 'true')
        setShow(false)
        // Trigger a page refresh to activate location detection
        window.location.reload()
      },
      () => {
        localStorage.setItem('locationAsked', 'true')
        setShow(false)
      }
    )
  }

  const dismiss = () => {
    localStorage.setItem('locationDismissed', 'true')
    setDismissed(true)
    setShow(false)
  }

  if (!show || dismissed) return null

  return (
    <div className="bg-blue-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin size={20} />
          <div>
            <p className="font-medium">Get personalized security recommendations</p>
            <p className="text-sm opacity-90">Allow location access to find your local security provider</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={requestLocation}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Allow Location
          </button>
          <button
            onClick={dismiss}
            className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}