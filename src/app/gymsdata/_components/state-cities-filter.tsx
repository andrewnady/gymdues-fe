'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, ChevronRight, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import type { LocationWithCount } from '@/types/gym'
import { cityGymsdataPath } from '@/lib/gymsdata-utils'

const INITIAL_VISIBLE = 12

type SortBy = 'count' | 'name'

interface StateCitiesFilterProps {
  cities: LocationWithCount[]
  stateSlug: string
  /** On gymsdata subdomain pass '' for clean URLs. */
  base?: string
}

export function StateCitiesFilter({ cities, stateSlug, base }: StateCitiesFilterProps) {
  const [sortBy, setSortBy] = useState<SortBy>('count')
  const [expanded, setExpanded] = useState(false)

  const sortedCities = useMemo(() => {
    const list = [...cities]
    if (sortBy === 'name') {
      list.sort((a, b) => {
        const nameA = (a.city ?? a.label ?? '').toLowerCase()
        const nameB = (b.city ?? b.label ?? '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
    }
    return list
  }, [cities, sortBy])

  const visibleCities = expanded ? sortedCities : sortedCities.slice(0, INITIAL_VISIBLE)
  const hasMore = sortedCities.length > INITIAL_VISIBLE
  const hiddenCount = sortedCities.length - INITIAL_VISIBLE

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-2'>
        <Filter className='h-4 w-4 text-muted-foreground shrink-0' aria-hidden />
        <span className='text-sm font-medium text-muted-foreground'>Sort cities by:</span>
        <div className='flex rounded-lg border border-border/80 bg-muted/30 p-0.5' role='tablist' aria-label='Sort order'>
          <button
            type='button'
            role='tab'
            aria-selected={sortBy === 'count'}
            onClick={() => setSortBy('count')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === 'count' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Most gyms
          </button>
          <button
            type='button'
            role='tab'
            aria-selected={sortBy === 'name'}
            onClick={() => setSortBy('name')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              sortBy === 'name' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            City A–Z
          </button>
        </div>
      </div>
      <ul className='grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {visibleCities.map((loc) => (
          <li key={loc.label ?? `${loc.city}-${loc.state}`} className='min-w-0'>
            <Link
              href={cityGymsdataPath(stateSlug, loc.city ?? '', base)}
              className='flex w-full items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-3 shadow-sm hover:bg-muted/50 hover:border-primary/40 transition-colors'
            >
              <div className='flex items-center gap-3'>
                <MapPin className='h-5 w-5 text-primary shrink-0' aria-hidden />
                <div>
                  <span className='font-semibold text-foreground'>{loc.city ?? loc.label}</span>
                  <span className='block text-sm text-muted-foreground tabular-nums'>
                    {loc.count.toLocaleString('en-US')} gyms
                  </span>
                </div>
              </div>
              <ChevronRight className='h-5 w-5 text-muted-foreground shrink-0' aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className='flex justify-center pt-2'>
          <button
            type='button'
            onClick={() => setExpanded((e) => !e)}
            className='inline-flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-primary/40 transition-colors'
            aria-expanded={expanded}
          >
            {expanded ? (
              <>
                <ChevronUp className='h-4 w-4' aria-hidden />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className='h-4 w-4' aria-hidden />
                Read more ({hiddenCount} more cities)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
