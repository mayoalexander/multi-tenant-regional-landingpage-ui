export interface AddressSuggestion {
  description: string
  placeId: string
  structuredFormatting: {
    mainText: string
    secondaryText: string
  }
}

export interface AddressComponents {
  streetNumber?: string
  route?: string
  locality?: string
  administrativeAreaLevel1?: string
  postalCode?: string
  country?: string
}

export interface PlaceDetails {
  formattedAddress: string
  addressComponents: AddressComponents
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

declare global {
  interface Window {
    google?: any
    initGoogleMaps?: () => void
  }
}

export class GoogleMapsService {
  private static instance: GoogleMapsService
  private isLoaded: boolean = false
  private loadPromise: Promise<boolean> | null = null
  private autocompleteService: any = null
  private placesService: any = null
  private geocoder: any = null

  static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService()
    }
    return GoogleMapsService.instance
  }

  async loadGoogleMapsAPI(): Promise<boolean> {
    if (this.isLoaded) return true
    if (this.loadPromise) return this.loadPromise

    this.loadPromise = new Promise((resolve, reject) => {
      // Mock Google Maps for demo - in production, use real API key
      if (typeof window === 'undefined') {
        resolve(false)
        return
      }

      // Simulate Google Maps API loading
      setTimeout(() => {
        // Mock Google Maps objects
        window.google = {
          maps: {
            places: {
              AutocompleteService: class MockAutocompleteService {
                getPlacePredictions(request: any, callback: any) {
                  // Mock address suggestions based on input
                  const input = request.input.toLowerCase()
                  const mockSuggestions = [
                    {
                      description: `${input} Main Street, Charlotte, NC`,
                      place_id: 'mock_place_1',
                      structured_formatting: {
                        main_text: `${input} Main Street`,
                        secondary_text: 'Charlotte, NC, USA'
                      }
                    },
                    {
                      description: `${input} Oak Avenue, Raleigh, NC`,
                      place_id: 'mock_place_2', 
                      structured_formatting: {
                        main_text: `${input} Oak Avenue`,
                        secondary_text: 'Raleigh, NC, USA'
                      }
                    },
                    {
                      description: `${input} Pine Street, Durham, NC`,
                      place_id: 'mock_place_3',
                      structured_formatting: {
                        main_text: `${input} Pine Street`,
                        secondary_text: 'Durham, NC, USA'
                      }
                    }
                  ]

                  // Only return suggestions if input has 3+ characters
                  if (input.length >= 3) {
                    setTimeout(() => callback(mockSuggestions, 'OK'), 300)
                  } else {
                    callback([], 'ZERO_RESULTS')
                  }
                }
              },
              PlacesService: class MockPlacesService {
                constructor() {}
                getDetails(request: any, callback: any) {
                  // Mock place details
                  const mockDetails = {
                    formatted_address: request.placeId.includes('place_1') 
                      ? '123 Main Street, Charlotte, NC 28202, USA'
                      : request.placeId.includes('place_2')
                        ? '456 Oak Avenue, Raleigh, NC 27601, USA'
                        : '789 Pine Street, Durham, NC 27701, USA',
                    address_components: [
                      { long_name: '123', types: ['street_number'] },
                      { long_name: 'Main Street', types: ['route'] },
                      { long_name: 'Charlotte', types: ['locality'] },
                      { long_name: 'North Carolina', types: ['administrative_area_level_1'] },
                      { long_name: '28202', types: ['postal_code'] },
                      { long_name: 'USA', types: ['country'] }
                    ],
                    geometry: {
                      location: {
                        lat: () => 35.2271,
                        lng: () => -80.8431
                      }
                    }
                  }
                  setTimeout(() => callback(mockDetails, 'OK'), 200)
                }
              }
            },
            Geocoder: class MockGeocoder {
              geocode(request: any, callback: any) {
                const mockResults = [{
                  formatted_address: '123 Main Street, Charlotte, NC 28202, USA',
                  geometry: {
                    location: {
                      lat: () => 35.2271,
                      lng: () => -80.8431
                    }
                  }
                }]
                setTimeout(() => callback(mockResults, 'OK'), 200)
              }
            }
          }
        }

        this.isLoaded = true
        this.initializeServices()
        resolve(true)
      }, 500)
    })

    return this.loadPromise
  }

  private initializeServices(): void {
    if (!window.google) return

    this.autocompleteService = new window.google.maps.places.AutocompleteService()
    this.geocoder = new window.google.maps.Geocoder()
    
    // Create a dummy map element for PlacesService (required by Google Maps)
    const dummyMap = document.createElement('div')
    this.placesService = new window.google.maps.places.PlacesService(dummyMap)
  }

  async getAddressSuggestions(input: string): Promise<AddressSuggestion[]> {
    if (!this.isLoaded) {
      await this.loadGoogleMapsAPI()
    }

    if (!this.autocompleteService || input.length < 3) {
      return []
    }

    return new Promise((resolve) => {
      this.autocompleteService.getPlacePredictions(
        {
          input,
          types: ['address'],
          componentRestrictions: { country: 'us' }
        },
        (predictions: any[], status: string) => {
          if (status === 'OK' && predictions) {
            const suggestions: AddressSuggestion[] = predictions.map(prediction => ({
              description: prediction.description,
              placeId: prediction.place_id,
              structuredFormatting: {
                mainText: prediction.structured_formatting.main_text,
                secondaryText: prediction.structured_formatting.secondary_text
              }
            }))
            resolve(suggestions)
          } else {
            resolve([])
          }
        }
      )
    })
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
    if (!this.isLoaded) {
      await this.loadGoogleMapsAPI()
    }

    if (!this.placesService) {
      return null
    }

    return new Promise((resolve) => {
      this.placesService.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'address_components', 'geometry']
        },
        (place: any, status: string) => {
          if (status === 'OK' && place) {
            const addressComponents: AddressComponents = {}
            
            place.address_components?.forEach((component: any) => {
              const types = component.types
              if (types.includes('street_number')) {
                addressComponents.streetNumber = component.long_name
              } else if (types.includes('route')) {
                addressComponents.route = component.long_name
              } else if (types.includes('locality')) {
                addressComponents.locality = component.long_name
              } else if (types.includes('administrative_area_level_1')) {
                addressComponents.administrativeAreaLevel1 = component.long_name
              } else if (types.includes('postal_code')) {
                addressComponents.postalCode = component.long_name
              } else if (types.includes('country')) {
                addressComponents.country = component.long_name
              }
            })

            const placeDetails: PlaceDetails = {
              formattedAddress: place.formatted_address,
              addressComponents,
              geometry: {
                location: {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng()
                }
              }
            }
            resolve(placeDetails)
          } else {
            resolve(null)
          }
        }
      )
    })
  }

  extractZipFromAddress(placeDetails: PlaceDetails): string | null {
    return placeDetails.addressComponents.postalCode || null
  }

  formatAddressForForm(placeDetails: PlaceDetails): string {
    const components = placeDetails.addressComponents
    const parts = []
    
    if (components.streetNumber && components.route) {
      parts.push(`${components.streetNumber} ${components.route}`)
    } else if (components.route) {
      parts.push(components.route)
    }
    
    if (components.locality) {
      parts.push(components.locality)
    }
    
    if (components.administrativeAreaLevel1) {
      parts.push(components.administrativeAreaLevel1)
    }
    
    return parts.join(', ')
  }
}