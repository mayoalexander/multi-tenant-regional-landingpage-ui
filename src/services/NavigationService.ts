import { Brand } from '@/lib/brands'

export interface NavigationContext {
  currentBrand: Brand
  utmParams: Record<string, string>
  preserveParams: boolean
}

export interface BrandRoute {
  brandId: string
  path: string
  url: string
}

export class NavigationService {
  private static instance: NavigationService

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService()
    }
    return NavigationService.instance
  }

  buildBrandUrl(brand: Brand, preserveCurrentParams: boolean = true): string {
    const basePath = brand.id === 'safehaven' ? '/' : `/${brand.id}`
    
    if (!preserveCurrentParams || typeof window === 'undefined') {
      return basePath
    }

    const currentParams = new URLSearchParams(window.location.search)
    const paramString = currentParams.toString()
    
    return paramString ? `${basePath}?${paramString}` : basePath
  }

  navigateToBrand(brand: Brand, router: any, preserveParams: boolean = true): void {
    const url = this.buildBrandUrl(brand, preserveParams)
    router.push(url)
  }

  getUtmParameters(): Record<string, string> {
    if (typeof window === 'undefined') return {}
    
    const params = new URLSearchParams(window.location.search)
    const utmParams: Record<string, string> = {}
    
    const utmKeys = ['source', 'medium', 'campaign', 'term', 'content']
    utmKeys.forEach(key => {
      const value = params.get(key) || params.get(`utm_${key}`)
      if (value) {
        utmParams[key] = value
      }
    })

    return utmParams
  }

  buildUtmUrl(baseUrl: string, utmParams: Record<string, string>): string {
    const url = new URL(baseUrl, window.location.origin)
    
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        // Support both utm_source and source formats
        const paramKey = key.startsWith('utm_') ? key : `utm_${key}`
        url.searchParams.set(paramKey, value)
      }
    })

    return url.pathname + url.search
  }

  isCurrentBrand(brand: Brand): boolean {
    if (typeof window === 'undefined') return false
    
    const path = window.location.pathname
    
    if (brand.id === 'safehaven') {
      return path === '/' || !this.isValidBrandPath(path)
    }
    
    return path.startsWith(`/${brand.id}`)
  }

  extractBrandFromPath(path: string): string | null {
    if (path === '/') return 'safehaven'
    
    const segments = path.split('/').filter(Boolean)
    const brandId = segments[0]
    
    return this.isValidBrandId(brandId) ? brandId : null
  }

  buildCanonicalUrl(brand: Brand): string {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://safehavensecurity.com' 
      : 'http://localhost:3000'
    
    return brand.id === 'safehaven' ? baseUrl : `${baseUrl}/${brand.id}`
  }

  buildShareUrls(brand: Brand, currentUrl?: string): Record<string, string> {
    const url = encodeURIComponent(currentUrl || this.buildCanonicalUrl(brand))
    const title = encodeURIComponent(`${brand.name} - Professional Home Security Systems`)
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      email: `mailto:?subject=${title}&body=Check out ${url}`
    }
  }

  private isValidBrandPath(path: string): boolean {
    const validBrandIds = ['topsecurity', 'bestsecurity', 'redhawk']
    const segments = path.split('/').filter(Boolean)
    
    return segments.length > 0 && validBrandIds.includes(segments[0])
  }

  private isValidBrandId(brandId: string): boolean {
    const validIds = ['safehaven', 'topsecurity', 'bestsecurity', 'redhawk']
    return validIds.includes(brandId)
  }
}