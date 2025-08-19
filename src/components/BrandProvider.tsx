'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Brand } from '@/lib/brands'
import Analytics from './Analytics'

interface BrandContextType {
  brand: Brand
  utmSource?: string
  dynamicPhone: string
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

interface BrandProviderProps {
  children: ReactNode
  brand: Brand
  utmSource?: string
}

const phoneNumbers: Record<string, string> = {
  google: '1-800-111-2222',
  valpak: '1-800-333-4444',
  facebook: '1-800-555-6666',
  direct: '1-800-777-8888'
}

export function BrandProvider({ children, brand, utmSource }: BrandProviderProps) {
  const dynamicPhone = phoneNumbers[utmSource || 'direct'] || brand.phone

  return (
    <BrandContext.Provider value={{ brand, utmSource, dynamicPhone }}>
      <Analytics />
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}