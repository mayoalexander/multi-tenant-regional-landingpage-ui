import { getBrandById } from '@/lib/brands'
import { BrandProvider } from '@/components/BrandProvider'
import { notFound } from 'next/navigation'
import HomePage from '@/components/HomePage'

interface BrandPageProps {
  params: Promise<{ brand: string }>
  searchParams: Promise<{ source?: string }>
}

export default async function BrandPage({ params, searchParams }: BrandPageProps) {
  const { brand: brandId } = await params
  const { source } = await searchParams
  
  const brand = getBrandById(brandId)
  
  if (!brand || brand.id === 'safehaven') {
    notFound()
  }

  return (
    <BrandProvider brand={brand} utmSource={source}>
      <HomePage />
    </BrandProvider>
  )
}

export async function generateStaticParams() {
  return [
    { brand: 'topsecurity' },
    { brand: 'bestsecurity' },
    { brand: 'redhawk' }
  ]
}