'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { LocationWithCount } from '@/types/gym'
import type { StateWithCount } from '@/types/gym'
import { cityPagePathForLocation } from '@/lib/gymsdata-utils'

const INITIAL_VISIBLE = 3

interface TopCitiesTableProps {
  cities: LocationWithCount[]
  /** Pass states so city links go to /gymsdata/[state]/[city] page. */
  states?: StateWithCount[]
}

export function TopCitiesTable({ cities, states }: TopCitiesTableProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? cities : cities.slice(0, INITIAL_VISIBLE)
  const hasMore = cities.length > INITIAL_VISIBLE
  const hiddenCount = cities.length - INITIAL_VISIBLE

  return (
    <>
      {/* <details className='mb-3 [&::-webkit-details-marker]:hidden' aria-label='Table details'>
        <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
          <Info className='h-4 w-4 shrink-0' aria-hidden />
          <span>Details</span>
        </summary>
        <p id='top-cities-table-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
          This table shows cities and metro areas with the most gyms in the United States. Columns: rank (#), city or location name (links to filtered gym list), and gym count. Use it to find the best cities for gym options and compare membership prices. Data is updated weekly.
        </p>
      </details> */}
      <p id='top-cities-table-details' className='sr-only'>
        Top cities by number of Fitness, Gym, and Health Services. Columns: rank, city or location, and count. Click a city to browse.
      </p>
      <div className='overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm' aria-describedby='top-cities-table-details'>
            <thead className='bg-muted/40 border-b border-border/60'>
              <tr>
                <th scope='col' className='w-12 px-3 py-3 text-center text-xs font-medium text-muted-foreground'>#</th>
                <th scope='col' className='px-3 py-3 min-w-[180px] text-xs font-medium text-muted-foreground'>City / Location</th>
                <th scope='col' className='px-3 py-3 text-right w-28 text-xs font-medium text-muted-foreground'>Count</th>
              </tr>
            </thead>
            <tbody id='top-cities-table-body'>
              {visible.map((loc, i) => (
                <tr key={i} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40 transition-colors'>
                  <td className='px-3 py-3 text-center text-muted-foreground font-medium tabular-nums'>{i + 1}</td>
                  <td className='px-3 py-3 font-medium'>
                    <Link
                      href={states ? (cityPagePathForLocation(loc, states) ?? `/gymsdata/#location=${encodeURIComponent(loc.label)}`) : `/gymsdata/#location=${encodeURIComponent(loc.label)}`}
                      className='text-primary hover:underline underline-offset-2'
                    >
                      {loc.label}
                    </Link>
                  </td>
                  <td className='px-3 py-3 text-right font-semibold tabular-nums text-foreground'>{loc.count.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className='border-t border-border/60 bg-muted/20 px-4 py-3 flex justify-center'>
            <button
              type='button'
              onClick={() => setExpanded((e) => !e)}
              aria-expanded={expanded}
              aria-controls='top-cities-table-body'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
            >
              {expanded ? (
                <>
                  Show less
                  <ChevronUp className='h-4 w-4 shrink-0' aria-hidden />
                </>
              ) : (
                <>
                  View {hiddenCount} more cities
                  <ChevronDown className='h-4 w-4 shrink-0' aria-hidden />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
