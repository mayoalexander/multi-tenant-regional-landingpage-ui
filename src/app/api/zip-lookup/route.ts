import { NextRequest, NextResponse } from 'next/server'
import { getBrandByZip } from '@/lib/brands'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zip = searchParams.get('zip')

  if (!zip || zip.length < 2) {
    return NextResponse.json({ error: 'Valid ZIP code required' }, { status: 400 })
  }

  try {
    const brand = getBrandByZip(zip)
    
    return NextResponse.json({
      zip,
      brand: {
        id: brand.id,
        name: brand.name,
        phone: brand.phone,
        states: brand.states
      },
      redirect: brand.id === 'safehaven' ? '/' : `/${brand.id}`
    })

  } catch (error) {
    console.error('ZIP lookup error:', error)
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 })
  }
}