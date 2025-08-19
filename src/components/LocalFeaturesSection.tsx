'use client'

import { useState, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { localFeatures, LocalFeature } from '@/data/content'
import WeatherWidget from './WeatherWidget'
import { MapPin, Star, Shield, Camera, Lock } from 'lucide-react'

export default function LocalFeaturesSection() {
  const { brand } = useBrand()
  const [relevantFeatures, setRelevantFeatures] = useState<LocalFeature[]>([])

  useEffect(() => {
    // Filter features based on brand's ZIP codes
    const brandZipPrefixes = brand.zipCodes
    const filtered = localFeatures.filter(feature => 
      feature.zipCodes.some(zip => 
        brandZipPrefixes.some(prefix => zip.startsWith(prefix))
      )
    )
    
    setRelevantFeatures(filtered.slice(0, 4)) // Show top 4
  }, [brand])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'attraction': return '🏛️'
      case 'business': return '🏢'
      case 'event': return '🎉'
      default: return '📍'
    }
  }

  const getSecurityIcon = () => {
    const icons = [Camera, Lock, Shield]
    return icons[Math.floor(Math.random() * icons.length)]
  }

  if (relevantFeatures.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Local Spotlight: {brand.states.join(', ')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover great places in your area and learn how {brand.name} keeps your community safe
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weather Widget - Left Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌤️</span>
                Local Weather & Security
              </h3>
              <WeatherWidget />
            </div>
          </div>

          {/* Local Features - Right Columns */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {relevantFeatures.map((feature) => {
                const SecurityIcon = getSecurityIcon()
                
                return (
                  <div key={feature.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">{getTypeIcon(feature.type)}</div>
                        <p className="text-sm opacity-90">Local Feature</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">
                            {feature.name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} />
                            {feature.address}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{feature.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {feature.description}
                      </p>

                      {/* Security Tip */}
                      <div className={`bg-gradient-to-r ${
                        brand.primaryColor === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-200' :
                        brand.primaryColor === 'emerald' ? 'from-emerald-50 to-green-50 border-emerald-200' :
                        brand.primaryColor === 'orange' ? 'from-orange-50 to-amber-50 border-orange-200' :
                        'from-red-50 to-pink-50 border-red-200'
                      } border rounded-lg p-4`}>
                        <div className="flex items-start gap-3">
                          <SecurityIcon size={16} className={`text-${brand.primaryColor}-600 mt-0.5 flex-shrink-0`} />
                          <div>
                            <h5 className={`text-${brand.primaryColor}-800 font-medium text-sm mb-1`}>
                              Security Tip
                            </h5>
                            <p className={`text-${brand.primaryColor}-700 text-xs leading-relaxed`}>
                              {feature.securityTip}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Protect What You Love in {brand.states.join(', ')}
                </h4>
                <p className="text-gray-700 mb-4">
                  Whether you're exploring local attractions or staying home, {brand.name} keeps you connected and secure.
                </p>
                <button className={`bg-gradient-to-r ${
                  brand.primaryColor === 'blue' ? 'from-blue-600 to-blue-700' :
                  brand.primaryColor === 'emerald' ? 'from-emerald-600 to-emerald-700' :
                  brand.primaryColor === 'orange' ? 'from-orange-600 to-orange-700' :
                  'from-red-600 to-red-700'
                } text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
                  Get Local Security Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}