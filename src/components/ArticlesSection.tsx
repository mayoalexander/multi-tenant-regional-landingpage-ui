'use client'

import { useState, useEffect } from 'react'
import { useBrand } from './BrandProvider'
import { articles, Article } from '@/data/content'
import { Clock, ArrowRight, Shield, MapPin, Zap, BookOpen } from 'lucide-react'

export default function ArticlesSection() {
  const { brand } = useBrand()
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])

  useEffect(() => {
    // Prioritize local articles, then show general ones
    const localArticles = articles.filter(article => 
      article.localArea?.some(area => brand.states.includes(area))
    )
    const generalArticles = articles.filter(article => !article.localArea)
    
    // Combine and take top 6
    const combined = [...localArticles, ...generalArticles].slice(0, 6)
    setFeaturedArticles(combined)
  }, [brand])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security-tips': return Shield
      case 'local-news': return MapPin
      case 'product-updates': return Zap
      case 'safety-guides': return BookOpen
      default: return Shield
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security-tips': return 'bg-blue-100 text-blue-800'
      case 'local-news': return 'bg-green-100 text-green-800'
      case 'product-updates': return 'bg-purple-100 text-purple-800'
      case 'safety-guides': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (featuredArticles.length === 0) return null

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Security Insights & Local News
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Stay informed with the latest security tips, local updates, and safety guides for {brand.states.join(', ')}
          </p>
        </div>

        {/* Featured Article */}
        <div className="mb-12">
          <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
            <div className="md:flex">
              <div className="md:flex-1 p-8 md:p-12">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredArticles[0].category)}`}>
                    {formatCategory(featuredArticles[0].category)}
                  </span>
                  {featuredArticles[0].localArea && (
                    <span className="text-xs text-gray-500">
                      • {featuredArticles[0].localArea.join(', ')}
                    </span>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredArticles[0].title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {featuredArticles[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      {featuredArticles[0].readTime} min read
                    </div>
                    <div>
                      {new Date(featuredArticles[0].publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className={`flex items-center gap-2 text-${brand.primaryColor}-600 hover:text-${brand.primaryColor}-700 font-medium`}>
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="h-64 md:h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <Shield size={48} className="mx-auto mb-2" />
                    <p className="text-sm">Article Image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredArticles.slice(1).map((article) => {
            const IconComponent = getCategoryIcon(article.category)
            
            return (
              <div key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <IconComponent size={32} className="mx-auto mb-2" />
                    <p className="text-xs">Article Image</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {formatCategory(article.category)}
                    </span>
                    {article.localArea && (
                      <span className="text-xs text-gray-500">
                        {article.localArea.join(', ')}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {article.readTime} min
                      </div>
                      <div>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button className={`text-${brand.primaryColor}-600 hover:text-${brand.primaryColor}-700 text-sm font-medium`}>
                      Read →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className={`bg-gradient-to-r ${
            brand.primaryColor === 'blue' ? 'from-blue-600 to-blue-700' :
            brand.primaryColor === 'emerald' ? 'from-emerald-600 to-emerald-700' :
            brand.primaryColor === 'orange' ? 'from-orange-600 to-orange-700' :
            'from-red-600 to-red-700'
          } text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}>
            View All Security Articles
          </button>
        </div>
      </div>
    </section>
  )
}