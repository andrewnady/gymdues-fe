'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BarChart2, ChevronDown, Trophy, MapPin, Search, Loader2, RefreshCw } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'

/** From api/v1/gymsdata/state-comparison */
export interface StateComparisonItem {
  state: string
  stateName: string
  stateSlug?: string
  totalGyms: number
  withEmail: number
  withPhone: number
  avgRating: number
  densityPer100k: number
}

interface UsaListStateComparisonProps {
  sortedStates: StateWithCount[]
}

type MetricKey = 'totalGyms' | 'withEmail' | 'withPhone' | 'avgRating' | 'densityPer100k'

const METRICS: { key: MetricKey; label: string; format: (v: number) => string; higherIsBetter: boolean }[] = [
  { key: 'totalGyms', label: 'Total', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'withEmail', label: 'With Email', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'withPhone', label: 'With Phone', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'avgRating', label: 'Avg Rating', format: (v) => v.toFixed(1), higherIsBetter: true },
  { key: 'densityPer100k', label: 'Density/100K', format: (v) => v.toFixed(1), higherIsBetter: true },
]

function getMetricValueFromItem(item: StateComparisonItem | null, key: MetricKey): number {
  if (!item) return 0
  switch (key) {
    case 'totalGyms': return item.totalGyms ?? 0
    case 'withEmail': return item.withEmail ?? 0
    case 'withPhone': return item.withPhone ?? 0
    case 'avgRating': return item.avgRating ?? 0
    case 'densityPer100k': return item.densityPer100k ?? 0
    default: return 0
  }
}

function matchState(query: string, s: StateWithCount): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const name = (s.stateName ?? '').toLowerCase()
  const code = (s.state ?? '').toLowerCase()
  return name.includes(q) || code.includes(q)
}

