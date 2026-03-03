'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import type { StateComparisonRow } from '../_data/state-comparison-stats'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'

type SortKey = 'stateName' | 'count' | 'densityPer100k' | 'avgPriceMonthly' | 'saturationIndex'

interface StateByStateComparisonTableProps {
  rows: StateComparisonRow[]
}

export function StateByStateComparisonTable({ rows }: StateByStateComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('count')
  const [asc, setAsc] = useState(false)

  const sortedRows = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'stateName':
          cmp = (a.stateName ?? '').localeCompare(b.stateName ?? '')
          break
        case 'count':
          cmp = a.count - b.count
          break
        case 'densityPer100k':
          cmp = a.densityPer100k - b.densityPer100k
          break
        case 'avgPriceMonthly':
          cmp = a.avgPriceMonthly - b.avgPriceMonthly
          break
        case 'saturationIndex':
          cmp = a.saturationIndex - b.saturationIndex
          break
        default:
          break
      }
      return asc ? cmp : -cmp
    })
    return list
  }, [rows, sortKey, asc])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setAsc((a) => !a)
    else {
      setSortKey(key)
      setAsc(key === 'stateName' ? true : false)
    }
  }

  const SortHeader = ({
    id,
    label,
    className = '',
  }: {
    id: SortKey
    label: string
    className?: string
  }) => (
    <th className={className}>
      <button
        type='button'
        onClick={() => toggleSort(id)}
        className='inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded'
        aria-label={`Sort by ${label} ${sortKey === id ? (asc ? 'ascending' : 'descending') : ''}`}
      >
        {label}
        {sortKey === id ? (
          asc ? <ArrowUp className='h-3.5 w-3.5' /> : <ArrowDown className='h-3.5 w-3.5' />
        ) : (
          <ArrowUpDown className='h-3.5 w-3.5 opacity-50' />
        )}
      </button>
    </th>
  )

  return (
    <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
      <table className='min-w-full text-left text-sm'>
        <thead className='bg-muted/50 border-b border-border/60'>
          <tr>
            <SortHeader id='stateName' label='State' className='px-4 py-3.5' />
            <SortHeader id='count' label='Gyms' className='px-4 py-3.5 text-right w-24' />
            <SortHeader id='densityPer100k' label='Gym density per 100k' className='px-4 py-3.5 text-right w-36' />
            <SortHeader id='avgPriceMonthly' label='Avg. price (state)' className='px-4 py-3.5 text-right w-32' />
            <SortHeader id='saturationIndex' label='Market saturation' className='px-4 py-3.5 text-right w-32' />
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={row.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40'>
              <td className='px-4 py-3 font-medium'>
                <Link href={stateGymsdataPath({ state: row.state, stateName: row.stateName, count: row.count })} className='text-primary hover:underline'>
                  {row.stateName}
                </Link>
                <span className='ml-1.5 text-muted-foreground font-mono text-xs'>({row.state})</span>
              </td>
              <td className='px-4 py-3 text-right tabular-nums'>{row.count.toLocaleString('en-US')}</td>
              <td className='px-4 py-3 text-right tabular-nums'>{row.densityPer100k.toFixed(1)}</td>
              <td className='px-4 py-3 text-right'>${row.avgPriceMonthly}/mo</td>
              <td className='px-4 py-3 text-right'>
                <span className='tabular-nums'>{row.saturationIndex}</span>
                <span className='text-muted-foreground text-xs ml-1'>/100</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
