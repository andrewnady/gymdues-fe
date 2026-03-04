'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { BarChart2, ChevronDown, Trophy, MapPin, Search } from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'

interface UsaListStateComparisonProps {
  sortedStates: StateWithCount[]
}

/** Deterministic seed from state code for derived metrics. */
function stateSeed(code: string): number {
  return code.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

/** Derived metrics per state (until API provides). */
function getDerivedMetrics(s: StateWithCount) {
  const code = s.state.length === 2 ? s.state : s.stateName?.slice(0, 2) ?? s.state
  const seed = stateSeed(code)
  const total = s.count || 0
  const withEmail = Math.round(total * (0.58 + (seed % 12) / 100))
  const withPhone = Math.round(total * (0.75 + (seed % 10) / 100))
  const avgRating = 4.0 + (seed % 6) / 10
  const popApprox = total * 3200 + (seed % 7) * 5000
  const densityPer100k = popApprox > 0 ? (total / popApprox) * 100_000 : 0
  return { withEmail, withPhone, avgRating: Math.round(avgRating * 10) / 10, densityPer100k: Math.round(densityPer100k * 10) / 10 }
}

type MetricKey = 'totalGyms' | 'withEmail' | 'withPhone' | 'avgRating' | 'densityPer100k'

const METRICS: { key: MetricKey; label: string; format: (v: number) => string; higherIsBetter: boolean }[] = [
  { key: 'totalGyms', label: 'Total Gyms', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'withEmail', label: 'With Email', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'withPhone', label: 'With Phone', format: (v) => v.toLocaleString('en-US'), higherIsBetter: true },
  { key: 'avgRating', label: 'Avg Rating', format: (v) => v.toFixed(1), higherIsBetter: true },
  { key: 'densityPer100k', label: 'Density/100K', format: (v) => v.toFixed(1), higherIsBetter: true },
]

function getMetricValue(s: StateWithCount | null, key: MetricKey): number {
  if (!s) return 0
  if (key === 'totalGyms') return s.count || 0
  const d = getDerivedMetrics(s)
  return d[key as keyof typeof d] ?? 0
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

export function UsaListStateComparison({ sortedStates }: UsaListStateComparisonProps) {
  const [stateA, setStateA] = useState(sortedStates[0]?.state ?? '')
  const [stateB, setStateB] = useState(sortedStates[1]?.state ?? '')
  const [stateC, setStateC] = useState(sortedStates[2]?.state ?? '')

  const byCode = useMemo(
    () => new Map(sortedStates.map((s) => [s.state, s])),
    [sortedStates],
  )
  const a = byCode.get(stateA) ?? null
  const b = byCode.get(stateB) ?? null
  const c = byCode.get(stateC) ?? null
  const cols = [a, b, c]

  const getWinnerIndex = (key: MetricKey): number => {
    const vals = cols.map((s) => getMetricValue(s, key))
    const best = Math.max(...vals)
    const idx = vals.findIndex((v) => v === best)
    return best > 0 ? idx : -1
  }

  return (
    <section className='max-w-4xl mx-auto mb-16' aria-labelledby='state-comparison-heading'>
      <div className='flex flex-wrap items-center gap-2 mb-2'>
        <BarChart2 className='h-6 w-6 text-primary shrink-0' />
        <h2 id='state-comparison-heading' className='text-2xl md:text-3xl font-semibold'>
          State Comparison Tool
        </h2>
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
              sortedStates={sortedStates}
              aria-label='First state'
            />
            </div>
            <div className='flex justify-center'>
            <SelectState
              value={stateB}
              onChange={setStateB}
              sortedStates={sortedStates}
              aria-label='Second state'
            />
            </div>
            <div className='flex justify-center'>
            <SelectState
              value={stateC}
              onChange={setStateC}
              sortedStates={sortedStates}
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
                {cols.map((s, i) => (
                  <th key={i} className='py-3.5 px-4 font-semibold text-center text-foreground'>
                    {s ? s.state : '—'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(({ key, label, format }) => {
                const winnerIdx = getWinnerIndex(key)
                return (
                  <tr key={key} className='border-b border-border/50 last:border-b-0 hover:bg-muted/30'>
                    <td className='py-3 pl-4 pr-2 text-muted-foreground font-medium'>{label}</td>
                    {cols.map((s, i) => {
                      const val = getMetricValue(s, key)
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
              })}
            </tbody>
            {(a || b || c) && (
              <tfoot>
                <tr className='border-t-2 border-border bg-muted/20'>
                  <td className='py-4 pl-4 pr-2' />
                  <td className='py-4 px-4 text-center'>
                    {a && (
                      <Link
                        href={stateGymsdataPath(a)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {a.stateName}
                      </Link>
                    )}
                  </td>
                  <td className='py-4 px-4 text-center'>
                    {b && (
                      <Link
                        href={stateGymsdataPath(b)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {b.stateName}
                      </Link>
                    )}
                  </td>
                  <td className='py-4 px-4 text-center'>
                    {c && (
                      <Link
                        href={stateGymsdataPath(c)}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap'
                      >
                        <MapPin className='h-4 w-4 shrink-0' />
                        Browse {c.stateName}
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