function SelectState({
  value,
  onChange,
  sortedStates,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (state: string) => void
  sortedStates: StateWithCount[]
  'aria-label': string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selected = sortedStates.find((s) => s.state === value)
  const filtered = useMemo(
    () => sortedStates.filter((s) => matchState(query, s)),
    [sortedStates, query],
  )

  useEffect(() => {
    if (!open) return
    setQuery('')
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const handler = (e: FocusEvent) => {
      if (containerRef.current?.contains(e.relatedTarget as Node)) return
      setTimeout(() => setOpen(false), 150)
    }
    document.addEventListener('focusout', handler)
    return () => document.removeEventListener('focusout', handler)
  }, [])

  return (
    <div
      ref={containerRef}
      className='relative min-w-0 flex-1 max-w-[200px]'
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup='listbox'
        className='w-full rounded-lg border border-input bg-background pl-3 pr-8 py-2 text-sm font-medium text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer flex items-center gap-2'
      >
        <span className='truncate'>{selected?.stateName ?? 'Select state'}</span>
        <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0' />
      </button>
      {open && (
        <div
          className='absolute z-50 mt-1 w-full min-w-[180px] rounded-lg border border-border bg-popover shadow-lg overflow-hidden'
          role='listbox'
        >
          <div className='p-2 border-b border-border/60'>
            <div className='flex items-center gap-2 rounded-md border border-input bg-background px-2 py-1.5'>
              <Search className='h-3.5 w-3.5 text-muted-foreground shrink-0' aria-hidden />
              <input
                ref={inputRef}
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search states...'
                className='flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground'
                aria-label='Search states'
              />
            </div>
          </div>
          <ul className='max-h-[220px] overflow-y-auto py-1' role='listbox'>
            {filtered.length === 0 ? (
              <li className='px-3 py-2 text-sm text-muted-foreground'>No states match</li>
            ) : (
              filtered.map((s) => (
                <li key={s.state} role='option' aria-selected={s.state === value}>
                  <button
                    type='button'
                    onClick={() => {
                      onChange(s.state)
                      setOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      s.state === value
                        ? 'bg-primary/15 text-primary font-medium'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {s.stateName}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

const DEFAULT_STATES = ['CA', 'TX', 'FL']
const FETCH_TIMEOUT_MS = 14_000

function getInitialState(states: { state: string }[], index: number): string {
  const preferred = DEFAULT_STATES[index]
  if (preferred && states.some((s) => s.state === preferred)) return preferred
  return states[index]?.state ?? ''
}

export function UsaListStateComparison({ sortedStates }: UsaListStateComparisonProps) {
  const [allStates, setAllStates] = useState<StateComparisonItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'timeout' | 'error' | null>(null)
  const [stateA, setStateA] = useState(() => getInitialState(sortedStates, 0))
  const [stateB, setStateB] = useState(() => getInitialState(sortedStates, 1))
  const [stateC, setStateC] = useState(() => getInitialState(sortedStates, 2))

  const fetchComparison = useCallback(() => {
    setError(null)
    setLoading(true)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    fetch('/api/gymsdata/state-comparison', { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeoutId)
        if (!res.ok) {
          if (res.status === 504) throw new Error('Timeout')
          throw new Error('Failed to load')
        }
        return res.json()
      })
      .then((data: { states?: StateComparisonItem[]; error?: string }) => {
        if (data?.error) throw new Error(data.error)
        if (Array.isArray(data?.states) && data.states.length > 0) {
          setAllStates(data.states)
          setError(null)
        } else {
          setAllStates(null)
        }
      })
      .catch((e) => {
        clearTimeout(timeoutId)
        if (e?.name === 'AbortError' || e?.message === 'Timeout') {
          setError('timeout')
        } else {
          setError('error')
        }
        setAllStates(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchComparison()
  }, [fetchComparison])

  const dropdownStates: StateWithCount[] = useMemo(
    () =>
      allStates?.length
        ? allStates.map((s) => ({ state: s.state, stateName: s.stateName, count: s.totalGyms }))
        : sortedStates,
    [allStates, sortedStates],
  )

  const byCode = useMemo(() => {
    if (allStates?.length) {
      return new Map(allStates.map((s) => [s.state, { state: s.state, stateName: s.stateName, count: s.totalGyms }]))
    }
    return new Map(sortedStates.map((s) => [s.state, s]))
  }, [allStates, sortedStates])

  const cols: (StateComparisonItem | null)[] = useMemo(() => {
    if (!allStates?.length) return [null, null, null]
    const byState = new Map(allStates.map((s) => [s.state, s]))
    return [
      byState.get(stateA) ?? null,
      byState.get(stateB) ?? null,
      byState.get(stateC) ?? null,
    ]
  }, [allStates, stateA, stateB, stateC])

  const getWinnerIndex = (key: MetricKey): number => {
    const vals = cols.map((s) => getMetricValueFromItem(s, key))
    const best = Math.max(...vals)
    const idx = vals.findIndex((v) => v === best)
    return best > 0 ? idx : -1
  }

  return (
    <section className='max-w-4xl mx-auto mb-16' aria-labelledby='state-comparison-heading'>
      <div className='flex flex-wrap items-center gap-2 mb-2'>
        <BarChart2 className='h-6 w-6 text-primary shrink-0' />
        <h2 id='state-comparison-heading' className='text-lg font-semibold text-foreground md:text-xl'>
          State Comparison Tool
        </h2>
        {loading && !allStates?.length && !error && (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground' aria-live='polite'>
            <Loader2 className='h-3.5 w-3.5 animate-spin shrink-0' aria-hidden />
            Loading…
          </span>
        )}
        {error && (
          <span className='inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive' role='status'>
            {error === 'timeout' ? 'Took too long' : 'Load failed'}
          </span>
        )}
        {/* <details className='[&::-webkit-details-marker]:hidden' aria-label='Table details'>
          <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
            <Info className='h-4 w-4 shrink-0' aria-hidden />
            <span>Details</span>
          </summary>
          <p id='state-comparison-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
            This comparison table lets you compare up to three states on total gyms, gyms with email, gyms with phone, average rating, and gyms per 100,000 people. The best value in each row is marked. Use it to see which state has the most gym options or best contact coverage.
          </p>
        </details> */}
      </div>
      <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
        Compare gym counts and metrics across three states. Pick states below to see side-by-side
        totals, contact coverage, ratings, and density.
      </p>

      <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
        {/* Select row: grid aligned with table columns (Metric | CA | TX | FL) */}
        <div className='p-4 md:p-6 border-b bg-muted/20'>
          <div
            className='grid items-center gap-x-3 gap-y-2'
            style={{ gridTemplateColumns: '9rem 1fr 1fr 1fr' }}
          >
            <span className='text-sm font-medium text-muted-foreground'>Compare:</span>
            <div className='flex justify-center'>
            <SelectState
              value={stateA}
              onChange={setStateA}
              sortedStates={dropdownStates}
              aria-label='First state'
            />
            </div>
            <div className='flex justify-center'>
            <SelectState
              value={stateB}
              onChange={setStateB}
              sortedStates={dropdownStates}
              aria-label='Second state'
            />
            </div>
            <div className='flex justify-center'>
            <SelectState
              value={stateC}
              onChange={setStateC}
              sortedStates={dropdownStates}
              aria-label='Third state'
            />
            </div>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm table-fixed'>
            <colgroup>
              <col className='w-36' />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr className='border-b border-border/60 bg-muted/40'>
                <th className='text-left py-3.5 pl-4 pr-2 font-medium text-muted-foreground'>
                  Metric
                </th>
                {[stateA, stateB, stateC].map((code, i) => (
                  <th key={i} className='py-3.5 px-4 font-semibold text-center text-foreground'>
                    {code || '—'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!allStates?.length && loading ? (
                <tr>
                  <td colSpan={4} className='py-8 text-center text-muted-foreground'>
                    Loading comparison…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className='py-8 text-center'>
                    <div className='flex flex-col items-center gap-3'>
                      <p className='text-sm text-muted-foreground max-w-sm'>
                        {error === 'timeout'
                          ? 'Comparison data is taking longer than expected. You can try again or browse by state below.'
                          : 'Comparison data could not be loaded. You can try again or browse by state below.'}
                      </p>
                      <button
                        type='button'
                        onClick={() => fetchComparison()}
                        className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                      >
                        <RefreshCw className='h-4 w-4' aria-hidden />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                METRICS.map(({ key, label, format }) => {
                  const winnerIdx = getWinnerIndex(key)
                  return (
                    <tr key={key} className='border-b border-border/50 last:border-b-0 hover:bg-muted/30'>
                      <td className='py-3 pl-4 pr-2 text-muted-foreground font-medium'>{label}</td>
                      {cols.map((s, i) => {
                        const val = getMetricValueFromItem(s, key)
                        const isWinner = winnerIdx === i && val > 0
                        return (
                          <td key={i} className='py-3 px-4 text-center'>
                            <div className='flex flex-col items-center gap-0.5'>
                              <span
                                className={`tabular-nums font-semibold ${isWinner ? 'text-primary' : 'text-foreground'}`}
                              >
                                {s ? format(val) : '—'}
                              </span>
                              {isWinner && (
                                <span
                                  className='inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary'
                                  title='Highest among selected'
                                >
                                  <Trophy className='h-2.5 w-2.5' />
                                  Most
                                </span>
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              )}
            </tbody>
            {(stateA || stateB || stateC) && (
              <tfoot>
                <tr className='border-t-2 border-border bg-muted/20'>
                  <td className='py-4 pl-4 pr-2' />
                  <td className='py-4 px-4 text-center'>
                    {(cols[0] || byCode.get(stateA)) && (
                      <Link
                        href={stateGymsdataPath(cols[0] ? { state: cols[0].state, stateName: cols[0].stateName, count: cols[0].totalGyms } : byCode.get(stateA)!)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {cols[0]?.stateName ?? byCode.get(stateA)?.stateName ?? stateA}
                      </Link>
                    )}
                  </td>
                  <td className='py-4 px-4 text-center'>
                    {(cols[1] || byCode.get(stateB)) && (
                      <Link
                        href={stateGymsdataPath(cols[1] ? { state: cols[1].state, stateName: cols[1].stateName, count: cols[1].totalGyms } : byCode.get(stateB)!)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {cols[1]?.stateName ?? byCode.get(stateB)?.stateName ?? stateB}
                      </Link>
                    )}
                  </td>
                  <td className='py-4 px-4 text-center'>
                    {(cols[2] || byCode.get(stateC)) && (
                      <Link
                        href={stateGymsdataPath(cols[2] ? { state: cols[2].state, stateName: cols[2].stateName, count: cols[2].totalGyms } : byCode.get(stateC)!)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {cols[2]?.stateName ?? byCode.get(stateC)?.stateName ?? stateC}
                      </Link>
                    )}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </section>
  )
}
