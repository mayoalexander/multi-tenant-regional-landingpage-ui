'use client'

import { useBrand } from './BrandProvider'
import LeadForm from './LeadForm'
import ZipRouter from './ZipRouter'
import LocationToolbar from './LocationToolbar'
import LocationPermissionBanner from './LocationPermissionBanner'
import { Shield, Phone, MapPin } from 'lucide-react'

export default function HomePage() {
  const { brand, dynamicPhone } = useBrand()

  const colorMap = {
    blue: 'from-blue-600 to-blue-800',
    emerald: 'from-emerald-600 to-emerald-800', 
    orange: 'from-orange-600 to-orange-800',
    red: 'from-red-600 to-red-800'
  }

  const textColorMap = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    orange: 'text-orange-600', 
    red: 'text-red-600'
  }

  const featureBgMap = {
    blue: 'from-blue-50 to-indigo-100',
    emerald: 'from-emerald-50 to-green-100',
    orange: 'from-orange-50 to-amber-100',
    red: 'from-red-50 to-pink-100'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationPermissionBanner />
      <LocationToolbar />
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${colorMap[brand.primaryColor as keyof typeof colorMap]} text-white`}>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Protect Your Home with {brand.name}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Award-winning security systems trusted by families across the Southeast. 
                Get instant protection with professional monitoring 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a 
                  href={`tel:${dynamicPhone}`}
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 justify-center"
                >
                  <Phone size={20} />
                  Call {dynamicPhone}
                </a>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-gray-800 transition-colors">
                  Get Free Quote
                </button>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto lg:mx-0">
                <p className="text-sm mb-2 opacity-90">Not in {brand.states.join(', ')}? Find your local security provider:</p>
                <ZipRouter />
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <LeadForm />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-16 bg-gradient-to-br ${featureBgMap[brand.primaryColor as keyof typeof featureBgMap]}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Why Choose {brand.name}?
          </h2>
          <p className="text-center text-gray-700 mb-12 text-lg max-w-2xl mx-auto">
            Trusted by thousands of families across the Southeast for professional security solutions
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorMap[brand.primaryColor as keyof typeof colorMap]} flex items-center justify-center`}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Professional Monitoring</h3>
              <p className="text-gray-700">24/7 monitoring by certified security professionals with instant emergency response</p>
            </div>
            <div className="text-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorMap[brand.primaryColor as keyof typeof colorMap]} flex items-center justify-center`}>
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Local Expertise</h3>
              <p className="text-gray-700">Serving {brand.states.join(', ')} with dedicated local support teams who know your area</p>
            </div>
            <div className="text-center bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorMap[brand.primaryColor as keyof typeof colorMap]} flex items-center justify-center`}>
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Response</h3>
              <p className="text-gray-700">Rapid emergency response when you need it most, with direct police dispatch</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}