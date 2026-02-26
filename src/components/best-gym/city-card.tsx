'use client'

import Link from 'next/link'
import { gymCities } from '@/types/gym'
import { MapPin } from 'lucide-react'

interface BestGymCityCardProps {
  gym: gymCities
  selectMode?: boolean
  onSelect?: () => void
}

export function BestGymCityCard({ gym, selectMode, onSelect }: BestGymCityCardProps) {
  // const image = gym.featureImage || gym.gallery?.[0]?.path || '/images/bg-header.jpg'
  const image = gym.featuredImage ?? '/images/bg-header.jpg'

  const cardContent = (
    <div className='relative group overflow-hidden rounded-lg'>
      <img
        src={image}
        alt={gym.title}
        className='w-full h-96 object-cover rounded-lg group-hover:scale-105 transition-all'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
      <div className='absolute bottom-0 left-0 p-6 w-full text-white'>
        <div className='flex items-center gap-1'>
            <MapPin className='h-3.5 w-3.5 flex-shrink-0' />
          </div>
        <h3 className='font-bold text-2xl leading-tight pt-2'>{gym.title}</h3>
      </div>
    </div>
  )

  if (selectMode) {
    return (
      <div
        role='button'
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect?.()
          }
        }}
      >
        {cardContent}
      </div>
    )
  }

  const rawSlug = gym.slug ?? gym.filter?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  // API returns slugs like "best-montgomery-alabama-gyms"; fallback values are plain city slugs
  const urlSlug = rawSlug?.startsWith('best-') ? rawSlug : `best-${rawSlug}-gyms`
  const bestGymsBaseUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || ''
  const isAbsoluteUrl = bestGymsBaseUrl.startsWith('http')
  const href = isAbsoluteUrl ? `${bestGymsBaseUrl}/${urlSlug}` : `/${urlSlug}`

  return (
    <Link href={href} className='block'>
      {cardContent}
    </Link>
  )
}
