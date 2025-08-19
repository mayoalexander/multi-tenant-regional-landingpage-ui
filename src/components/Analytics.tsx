'use client'

import { useEffect } from 'react'
import { useBrand } from './BrandProvider'

export default function Analytics() {
  const { brand, utmSource } = useBrand()

  useEffect(() => {
    // Create session ID if not exists
    if (!sessionStorage.getItem('sessionId')) {
      sessionStorage.setItem('sessionId', `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
    }

    // Initialize dataLayer for GA4/Segment
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.dataLayer = window.dataLayer || []
      
      // Track page view with brand and UTM data
      // @ts-ignore
      window.dataLayer.push({
        event: 'page_view',
        brand_id: brand.id,
        brand_name: brand.name,
        utm_source: utmSource || 'direct',
        utm_medium: new URLSearchParams(window.location.search).get('medium') || '',
        utm_campaign: new URLSearchParams(window.location.search).get('campaign') || '',
        page_location: window.location.href,
        page_title: document.title,
        session_id: sessionStorage.getItem('sessionId'),
        timestamp: new Date().toISOString()
      })

      // Track return visitor
      const lastVisit = localStorage.getItem('lastVisit')
      if (lastVisit) {
        // @ts-ignore
        window.dataLayer.push({
          event: 'returning_visitor',
          last_visit: lastVisit,
          brand_id: brand.id
        })
      }
      localStorage.setItem('lastVisit', new Date().toISOString())
    }
  }, [brand, utmSource])

  return null
}