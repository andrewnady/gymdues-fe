'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Star } from 'lucide-react'
import { getPlaceholderImage } from '@/lib/utils'
import type { GymSummaryInGroup } from '@/types/gym'

interface GymCardCompactProps {
  gym: GymSummaryInGroup
  /** When true, card click selects (calls onSelect); Details is the only link. Default false = whole card links to gym. */
  selectMode?: boolean
  onSelect?: () => void
}

export function GymCardCompact({ gym, selectMode, onSelect }: GymCardCompactProps) {
  const [logoError, setLogoError] = useState(false)
  const logoSrc = gym.logo?.path && !logoError ? gym.logo.path : getPlaceholderImage('logo')
  const reviewCount = gym.reviewCount ?? 0

  const cardContent = (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={logoSrc}
              alt={gym.logo?.alt ?? gym.name}
              fill
              className="object-cover"
              sizes="48px"
              onError={() => setLogoError(true)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{gym.name}</CardTitle>
            {(gym.city != null || gym.state != null) && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span>
                  {[gym.city, gym.state].filter(Boolean).join(', ') || '—'}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-sm">{gym.rating ?? 0}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 py-0" />
      <CardFooter className="pt-2">
        <Button className="w-full" size="sm" asChild>
          <Link href={`/gyms/${gym.slug}`} onClick={(e) => e.stopPropagation()}>
            {gym.name} Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  if (selectMode) {
    return (
      <div
        role="button"
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

  return <Link href={`/gyms/${gym.slug}`} className="block">{cardContent}</Link>
}
