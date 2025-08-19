import { Brand } from '@/lib/brands'

export interface AnalyticsEvent {
  event: string
  [key: string]: any
}

export interface PageViewData {
  brand_id: string
  brand_name: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  page_location: string
  page_title: string
  session_id: string
  timestamp: string
}

export interface LeadTrackingData {
  lead_id?: string
  form_step: number
  brand_id: string
  utm_source: string
  conversion_value?: number
}

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

export class AnalyticsService {
  private static instance: AnalyticsService
  private sessionId: string = ''

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  initialize(): void {
    this.initializeDataLayer()
    this.sessionId = this.getOrCreateSessionId()
  }

  trackPageView(brand: Brand, utmSource?: string): void {
    const pageViewData: PageViewData = {
      brand_id: brand.id,
      brand_name: brand.name,
      utm_source: utmSource || 'direct',
      utm_medium: this.getUrlParam('medium'),
      utm_campaign: this.getUrlParam('campaign'),
      page_location: window.location.href,
      page_title: document.title,
      session_id: this.sessionId,
      timestamp: new Date().toISOString()
    }

    this.pushToDataLayer({
      event: 'page_view',
      ...pageViewData
    })

    this.trackReturningVisitor(brand.id)
  }

  trackFormInteraction(step: number, brand: Brand, utmSource?: string): void {
    const trackingData: LeadTrackingData = {
      form_step: step,
      brand_id: brand.id,
      utm_source: utmSource || 'direct'
    }

    this.pushToDataLayer({
      event: 'form_step_completed',
      ...trackingData
    })
  }

  trackLeadSubmission(leadId: string, brand: Brand, utmSource?: string): void {
    const conversionData: LeadTrackingData = {
      lead_id: leadId,
      form_step: 3,
      brand_id: brand.id,
      utm_source: utmSource || 'direct',
      conversion_value: this.getConversionValue(brand.id)
    }

    this.pushToDataLayer({
      event: 'lead_submitted',
      ...conversionData
    })

    // Enhanced e-commerce tracking for lead value
    this.pushToDataLayer({
      event: 'purchase',
      transaction_id: leadId,
      value: conversionData.conversion_value,
      currency: 'USD',
      items: [{
        item_id: 'security_quote',
        item_name: 'Security System Quote',
        item_brand: brand.name,
        item_category: 'Home Security',
        quantity: 1,
        price: conversionData.conversion_value
      }]
    })
  }

  trackPhoneClick(phoneNumber: string, brand: Brand, utmSource?: string): void {
    this.pushToDataLayer({
      event: 'phone_click',
      phone_number: phoneNumber,
      brand_id: brand.id,
      utm_source: utmSource || 'direct'
    })
  }

  trackBrandSwitch(fromBrand: string, toBrand: string, method: 'location_detection' | 'manual_switch'): void {
    this.pushToDataLayer({
      event: 'brand_switch',
      from_brand: fromBrand,
      to_brand: toBrand,
      switch_method: method
    })
  }

  trackLocationPermission(granted: boolean): void {
    this.pushToDataLayer({
      event: 'location_permission',
      permission_granted: granted
    })
  }

  private initializeDataLayer(): void {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || []
    }
  }

  private pushToDataLayer(event: AnalyticsEvent): void {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(event)
      
      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event)
      }
    }
  }

  private trackReturningVisitor(brandId: string): void {
    const lastVisitKey = `lastVisit_${brandId}`
    const lastVisit = localStorage.getItem(lastVisitKey)
    
    if (lastVisit) {
      const daysSinceLastVisit = Math.floor(
        (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24)
      )

      this.pushToDataLayer({
        event: 'returning_visitor',
        brand_id: brandId,
        days_since_last_visit: daysSinceLastVisit
      })
    }

    localStorage.setItem(lastVisitKey, Date.now().toString())
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('analytics_session_id', sessionId)
    }

    return sessionId
  }

  private getUrlParam(param: string): string {
    if (typeof window === 'undefined') return ''
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param) || ''
  }

  private getConversionValue(brandId: string): number {
    // Mock conversion values per brand (in real app, from config/CRM)
    const brandValues: Record<string, number> = {
      safehaven: 250,
      topsecurity: 275,
      bestsecurity: 300,
      redhawk: 225
    }
    return brandValues[brandId] || 250
  }
}