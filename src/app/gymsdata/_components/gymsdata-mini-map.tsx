'use client'

import { MapPin } from 'lucide-react'
import { UsaGymsStateMap } from '@/usa-list/components/usa-gyms-state-map'
import type { StateWithCount } from '@/types/gym'

interface GymsdataMiniMapProps {
  /** Single state to highlight on the map; map zooms to this state only. */
  state: StateWithCount
}

/** Interactive map zoomed to one state. Used on state and city gymsdata pages. */
export function GymsdataMiniMap({ state }: GymsdataMiniMapProps) {
  return (
    <section className='rounded-2xl border border-border/80 bg-card/80 overflow-visible shadow-sm' aria-label='Map location'>
      <div className='flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30'>
        <MapPin className='h-4 w-4 text-primary shrink-0' aria-hidden />
        <p className='text-sm font-medium text-foreground'>
          {state.stateName}
        </p>
        <span className='text-xs text-muted-foreground ml-1'>(zoomed to state)</span>
      </div>
      <div className='p-4 flex justify-center bg-muted/20'>
        <div className='w-full max-w-2xl'>
          <UsaGymsStateMap states={[state]} layer='all' compact />
        </div>
      </div>
    </section>
  )
}
