'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface ZipRouterProps {
  className?: string
}

export default function ZipRouter({ className = '' }: ZipRouterProps) {
  const [zip, setZip] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!zip || zip.length < 5) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/zip-lookup?zip=${zip}`)
      const data = await response.json()
      
      if (data.redirect) {
        router.push(data.redirect + `?zip=${zip}`)
      }
    } catch (error) {
      console.error('ZIP lookup failed:', error)
      alert('Unable to find your area. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        placeholder="Enter ZIP code"
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        maxLength={5}
        required
      />
      <button
        type="submit"
        disabled={zip.length < 5 || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Search size={18} />
        {isLoading ? 'Finding...' : 'Find My Area'}
      </button>
    </form>
  )
}