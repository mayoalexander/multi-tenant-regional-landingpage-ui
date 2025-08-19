import { getBrandById } from '@/lib/brands'
import { BrandProvider } from '@/components/BrandProvider'
import HomePage from '@/components/HomePage'

interface HomeProps {
  searchParams: Promise<{ source?: string; zip?: string }>
}

export default async function Home({ searchParams }: HomeProps) {
  const { source, zip } = await searchParams
  const brand = getBrandById('safehaven')

  return (
    <BrandProvider brand={brand} utmSource={source}>
      <HomePage />
    </BrandProvider>
  )
}
