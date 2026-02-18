'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { BestGymsByLocation } from '@/components/best-gym/best-gyms-by-location'

export default function BestCityGymsPage() {
  const params = useParams<{ city: string }>()
  const searchParams = useSearchParams()

  const slug = params.city
  const type = searchParams.get('type') || 'city'

  // Convert slug back to filter value: "new-york" → "New York"
  const filter = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return <BestGymsByLocation filter={filter} type={type} />
}
