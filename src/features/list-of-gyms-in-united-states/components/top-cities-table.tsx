'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, /*Info*/ } from 'lucide-react'
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
      <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
        <table className='min-w-full text-left text-sm' aria-describedby='top-cities-table-details'>
          <thead className='bg-muted/50 border-b'>
            <tr>
              <th className='w-12 px-4 py-3 text-center font-medium text-muted-foreground'>#</th>
              <th className='px-4 py-3 font-medium text-muted-foreground'>City / Location</th>
              <th className='px-4 py-3 font-medium text-muted-foreground text-right w-28'>
                Gyms
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((loc, i) => (
              <tr
                key={i}
                className='border-b border-border/60 last:border-0 hover:bg-muted/40 transition-colors'
                style={{
                  animation: 'gyms-table-row-in 0.4s ease-out forwards',
                  animationDelay: `${i * 40}ms`,
                }}
              >
                <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>
                  {i + 1}
                </td>
                <td className='px-4 py-3 font-medium'>
                  <Link
                    href={states ? (cityPagePathForLocation(loc, states) ?? `/gymsdata/#location=${encodeURIComponent(loc.label)}`) : `/gymsdata/#location=${encodeURIComponent(loc.label)}`}
                    className='text-primary hover:underline underline-offset-2'
                  >
                    {loc.label}
                  </Link>
                </td>
                <td className='px-4 py-3 text-right font-semibold tabular-nums'>
                  {loc.count.toLocaleString('en-US')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex flex-wrap items-center justify-center gap-3'>
        {hasMore && (
          <button
            type='button'
            onClick={() => setExpanded((e) => !e)}
            className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors'
          >
            {expanded ? (
              <>
                Show less
                <ChevronUp className='h-4 w-4' />
              </>
            ) : (
              <>
                Read more ({cities.length - INITIAL_VISIBLE} more)
                <ChevronDown className='h-4 w-4' />
              </>
            )}
          </button>
        )}
        {/* <a
          href='#states-table'
          className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2'
        >
          Show all data →
        </a> */}
      </div>
    </>
  )
}
