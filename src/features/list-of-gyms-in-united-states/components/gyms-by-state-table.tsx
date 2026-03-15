'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Table2, ExternalLink, ChevronRight, ChevronDown, ChevronUp, Info } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'

const INITIAL_VISIBLE = 10

interface GymsByStateTableProps {
  sortedStates: StateWithCount[]
  totalGyms: number
}

export function GymsByStateTable({ sortedStates, totalGyms }: GymsByStateTableProps) {
  const [mounted, setMounted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? sortedStates : sortedStates.slice(0, INITIAL_VISIBLE)
  const hasMore = sortedStates.length > INITIAL_VISIBLE
  const hiddenCount = sortedStates.length - INITIAL_VISIBLE

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      className={`max-w-5xl mx-auto mb-16 transition-all duration-500 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-labelledby='states-table-heading'
    >
      <div className='mb-6 p-5 md:p-6 rounded-2xl border border-border/60 bg-card/50'>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
          <div>
            <div className='flex flex-wrap items-center gap-3 mb-2'>
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                <Table2 className='h-5 w-5 text-primary' />
              </div>
              <h2 id='states-table-heading' className='text-2xl md:text-3xl font-bold tracking-tight'>
                Number of Fitness, Gym, and Health Services by U.S. state
              </h2>
              {/* <details className='ml-auto [&::-webkit-details-marker]:hidden' aria-label='Table details'>
                <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                  <Info className='h-4 w-4 shrink-0' aria-hidden />
                  <span>Details</span>
                </summary>
                <p id='states-table-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
                  This table lists every U.S. state with verified gym counts. Columns: rank (#), state name (links to state gyms directory), state code, number of gyms, share of total, and an action to view gyms on the list page. Use it to compare gym density by state and find states with the most gyms. Data is updated weekly.
                </p>
              </details> */}
            </div>
            <p className='text-sm md:text-base text-muted-foreground max-w-2xl'>
            Fitness, Gym, and Health Services count per state. Use the action to open the Fitness, Gym, and Health Services page filtered by state and
              compare membership prices, plans, and fees.
            </p>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-muted/50 border-b border-border/60'>
            <tr>
              <th className='px-4 py-3.5 font-medium text-muted-foreground w-14 text-center'>
                #
              </th>
              <th className='px-4 py-3.5 font-medium text-muted-foreground'>State</th>
              <th className='px-4 py-3.5 font-medium text-muted-foreground hidden sm:table-cell w-20'>
                Code
              </th>
              <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>
              Count
              </th>
              <th className='px-4 py-3.5 font-medium text-muted-foreground hidden md:table-cell w-40'>
                % of total
              </th>
              <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((state) => {
              const pctNum = totalGyms > 0 ? (state.count / totalGyms) * 100 : 0
              const pct = pctNum.toFixed(1)
              const globalIndex = sortedStates.findIndex((s) => s.state === state.state)
              return (
                <tr
                  key={state.state}
                  className='border-b border-border/50 last:border-b-0 hover:bg-muted/40 transition-colors duration-200'
                  style={
                    mounted
                      ? {
                          animation: 'gyms-table-row-in 0.35s ease-out forwards',
                          animationDelay: `${Math.min(globalIndex * 25, 400)}ms`,
                        }
                      : undefined
                  }
                >
                  <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>
                    {globalIndex + 1}
                  </td>
                  <td className='px-4 py-3 font-medium'>
                    <span className='inline-flex items-center gap-1.5'>
                      <Link
                        href={stateGymsdataPath(state)}
                        className='text-foreground hover:underline underline-offset-2 text-primary hover:text-primary/90'
                      >
                        {state.stateName}
                      </Link>
                      <span
                        className='inline-flex shrink-0 text-muted-foreground hover:text-foreground'
                        title={`${state.stateName} (${state.state}): ${state.count.toLocaleString('en-US')} Fitness, Gym, and Health Services — view state directory`}
                        aria-label={`Details for ${state.stateName}`}
                      >
                        <Info className='h-3.5 w-3.5' />
                      </span>
                    </span>
                  </td>
                  <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs'>
                    {state.state}
                  </td>
                  <td className='px-4 py-3 text-right font-semibold tabular-nums'>
                    {state.count.toLocaleString('en-US')}
                  </td>
                  <td className='px-4 py-3 hidden md:table-cell align-middle'>
                    <div className='flex items-center gap-2 min-w-[100px]'>
                      <div className='flex-1 min-w-0 h-2.5 rounded-full bg-muted overflow-hidden'>
                        <div
                          className='h-full rounded-full bg-primary/80 transition-all duration-500'
                          style={{ width: `${Math.min(pctNum, 100)}%` }}
                          role='presentation'
                        />
                      </div>
                      <span className='text-muted-foreground tabular-nums text-xs shrink-0 w-9 text-right'>{pct}%</span>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-right'>
                    <Link
                      href={stateGymsdataPath(state)}
                      className='inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors'
                    >
                      <ExternalLink className='h-3.5 w-3.5 shrink-0' aria-hidden />
                      <span className='hidden sm:inline'>View Fitness, Gym, and Health Services</span>
                      <ChevronRight className='h-3.5 w-3.5 sm:hidden' aria-hidden />
                    </Link>
                  </td>
                </tr>
              )
            })}
            <tr className='bg-muted/50 border-t-2 border-border font-semibold'>
              <td className='px-4 py-3 text-center text-muted-foreground'>—</td>
              <td className='px-4 py-3'>Total</td>
              <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell'>—</td>
              <td className='px-4 py-3 text-right tabular-nums'>
                {totalGyms.toLocaleString('en-US')}
              </td>
              <td className='px-4 py-3 hidden md:table-cell'>
                <div className='flex items-center gap-2 min-w-[100px]'>
                  <div className='flex-1 min-w-0 h-2.5 rounded-full bg-muted overflow-hidden'>
                    <div className='h-full w-full rounded-full bg-primary/80' role='presentation' />
                  </div>
                  <span className='text-muted-foreground tabular-nums text-xs shrink-0 w-9 text-right'>100%</span>
                </div>
              </td>
              <td className='px-4 py-3' />
            </tr>
          </tbody>
        </table>

        <div className='flex flex-wrap items-center justify-center gap-4 border-t border-border/60 bg-muted/20 py-4'>
          {hasMore && (
            <button
              type='button'
              onClick={() => setExpanded((e) => !e)}
              className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 transition-all'
            >
              {expanded ? (
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
          )}
          {/* <Link
            href='#states-table'
            className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2'
          >
            Show all data →
          </Link> */}
        </div>
      </div>
    </section>
  )
}
