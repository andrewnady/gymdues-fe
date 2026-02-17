'use client'

import Link from 'next/link'
import { Gym } from '@/types/gym'
import { MapPin } from 'lucide-react'

interface BestGymCityCardProps {
  gym?: Gym
  /** When true, card click selects (calls onSelect); Details button is the only link to gym page. Default false = whole card links to gym. */
  selectMode?: boolean
  /** Called when card is clicked in selectMode (not when Details is clicked). */
  onSelect?: () => void
}

export function BestGymCityCard({ selectMode, onSelect }: BestGymCityCardProps) {
  const testSlug = 'california'
  const cardContent = (
    <div className='relative group overflow-hidden rounded-lg'>
      <img
        src='/images/bg-header.jpg'
        alt=''
        className='w-full h-96 object-cover rounded-lg group-hover:scale-105 transition-all'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
      <div className='absolute bottom-0 left-0 p-6 w-full text-white'>
        <MapPin className='h-3.5 w-3.5 flex-shrink-0' />
        <h3 className='font-bold text-2xl leading-tight pt-2'>10 Best New York Gyms</h3>
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

  return (
    <Link href={`/best-${testSlug}-gyms`} className='block'>
      {cardContent}
    </Link>
  )
}
