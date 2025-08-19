'use client'

import { useState, useEffect } from 'react'
import { WeatherService, WeatherData, WeatherAlert } from '@/services/WeatherService'
import { LocationService } from '@/services/LocationService'
import { useBrand } from './BrandProvider'
import { MapPin, Thermometer, Droplets, Wind, Shield, AlertTriangle } from 'lucide-react'

export default function WeatherWidget() {
  const { brand } = useBrand()
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [weatherAlert, setWeatherAlert] = useState<WeatherAlert | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const weatherService = WeatherService.getInstance()
  const locationService = LocationService.getInstance()

  useEffect(() => {
    loadWeatherData()
  }, [])

  const loadWeatherData = async () => {
    try {
      setIsLoading(true)
      
      // Try to get user's location first
      const locationData = await locationService.detectUserLocation()
      let weather: WeatherData | null = null

      if (locationData) {
        // Use detected ZIP code
        weather = await weatherService.getWeatherByZip(locationData.zipCode)
      } else {
        // Fallback to brand's default location
        const defaultZip = brand.zipCodes[0] + '01' // Add digits to make 5-digit ZIP
        weather = await weatherService.getWeatherByZip(defaultZip)
      }

      if (weather) {
        setWeatherData(weather)
        
        // Generate security alert based on weather
        const alert = weatherService.generateSecurityAlert(weather)
        setWeatherAlert(alert)
      }
    } catch (error) {
      console.error('Error loading weather data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-100 border-red-300 text-red-800'
      case 'severe': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'moderate': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  if (!weatherData) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Weather Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {weatherData.location.city}, {weatherData.location.state}
          </span>
        </div>
        <div className="text-2xl">{weatherData.icon}</div>
      </div>

      {/* Temperature and Condition */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-gray-900">
            {weatherService.formatTemperatureDisplay(weatherData.temperature)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{weatherData.condition}</div>
            <div className="text-sm text-gray-600">{weatherData.description}</div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Thermometer size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">Feels like {weatherData.temperature + 2}°F</span>
          </div>
          <div className="flex items-center gap-1">
            <Droplets size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">{weatherData.humidity}% humidity</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={14} className="text-gray-400" />
            <span className="text-xs text-gray-600">{weatherData.windSpeed} mph wind</span>
          </div>
        </div>
      </div>

      {/* Security Alert */}
      {weatherAlert && (
        <div className={`rounded-lg border p-3 ${getAlertColor(weatherAlert.severity)}`}>
          <div className="flex items-start gap-2">
            {weatherAlert.type === 'security' ? (
              <Shield size={16} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">{weatherAlert.title}</h4>
              <p className="text-xs leading-relaxed">{weatherAlert.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-2">
          Your security system works in all weather conditions.
        </p>
        <button className={`w-full bg-gradient-to-r ${
          brand.primaryColor === 'blue' ? 'from-blue-500 to-blue-600' :
          brand.primaryColor === 'emerald' ? 'from-emerald-500 to-emerald-600' :
          brand.primaryColor === 'orange' ? 'from-orange-500 to-orange-600' :
          'from-red-500 to-red-600'
        } text-white px-3 py-2 rounded text-xs font-medium hover:opacity-90 transition-opacity`}>
          Get Weather-Ready Security Quote
        </button>
      </div>
    </div>
  )
}