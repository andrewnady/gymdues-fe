'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Table2, Info, ChevronDown, ChevronUp } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { UsaGymsStateMap } from './usa-gyms-state-map'
import type { MapLayer } from '@/usa-list/lib/map-layers'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'
import { getStatesForLayer, getLayerLabel } from '@/usa-list/lib/map-layers'

const INITIAL_VISIBLE = 10

type View = 'map' | 'table'

interface UsaMapOrTableSectionProps {
  sortedStates: StateWithCount[]
  totalGyms: number
}

export function UsaMapOrTableSection({ sortedStates }: UsaMapOrTableSectionProps) {
  const [view, setView] = useState<View>('map')
  const layer: MapLayer = 'all'
  const [showAllStates, setShowAllStates] = useState(false)

  const statesForLayer = useMemo(
    () => getStatesForLayer(sortedStates, layer),
    [sortedStates, layer],
  )
  const visibleStates = showAllStates ? statesForLayer : statesForLayer.slice(0, INITIAL_VISIBLE)
  const hasMore = statesForLayer.length > INITIAL_VISIBLE
  const hiddenCount = statesForLayer.length - INITIAL_VISIBLE
  const totalForLayer = useMemo(
    () => statesForLayer.reduce((sum, s) => sum + s.layerCount, 0),
    [statesForLayer],
  )
  const layerLabel = getLayerLabel(layer)

  return (
    <div className='space-y-6'>
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
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className='h-4 w-4 shrink-0' aria-hidden />
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
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Table2 className='h-4 w-4 shrink-0' aria-hidden />
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
                Showing {layerLabel} by state (sorted by total)
              </p>
            </div>
            <table className='min-w-full text-left text-sm' aria-describedby='map-table-details'>
              <thead className='bg-muted/40 border-b border-border/60'>
                <tr>
                  <th
                    scope='col'
                    className='px-3 py-3 w-12 text-center text-xs font-medium text-muted-foreground'
                  >
                    #
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 text-xs font-medium text-muted-foreground min-w-[140px]'
                  >
                    State
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 hidden sm:table-cell w-16 text-xs font-medium text-muted-foreground text-center'
                  >
                    Code
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 text-right w-32 text-xs font-medium text-muted-foreground tabular-nums'
                  >
                    Count
                  </th>
                  <th
                    scope='col'
                    className='px-3 py-3 hidden md:table-cell w-40 text-xs font-medium text-muted-foreground text-right tabular-nums'
                  >
                    % of total
                  </th>
                  {/* <th scope='col' className='px-3 py-3 text-center w-40 min-w-[10rem] text-xs font-medium text-muted-foreground'>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {visibleStates.map((state, idx) => {
                  const pctNum = totalForLayer > 0 ? (state.layerCount / totalForLayer) * 100 : 0
                  const pct = pctNum.toFixed(1)
                  return (
                    <tr key={state.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40 transition-colors'>
                      <td className='px-3 py-3 text-center text-muted-foreground font-medium tabular-nums'>{idx + 1}</td>
                      <td className='px-3 py-3 font-medium'>
                        <span className='inline-flex items-center gap-1.5'>
                          <Link href={stateGymsdataPath(state)} className='text-primary hover:underline'>
                            {state.stateName}
                          </Link>
                          <span
                            className='inline-flex shrink-0 text-muted-foreground hover:text-foreground'
                            title={`${state.stateName} (${state.state}): ${state.layerCount.toLocaleString('en-US')} ${layerLabel} (${pct}% of US total)`}
                            aria-label={`${state.stateName} has ${state.layerCount.toLocaleString('en-US')} ${layerLabel}, about ${pct}% of the US total`}
                          >
                            <Info className='h-3.5 w-3.5' aria-hidden />
                          </span>
                        </span>
                      </td>
                      <td className='px-3 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs text-center'>
                        {state.state}
                      </td>
                      <td className='px-3 py-3 text-right font-semibold tabular-nums'>
                        {state.layerCount.toLocaleString('en-US')}
                      </td>
                      <td className='px-3 py-3 hidden md:table-cell align-middle'>
                        <div className='flex items-center gap-2 min-w-[100px]'>
                          <div className='flex-1 min-w-0 h-2 rounded-full bg-muted overflow-hidden'>
                            <div
                              className='h-full rounded-full bg-primary/80 transition-all duration-300'
                              style={{ width: `${Math.min(pctNum, 100)}%` }}
                              role='presentation'
                            />
                          </div>
                          <span className='text-muted-foreground tabular-nums text-xs shrink-0 w-9 text-right'>{pct}%</span>
                        </div>
                      </td>
                      {/* <td className='px-3 py-3 text-center align-middle'>
                        <Link
                          href={stateGymsdataPath(state)}
                          title={`View Fitness, Gym, and Health Services in ${state.stateName}`}
                          className='inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors whitespace-nowrap min-w-[8rem] sm:min-w-[10rem]'
                        >
                          <span className='sm:hidden'>View</span>
                          <span className='hidden sm:inline'>View Fitness, Gym, and Health Services</span>
                        </Link>
                      </td> */}
                    </tr>
                  )
                })}
                <tr className='bg-muted/50 border-t-2 border-border font-semibold'>
                  <td className='px-3 py-3 text-center text-muted-foreground'>—</td>
                  <td className='px-3 py-3'>Total</td>
                  <td className='px-3 py-3 text-muted-foreground hidden sm:table-cell text-center'>—</td>
                  <td className='px-3 py-3 text-right tabular-nums font-semibold'>
                    {totalForLayer.toLocaleString('en-US')}
                  </td>
                  <td className='px-3 py-3 hidden md:table-cell'>
                    <div className='flex items-center gap-2 min-w-[100px]'>
                      <div className='flex-1 min-w-0 h-2 rounded-full bg-muted overflow-hidden'>
                        <div className='h-full w-full rounded-full bg-primary/80' role='presentation' />
                      </div>
                      <span className='text-muted-foreground tabular-nums text-xs shrink-0 w-9 text-right'>100%</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {hasMore && (
              <div className='flex flex-wrap items-center justify-center border-t border-border/60 bg-muted/20 py-3'>
                <button
                  type='button'
                  onClick={() => setShowAllStates((s) => !s)}
                  className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 transition-all'
                >
                  {showAllStates ? (
                    <>
                      Show less
                      <ChevronUp className='h-4 w-4' />
                    </>
                  ) : (
                    <>
                      See more ({hiddenCount} more states)
                      <ChevronDown className='h-4 w-4' />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
