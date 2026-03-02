'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Table2, Info } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { UsaGymsStateMap, LAYERS } from './usa-gyms-state-map'
import type { MapLayer } from '@/usa-list/lib/map-layers'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'
import { getStatesForLayer, getLayerLabel } from '@/usa-list/lib/map-layers'

type View = 'map' | 'table'

interface UsaMapOrTableSectionProps {
  sortedStates: StateWithCount[]
  totalGyms: number
}

export function UsaMapOrTableSection({ sortedStates, totalGyms }: UsaMapOrTableSectionProps) {
  const [view, setView] = useState<View>('map')
  const [layer, setLayer] = useState<MapLayer>('all')

  const statesForLayer = useMemo(
    () => getStatesForLayer(sortedStates, layer),
    [sortedStates, layer],
  )
  const totalForLayer = useMemo(
    () => statesForLayer.reduce((sum, s) => sum + s.layerCount, 0),
    [statesForLayer],
  )
  const layerLabel = getLayerLabel(layer)

  return (
    <div className='space-y-6'>
      {/* Toggle layers: All Gyms | Budget | 24-Hour | High-Rated (shared by map and table) */}
      <div
        className='flex flex-wrap items-center justify-center gap-2'
        role='tablist'
        aria-label='Map and table layers'
      >
        {LAYERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type='button'
            role='tab'
            aria-selected={layer === id}
            onClick={() => setLayer(id)}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              layer === id
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Icon className='h-4 w-4 shrink-0' />
            {label}
          </button>
        ))}
      </div>

      <div
        className='flex rounded-xl border border-border/80 bg-muted/30 p-1'
        role='tablist'
        aria-label='Switch between map and table view'
      >
        <button
          type='button'
          role='tab'
          aria-selected={view === 'map'}
          aria-controls='us-map-view-panel'
          id='us-map-tab'
          onClick={() => setView('map')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            view === 'map'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className='h-4 w-4 shrink-0' />
          Map
        </button>
        <button
          type='button'
          role='tab'
          aria-selected={view === 'table'}
          aria-controls='us-table-view-panel'
          id='us-table-tab'
          onClick={() => setView('table')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            view === 'table'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Table2 className='h-4 w-4 shrink-0' />
          Table
        </button>
      </div>

      <div id='us-map-view-panel' role='tabpanel' aria-labelledby='us-map-tab' hidden={view !== 'map'}>
        {view === 'map' && <UsaGymsStateMap states={sortedStates} layer={layer} />}
      </div>

      <div id='us-table-view-panel' role='tabpanel' aria-labelledby='us-table-tab' hidden={view !== 'table'}>
        {view === 'table' && (
          <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
            <div className='flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-border/60'>
              <p className='text-xs text-muted-foreground'>
                Showing {layerLabel} by state
              </p>
              <details className='[&::-webkit-details-marker]:hidden' aria-label='Table details'>
                <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                  <Info className='h-3.5 w-3.5 shrink-0' aria-hidden />
                  <span>Details</span>
                </summary>
                <p id='map-table-details' className='mt-2 text-xs text-muted-foreground max-w-xl' role='region' aria-label='Table description'>
                  This table shows gym counts by state for the selected layer (All Gyms, Budget, 24-Hour, or High-Rated). Columns: rank, state name, state code, count, percentage of total, and view gyms action. Use it to compare states within each category.
                </p>
              </details>
            </div>
            <table className='min-w-full text-left text-sm' aria-describedby='map-table-details'>
              <thead className='bg-muted/50 border-b border-border/60'>
                <tr>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground w-14 text-center'>#</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground'>State</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground hidden sm:table-cell w-20'>Code</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>{layer === 'all' ? 'Gyms' : LAYERS.find((l) => l.id === layer)?.label ?? 'Count'}</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right hidden md:table-cell w-24'>% of total</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>Action</th>
                </tr>
              </thead>
              <tbody>
                {statesForLayer.map((state, idx) => {
                  const pct = totalForLayer > 0 ? ((state.layerCount / totalForLayer) * 100).toFixed(1) : '0'
                  return (
                    <tr key={state.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40'>
                      <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>{idx + 1}</td>
                      <td className='px-4 py-3 font-medium'>
                        <span className='inline-flex items-center gap-1.5'>
                          <Link href={stateGymsdataPath(state)} className='text-primary hover:underline'>
                            {state.stateName}
                          </Link>
                          <span
                            className='inline-flex shrink-0 text-muted-foreground hover:text-foreground'
                            title={`${state.stateName} (${state.state}): ${state.layerCount.toLocaleString('en-US')} ${layerLabel} — view gyms`}
                            aria-label={`Details for ${state.stateName}`}
                          >
                            <Info className='h-3.5 w-3.5' />
                          </span>
                        </span>
                      </td>
                      <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs'>{state.state}</td>
                      <td className='px-4 py-3 text-right font-semibold tabular-nums'>{state.layerCount.toLocaleString('en-US')}</td>
                      <td className='px-4 py-3 text-right text-muted-foreground hidden md:table-cell tabular-nums'>{pct}%</td>
                      <td className='px-4 py-3 text-right'>
                        <Link
                          href={`/gymsdata#state=${encodeURIComponent(state.state)}`}
                          className='inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground'
                        >
                          View gyms
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                <tr className='bg-muted/50 border-t-2 border-border font-semibold'>
                  <td className='px-4 py-3 text-center text-muted-foreground'>—</td>
                  <td className='px-4 py-3'>Total</td>
                  <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell'>—</td>
                  <td className='px-4 py-3 text-right tabular-nums'>{totalForLayer.toLocaleString('en-US')}</td>
                  <td className='px-4 py-3 text-right hidden md:table-cell tabular-nums'>100%</td>
                  <td className='px-4 py-3' />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
