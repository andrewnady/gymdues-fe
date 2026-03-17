'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Building2 } from 'lucide-react'
import type { GymSearchResult } from '@/types/gym'
import { GymAutocompleteSearch } from '@/components/gym-autocomplete-search'
import { Card } from '@/components/ui/card'
import type { GymAutocompleteSearchSize } from '@/components/gym-autocomplete-search'

const OPEN_CLAIM_ON_MOUNT_KEY = 'gymdues.openClaimOnMount'

interface GymOwnerClaimCtaProps {
  searchSize?: GymAutocompleteSearchSize
}

/**
 * Hero CTA: search (data from backend) → select a gym from list → card shows
 * gym details with "Claim This Business" button (internal link to gym page; opens claim modal there).
 */
export function GymOwnerClaimCta({ searchSize = 'md' }: GymOwnerClaimCtaProps) {
  const [selectedGym, setSelectedGym] = useState<GymSearchResult | null>(null)

  const handleClaimClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(OPEN_CLAIM_ON_MOUNT_KEY, '1')
    }
  }

  return (
    <div className='space-y-4 max-w-xl'>
      <div className='flex flex-col sm:flex-row gap-3 sm:items-center'>
        <div className='flex-1 min-w-0 w-full'>
          <span className='sr-only'>Find your gym by name to claim it</span>
          <GymAutocompleteSearch
            size={searchSize}
            onSelectGym={(gym) => setSelectedGym(gym)}
          />
        </div>
      </div>

      {selectedGym && (
        <Card className='rounded-2xl border border-border/80 bg-white p-5 shadow-sm'>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3'>
            Selected gym
          </p>
          <div className='flex items-start gap-3'>
            <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-2 ring-primary/20'>
              <Building2 className='h-5 w-5 text-primary' aria-hidden />
            </div>
            <div className='min-w-0 flex-1'>
              <p className='font-semibold text-foreground text-base'>{selectedGym.name}</p>
              {(selectedGym.city || selectedGym.state) && (
                <p className='text-sm text-muted-foreground mt-1 flex items-center gap-1.5'>
                  <MapPin className='h-3.5 w-3.5 shrink-0' aria-hidden />
                  {[selectedGym.city, selectedGym.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          </div>
          <div className='mt-4 pt-4 border-t border-border/60'>
            <Link
              href={`/gyms/${selectedGym.slug}`}
              onClick={handleClaimClick}
              className='w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'
              aria-label={`Claim ${selectedGym.name}`}
            >
              <Building2 className='h-4 w-4' aria-hidden />
              Claim This Business
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
