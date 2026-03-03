'use client'

import { useState, useCallback } from 'react'

const COLUMNS = ['Name', 'Address', 'City', 'State', 'Email', 'Phone', 'Website'] as const
const ROW_KEYS = ['name', 'address', 'city', 'state', 'email', 'phone', 'website'] as const
const ROWS: Record<(typeof ROW_KEYS)[number], string>[] = [
  { name: 'Gym 1', address: 'Address', city: 'City', state: 'State', email: 'contact@…', phone: '+1…', website: 'gym.com' },
  { name: 'Gym 2', address: 'Address', city: 'City', state: 'State', email: 'contact@…', phone: '+1…', website: 'gym2.com' },
  { name: 'Gym 3', address: 'Address', city: 'City', state: 'State', email: 'contact@…', phone: '+1…', website: 'gym3.com' },
  { name: 'Gym 4', address: 'Address', city: 'City', state: 'State', email: 'contact@…', phone: '+1…', website: 'gym4.com' },
  { name: 'Gym 5', address: 'Address', city: 'City', state: 'State', email: 'contact@…', phone: '+1…', website: 'gym5.com' },
]

export function DatasetPreviewTable() {
  const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  const handleHeaderEnter = useCallback((colIndex: number) => {
    setHighlightedColumn(colIndex)
  }, [])
  const handleHeaderLeave = useCallback(() => {
    setHighlightedColumn(null)
  }, [])

  return (
    <div className='relative w-full max-w-md'>
      <div
        className='absolute -inset-4 rounded-2xl opacity-90 bg-gradient-to-br from-sky-100 to-sky-50'
        style={{
          backgroundImage: 'linear-gradient(rgba(14,165,233,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      <div className='relative rounded-xl border border-border/80 bg-card shadow-lg overflow-hidden transform rotate-[-1deg]'>
        <div
          className='absolute top-4 right-0 z-10 flex h-9 items-center justify-center bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-md'
          style={{ transform: 'rotate(12deg)' }}
        >
          Instant Delivery
        </div>
        <div className='overflow-x-auto overflow-y-visible p-3 pt-4'>
          <table className='w-full min-w-[280px] text-left text-xs border-collapse'>
            <thead>
              <tr className='border-b border-border'>
                {COLUMNS.map((label, colIndex) => (
                  <th
                    key={label}
                    className={`pb-2 pr-2 font-medium cursor-pointer select-none transition-all duration-300 ease-out rounded-t ${
                      highlightedColumn === colIndex
                        ? 'relative z-10 -translate-y-1 text-primary border-x-2 border-primary/50 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/14 shadow-[inset_0_2px_0_rgba(255,255,255,0.7),0_4px_12px_rgba(0,0,0,0.12),0_2px_4px_rgba(0,0,0,0.08)]'
                        : 'text-muted-foreground hover:bg-muted/80'
                    } ${colIndex === ROW_KEYS.length - 1 ? 'pr-0' : ''}`}
                    onMouseEnter={() => handleHeaderEnter(colIndex)}
                    onMouseLeave={handleHeaderLeave}
                    onClick={() => setHighlightedColumn(highlightedColumn === colIndex ? null : colIndex)}
                    title={highlightedColumn === colIndex ? 'Click to clear highlight' : 'Hover or click to highlight column'}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='text-muted-foreground'>
              {ROWS.map((row, rowIndex) => (
                <tr
                  key={row.name}
                  className={`border-b border-border/60 transition-colors ${
                    hoveredRow === rowIndex ? 'bg-muted/50' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {ROW_KEYS.map((key, colIndex) => {
                    const value = row[key] ?? ''
                    return (
                      <td
                        key={key}
                        className={`py-1.5 pr-2 transition-all duration-300 ease-out ${
                          highlightedColumn === colIndex
                            ? 'relative z-[1] -translate-y-px border-x-2 border-primary/40 bg-gradient-to-b from-primary/20 via-primary/14 to-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.08)]'
                            : ''
                        } ${colIndex === ROW_KEYS.length - 1 ? 'pr-0' : ''}`}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
