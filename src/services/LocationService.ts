import { brands, Brand, getBrandByZip } from '@/lib/brands'

interface LocationData {
  zipCode: string
  coordinates?: { lat: number; lng: number }
  detectedBrand: Brand
  userRegion: string
}

interface LocationPermissions {
  granted: boolean
  denied: boolean
  prompt: boolean
}

export class LocationService {
  private static instance: LocationService
  private locationCache: Map<string, LocationData> = new Map()

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService()
    }
    return LocationService.instance
  }

  async detectUserLocation(): Promise<LocationData | null> {
    try {
      const cachedLocation = this.getCachedLocation()
      if (cachedLocation) return cachedLocation

      const position = await this.requestGeolocation()
      const mockZip = this.coordinatesToZip(position.coords.latitude, position.coords.longitude)
      const detectedBrand = getBrandByZip(mockZip)
      
      const locationData: LocationData = {
        zipCode: mockZip,
        coordinates: { lat: position.coords.latitude, lng: position.coords.longitude },
        detectedBrand,
        userRegion: `${detectedBrand.states[0]} - ${mockZip}`
      }

      this.cacheLocation(locationData)
      return locationData

    } catch (error) {
      console.warn('Location detection failed:', error)
      return null
    }
  }

  async checkLocationPermissions(): Promise<LocationPermissions> {
    if (!navigator.geolocation) {
      return { granted: false, denied: true, prompt: false }
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      return {
        granted: permission.state === 'granted',
        denied: permission.state === 'denied',
        prompt: permission.state === 'prompt'
      }
    } catch {
      return { granted: false, denied: false, prompt: true }
    }
  }

  shouldShowLocationBanner(): boolean {
    const hasAsked = localStorage.getItem('locationAsked')
    const hasDismissed = localStorage.getItem('locationDismissed')
    return !hasAsked && !hasDismissed && 'geolocation' in navigator
  }

  markLocationAsked(): void {
    localStorage.setItem('locationAsked', 'true')
  }

  markLocationDismissed(): void {
    localStorage.setItem('locationDismissed', 'true')
  }

  getAllBrands(): Brand[] {
    return brands
  }

  getBrandSuggestion(currentBrand: Brand, detectedBrand?: Brand): string | null {
    if (!detectedBrand || detectedBrand.id === currentBrand.id) return null
    return `You might prefer ${detectedBrand.name}`
  }

  private requestGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: false
      })
    })
  }

  private coordinatesToZip(lat: number, lng: number): string {
    // Mock ZIP assignment based on Southeast regions
    const regions = [
      { bounds: { latMin: 36, latMax: 40, lngMin: -84, lngMax: -80 }, zip: '27701' }, // NC
      { bounds: { latMin: 32, latMax: 36, lngMin: -84, lngMax: -78 }, zip: '29201' }, // SC
      { bounds: { latMin: 35, latMax: 37, lngMin: -91, lngMax: -81 }, zip: '37201' }, // TN
      { bounds: { latMin: 30, latMax: 35, lngMin: -86, lngMax: -80 }, zip: '30301' }, // GA
      { bounds: { latMin: 24, latMax: 31, lngMin: -88, lngMax: -79 }, zip: '32801' }, // FL
      { bounds: { latMin: 30, latMax: 36, lngMin: -89, lngMax: -84 }, zip: '35201' }  // AL
    ]

    for (const region of regions) {
      const { latMin, latMax, lngMin, lngMax } = region.bounds
      if (lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax) {
        return region.zip
      }
    }

    return '27701' // Default to NC
  }

  private getCachedLocation(): LocationData | null {
    const cached = localStorage.getItem('userLocation')
    if (!cached) return null

    try {
      const data = JSON.parse(cached)
      const cacheTime = data.timestamp || 0
      const isExpired = Date.now() - cacheTime > 24 * 60 * 60 * 1000 // 24 hours

      return isExpired ? null : data.location
    } catch {
      return null
    }
  }

  private cacheLocation(location: LocationData): void {
    const cacheData = {
      location,
      timestamp: Date.now()
    }
    localStorage.setItem('userLocation', JSON.stringify(cacheData))
  }
}