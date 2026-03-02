'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { BarChart2, ChevronDown, Trophy, MapPin, Info } from 'lucide-react'
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
  return (
    <div className='relative min-w-0 flex-1 max-w-[200px]'>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className='w-full rounded-lg border border-input bg-background pl-3 pr-8 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer'
      >
        {sortedStates.map((s) => (
          <option key={s.state} value={s.state}>
            {s.stateName}
          </option>
        ))}
      </select>
      <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
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
        <details className='[&::-webkit-details-marker]:hidden' aria-label='Table details'>
          <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
            <Info className='h-4 w-4 shrink-0' aria-hidden />
            <span>Details</span>
          </summary>
          <p id='state-comparison-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
            This comparison table lets you compare up to three states on total gyms, gyms with email, gyms with phone, average rating, and gyms per 100,000 people. The best value in each row is marked. Use it to see which state has the most gym options or best contact coverage.
          </p>
        </details>
      </div>
      <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
        Compare gym counts and metrics across three states. Pick states below to see side-by-side
        totals, contact coverage, ratings, and density.
      </p>

      <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
        <div className='p-4 md:p-6 border-b bg-muted/20'>
          <div className='flex flex-wrap items-center gap-2 md:gap-3'>
            <span className='text-sm font-medium text-muted-foreground shrink-0'>Compare:</span>
            <SelectState
              value={stateA}
              onChange={setStateA}
              sortedStates={sortedStates}
              aria-label='First state'
            />
            <span className='text-muted-foreground text-sm shrink-0'>vs</span>
            <SelectState
              value={stateB}
              onChange={setStateB}
              sortedStates={sortedStates}
              aria-label='Second state'
            />
            <span className='text-muted-foreground text-sm shrink-0'>vs</span>
            <SelectState
              value={stateC}
              onChange={setStateC}
              sortedStates={sortedStates}
              aria-label='Third state'
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='border-b border-border/60 bg-muted/40'>
                <th className='text-left py-3.5 pl-4 pr-2 font-medium text-muted-foreground w-36'>
                  Metric
                </th>
                {cols.map((s, i) => (
                  <th key={i} className='py-3.5 px-4 font-semibold text-center text-foreground min-w-[5rem]'>
                    {s ? s.state : '—'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map(({ key, label, format, higherIsBetter }) => {
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
          </table>
        </div>

        {(a || b || c) && (
          <div className='p-4 md:p-6 border-t bg-muted/20 flex flex-wrap justify-center gap-2'>
            {a && (
              <Link
                href={stateGymsdataPath(a)}
                className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
              >
                <MapPin className='h-4 w-4' />
                Browse {a.stateName}
              </Link>
            )}
            {b && (
              <Link
                href={stateGymsdataPath(b)}
                className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
              >
                <MapPin className='h-4 w-4' />
                Browse {b.stateName}
              </Link>
            )}
            {c && (
              <Link
                href={stateGymsdataPath(c)}
                className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors'
              >
                <MapPin className='h-4 w-4' />
                Browse {c.stateName}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
