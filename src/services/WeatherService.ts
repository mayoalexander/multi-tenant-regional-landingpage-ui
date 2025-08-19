export interface WeatherData {
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  icon: string
  location: {
    city: string
    state: string
  }
}

export interface WeatherAlert {
  title: string
  description: string
  severity: 'minor' | 'moderate' | 'severe' | 'extreme'
  type: 'weather' | 'security'
}

export class WeatherService {
  private static instance: WeatherService
  private weatherCache: Map<string, { data: WeatherData; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService()
    }
    return WeatherService.instance
  }

  async getWeatherByZip(zipCode: string): Promise<WeatherData | null> {
    const cacheKey = zipCode
    const cached = this.weatherCache.get(cacheKey)

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      // Mock weather data for demo - in production, use OpenWeatherMap or similar
      const weatherData = this.generateMockWeatherData(zipCode)
      
      // Cache the result
      this.weatherCache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      })

      return weatherData
    } catch (error) {
      console.error('Error fetching weather data:', error)
      return null
    }
  }

  async getWeatherByCoords(lat: number, lng: number): Promise<WeatherData | null> {
    try {
      // Convert coordinates to approximate ZIP for demo
      const zipCode = this.coordsToZip(lat, lng)
      return this.getWeatherByZip(zipCode)
    } catch (error) {
      console.error('Error fetching weather by coordinates:', error)
      return null
    }
  }

  private generateMockWeatherData(zipCode: string): WeatherData {
    // Mock weather based on ZIP code regions
    const zipPrefix = zipCode.substring(0, 2)
    const seasons = this.getCurrentSeason()
    
    // Base temperatures by region and season
    const regionTemps: Record<string, number> = {
      '27': 68, '28': 70, '29': 72, // NC, SC
      '37': 65, '38': 67, // TN  
      '30': 75, '31': 77, // GA
      '32': 82, '33': 84, '34': 80, // FL
      '35': 70, '36': 68 // AL
    }

    const baseTemp = regionTemps[zipPrefix] || 70
    const seasonalAdjustment = {
      spring: 0,
      summer: 15,
      fall: -5,
      winter: -20
    }[seasons]

    const temperature = baseTemp + seasonalAdjustment + Math.floor(Math.random() * 10 - 5)

    // Weather conditions based on temperature and region
    const conditions = this.getWeatherCondition(temperature, zipPrefix)
    
    return {
      temperature,
      condition: conditions.main,
      description: conditions.description,
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      windSpeed: Math.floor(Math.random() * 10) + 3, // 3-13 mph
      icon: conditions.icon,
      location: this.getLocationFromZip(zipPrefix)
    }
  }

  private getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  private getWeatherCondition(temp: number, region: string) {
    // Florida gets more sun, mountains get more clouds
    const isFL = region.startsWith('3')
    const isMountainous = ['28', '37'].includes(region)
    
    if (temp > 85) {
      return {
        main: 'Hot',
        description: isFL ? 'Hot and humid' : 'Hot and sunny',
        icon: '☀️'
      }
    } else if (temp > 75) {
      return {
        main: 'Warm',
        description: 'Warm and pleasant',
        icon: '🌤️'
      }
    } else if (temp > 60) {
      return {
        main: 'Mild',
        description: isMountainous ? 'Mild with some clouds' : 'Mild and comfortable',
        icon: isMountainous ? '⛅' : '🌤️'
      }
    } else if (temp > 45) {
      return {
        main: 'Cool',
        description: 'Cool and crisp',
        icon: '🌥️'
      }
    } else {
      return {
        main: 'Cold',
        description: 'Cold weather',
        icon: '❄️'
      }
    }
  }

  private getLocationFromZip(zipPrefix: string): { city: string; state: string } {
    const locations: Record<string, { city: string; state: string }> = {
      '27': { city: 'Raleigh', state: 'NC' },
      '28': { city: 'Charlotte', state: 'NC' },
      '29': { city: 'Columbia', state: 'SC' },
      '37': { city: 'Nashville', state: 'TN' },
      '38': { city: 'Memphis', state: 'TN' },
      '30': { city: 'Atlanta', state: 'GA' },
      '31': { city: 'Savannah', state: 'GA' },
      '32': { city: 'Jacksonville', state: 'FL' },
      '33': { city: 'Miami', state: 'FL' },
      '34': { city: 'Tampa', state: 'FL' },
      '35': { city: 'Birmingham', state: 'AL' },
      '36': { city: 'Mobile', state: 'AL' }
    }
    
    return locations[zipPrefix] || { city: 'Charlotte', state: 'NC' }
  }

  private coordsToZip(lat: number, lng: number): string {
    // Simple coordinate to ZIP mapping for Southeast US
    if (lat > 36 && lng < -82) return '27701' // NC
    if (lat > 34 && lat < 36 && lng < -82) return '29201' // SC
    if (lat > 35 && lng > -85) return '37201' // TN
    if (lat > 30 && lat < 35 && lng > -85) return '30301' // GA
    if (lat < 30 && lng > -85) return '32801' // FL
    if (lat > 32 && lat < 35 && lng < -87) return '35201' // AL
    return '27701'
  }

  generateSecurityAlert(weatherData: WeatherData): WeatherAlert | null {
    const { temperature, condition } = weatherData

    // Generate contextual security tips based on weather
    if (temperature > 85) {
      return {
        title: 'Hot Weather Security Tip',
        description: `With temperatures at ${temperature}°F, ensure your security system\'s outdoor components have proper ventilation. Consider upgrading to heat-resistant cameras for optimal performance.`,
        severity: 'minor',
        type: 'security'
      }
    }

    if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('rain')) {
      return {
        title: 'Weather Alert - Secure Your Property',
        description: 'Severe weather expected. Ensure windows are secure and consider activating enhanced monitoring for potential break-in attempts during power outages.',
        severity: 'moderate',
        type: 'security'
      }
    }

    if (temperature < 32) {
      return {
        title: 'Cold Weather System Check',
        description: `Freezing temperatures at ${temperature}°F can affect security equipment. Our systems are weather-resistant, but consider a winter maintenance check.`,
        severity: 'minor',
        type: 'security'
      }
    }

    return null
  }

  formatTemperatureDisplay(temp: number): string {
    return `${Math.round(temp)}°F`
  }

  getWeatherIcon(condition: string): string {
    const iconMap: Record<string, string> = {
      'sunny': '☀️',
      'hot': '🌞',
      'warm': '🌤️',
      'mild': '⛅',
      'cool': '🌥️',
      'cold': '❄️',
      'rain': '🌧️',
      'storm': '⛈️',
      'cloudy': '☁️'
    }
    
    return iconMap[condition.toLowerCase()] || '🌤️'
  }
}