'use client'

import { useState, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { testimonials, Testimonial } from '@/data/content'
import { Star, Shield, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TestimonialsSection() {
  const { brand } = useBrand()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([])

  useEffect(() => {
    // Filter testimonials based on brand location
    const brandStates = brand.states
    const relevant = testimonials.filter(testimonial => 
      brandStates.some(state => testimonial.location.includes(state))
    )
    
    // If no local testimonials, show all (for demo purposes)
    setFilteredTestimonials(relevant.length > 0 ? relevant : testimonials.slice(0, 3))
  }, [brand])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length)
  }

  const colorMap = {
    blue: 'text-blue-600',
    emerald: 'text-emerald-600',
    orange: 'text-orange-600',
    red: 'text-red-600'
  }

  const bgColorMap = {
    blue: 'from-blue-50 to-indigo-100',
    emerald: 'from-emerald-50 to-green-100',
    orange: 'from-orange-50 to-amber-100',
    red: 'from-red-50 to-pink-100'
  }

  if (filteredTestimonials.length === 0) return null

  const currentTestimonial = filteredTestimonials[currentIndex]

  return (
    <section className={`py-16 bg-gradient-to-br ${bgColorMap[brand.primaryColor as keyof typeof bgColorMap]}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Real stories from {brand.name} customers who trust us to protect what matters most
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-center justify-between mb-6">
              <Quote size={48} className={`${colorMap[brand.primaryColor as keyof typeof colorMap]} opacity-20`} />
              <div className="flex items-center gap-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            <blockquote className="text-xl md:text-2xl text-gray-900 font-medium leading-relaxed mb-8">
              "{currentTestimonial.text}"
            </blockquote>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                  brand.primaryColor === 'blue' ? 'from-blue-500 to-blue-600' :
                  brand.primaryColor === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                  brand.primaryColor === 'orange' ? 'from-orange-500 to-orange-600' :
                  'from-red-500 to-red-600'
                } flex items-center justify-center text-white font-bold text-lg`}>
                  {currentTestimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {currentTestimonial.name}
                    {currentTestimonial.verified && (
                      <Shield size={16} className="text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-600">{currentTestimonial.location}</div>
                  <div className="text-xs text-gray-500">{currentTestimonial.serviceType}</div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {new Date(currentTestimonial.date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredTestimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {filteredTestimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex 
                      ? `bg-${brand.primaryColor}-600` 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-4">Join thousands of satisfied customers in your area</p>
          <button className={`bg-gradient-to-r ${
            brand.primaryColor === 'blue' ? 'from-blue-600 to-blue-700' :
            brand.primaryColor === 'emerald' ? 'from-emerald-600 to-emerald-700' :
            brand.primaryColor === 'orange' ? 'from-orange-600 to-orange-700' :
            'from-red-600 to-red-700'
          } text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
            Get Your Free Security Quote
          </button>
        </div>
      </div>
    </section>
  )
}