'use client'

import { useState } from 'react'
import { AppLink } from '@/components/app-link'
import { ChevronDown, ChevronUp, Table2 } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'

const INITIAL_VISIBLE = 12

interface DistributionByLocationChipsProps {
  states: StateWithCount[]
}

export function DistributionByLocationChips({ states }: DistributionByLocationChipsProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? states : states.slice(0, INITIAL_VISIBLE)
  const hasMore = states.length > INITIAL_VISIBLE
  const hiddenCount = states.length - INITIAL_VISIBLE

  return (
    <>
      <div className='flex flex-wrap gap-2'>
        {visible.map((s, i) => (
          <AppLink
            key={s.state}
            href={stateGymsdataPath(s)}
            className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors'
            style={{
              animation: 'gyms-table-row-in 0.35s ease-out forwards',
              animationDelay: `${Math.min(i * 25, 300)}ms`,
            }}
          >
            <span>{s.stateName}</span>
            <span className='tabular-nums text-muted-foreground'>
              {s.count.toLocaleString('en-US')}
            </span>
          </AppLink>
        ))}
      </div>
      {hasMore && (
        <div className='mt-4 flex justify-center'>
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
                Show more ({hiddenCount} more)
                <ChevronDown className='h-4 w-4' />
              </>
            )}
          </button>
        </div>
      )}
      <div className='mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-4'>
        <AppLink
          href='#states-table'
          className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2'
        >
          <Table2 className='h-4 w-4 shrink-0' />
          View full table with rank and actions
        </AppLink>
        <AppLink
          href='#states-table'
          className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:underline underline-offset-2'
        >
          Show all data →
        </AppLink>
      </div>
    </>
  )
}
