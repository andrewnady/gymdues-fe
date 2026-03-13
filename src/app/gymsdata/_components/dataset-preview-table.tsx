'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Building2, MapPin, Mail, Phone, Globe, ChevronRight, ChevronsRight, Download, Info } from 'lucide-react'

/** Preview columns (maps to schema: business_name, full_address, city, state, type, email_1, business_phone, business_website) */
const COLUMNS = [
  { key: 'name', label: 'Business name', schemaKey: 'business_name', icon: Building2, width: 'min-w-[120px]' },
  { key: 'address', label: 'Full address', schemaKey: 'full_address', icon: MapPin, width: 'min-w-[100px]' },
  { key: 'city', label: 'City', schemaKey: 'city', width: 'min-w-[72px]' },
  { key: 'state', label: 'State', schemaKey: 'state', width: 'min-w-[56px]' },
  { key: 'type', label: 'Type', schemaKey: 'type', width: 'min-w-[80px]' },
  { key: 'email', label: 'Email', schemaKey: 'email_1', icon: Mail, width: 'min-w-[100px]' },
  { key: 'phone', label: 'Business phone', schemaKey: 'business_phone', icon: Phone, width: 'min-w-[88px]' },
  { key: 'website', label: 'Business website', schemaKey: 'business_website', icon: Globe, width: 'min-w-[80px]' },
] as const

/** Full dataset columns (CSV download) – matches DB schema */
export const FULL_DOWNLOAD_COLUMNS = [
  'google_id', 'google_place_url', 'review_url', 'contact_page',
  'business_name', 'aka', 'type', 'sub_types', 'years_in_business', 'areas_serviced', 'bbb_rating',
  'business_phone', 'additional_phones', 'email_1', 'email_2', 'email_3',
  'business_website', 'additional_sites',
  'facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'google_plus', 'tripadvisor',
  'full_address', 'street', 'suburb', 'borough', 'city', 'postal_code', 'state', 'country', 'timezone',
  'latitude', 'longitude',
  'total_reviews', 'average_rating', 'reviews_per_score',
  'reviews_per_score_1', 'reviews_per_score_2', 'reviews_per_score_3', 'reviews_per_score_4', 'reviews_per_score_5',
] as const

const FULL_DOWNLOAD_COUNT = FULL_DOWNLOAD_COLUMNS.length

type RowRecord = Record<(typeof COLUMNS)[number]['key'], string>

const FALLBACK_ROWS: RowRecord[] = [
  { name: 'Gym 1', address: 'Address', city: 'City', state: 'State', type: 'Gym', email: 'contact@…', phone: '+1…', website: 'gym.com' },
  { name: 'Gym 2', address: 'Address', city: 'City', state: 'State', type: 'Gym', email: 'contact@…', phone: '+1…', website: 'gym2.com' },
  { name: 'Gym 3', address: 'Address', city: 'City', state: 'State', type: 'Gym', email: 'contact@…', phone: '+1…', website: 'gym3.com' },
  { name: 'Gym 4', address: 'Address', city: 'City', state: 'State', type: 'Gym', email: 'contact@…', phone: '+1…', website: 'gym4.com' },
  { name: 'Gym 5', address: 'Address', city: 'City', state: 'State', type: 'Gym', email: 'contact@…', phone: '+1…', website: 'gym5.com' },
]

function truncate(value: string, maxLen: number) {
  if (!value) return ''
  return value.length <= maxLen ? value : value.slice(0, maxLen) + '…'
}

export function DatasetPreviewTable({ rows }: { rows?: RowRecord[] }) {
  const tableRows = rows && rows.length > 0 ? rows : FALLBACK_ROWS
  const [highlightedColumn, setHighlightedColumn] = useState<number | null>(null)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [scrollState, setScrollState] = useState<{ canScrollLeft: boolean; canScrollRight: boolean }>({
    canScrollLeft: false,
    canScrollRight: true,
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const canScrollLeft = scrollLeft > 2
    const canScrollRight = scrollLeft < scrollWidth - clientWidth - 2
    setScrollState((prev) =>
      prev.canScrollLeft !== canScrollLeft || prev.canScrollRight !== canScrollRight
        ? { canScrollLeft, canScrollRight }
        : prev
    )
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => ro.disconnect()
  }, [updateScrollState, tableRows.length])

  const handleHeaderEnter = useCallback((colIndex: number) => setHighlightedColumn(colIndex), [])
  const handleHeaderLeave = useCallback(() => setHighlightedColumn(null), [])

  return (
    <div className='relative w-full min-w-0 max-w-2xl'>
      <div className='relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/5 dark:shadow-none dark:border-border/80'>
        {/* Top bar */}
        <div className='flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-border/60 bg-muted/30 px-3 sm:px-4 py-3'>
          <div className='flex items-center gap-2'>
            <div className='flex h-2 w-2 rounded-full bg-emerald-500' aria-hidden />
            <span className='text-xs font-medium text-muted-foreground'>Live sample</span>
          </div>
          <span className='rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary'>
            Instant delivery
          </span>
        </div>

        {/* Callout: full download has all schema columns */}
        <div className='flex items-start gap-2 border-b border-border/50 bg-primary/5 px-3 sm:px-4 py-2.5'>
          <Download className='h-4 w-4 shrink-0 text-primary mt-0.5' aria-hidden />
          <p className='text-[11px] text-foreground/90 min-w-0'>
            <span className='font-medium'>Full download includes {FULL_DOWNLOAD_COUNT} columns</span>
            <span className='text-muted-foreground'> — business_name, full_address, emails (1–3), business_phone, business_website, facebook, instagram, total_reviews, average_rating, latitude, longitude, and more. This preview shows 8 columns; scroll right.</span>
          </p>
        </div>

        <div className='relative'>
          {/* Left fade – more content to the left */}
          {scrollState.canScrollLeft && (
            <div
              className='pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-card to-transparent transition-opacity duration-200'
              aria-hidden
            />
          )}
          {/* Right fade – more columns to the right */}
          {scrollState.canScrollRight && (
            <div
              className='pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-card via-card/80 to-transparent transition-opacity duration-200'
              aria-hidden
            />
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className='dataset-preview-table-scroll overflow-x-auto overflow-y-auto max-h-[280px] sm:max-h-[340px] overscroll-contain -mx-1 px-1'
            style={{ scrollbarGutter: 'stable' }}
          >
            <style
              dangerouslySetInnerHTML={{
                __html: `
                  .dataset-preview-table-scroll {
                    scroll-behavior: smooth;
                    scrollbar-width: thin;
                    scrollbar-color: hsl(var(--muted-foreground) / 0.4) transparent;
                  }
                  .dataset-preview-table-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
                  .dataset-preview-table-scroll::-webkit-scrollbar-track { background: hsl(var(--muted) / 0.3); border-radius: 5px; }
                  .dataset-preview-table-scroll::-webkit-scrollbar-thumb {
                    background: hsl(var(--muted-foreground) / 0.4);
                    border-radius: 5px;
                  }
                  .dataset-preview-table-scroll::-webkit-scrollbar-thumb:hover {
                    background: hsl(var(--muted-foreground) / 0.6);
                  }
                  .dataset-preview-table-scroll::-webkit-scrollbar-corner {
                    background: hsl(var(--muted) / 0.3);
                    border-radius: 0 0 5px 0;
                  }
                `,
              }}
            />
            <table className='w-full min-w-[540px] text-left'>
            <thead className='sticky top-0 z-10 bg-muted/50 backdrop-blur-md'>
              <tr>
                {COLUMNS.map((col, colIndex) => {
                  const Icon = 'icon' in col ? col.icon : undefined
                  const isHighlighted = highlightedColumn === colIndex
                  return (
                    <th
                      key={col.key}
                      className={`py-3 px-4 text-[11px] font-semibold uppercase tracking-widest cursor-pointer select-none transition-colors duration-200 ${
                        col.width
                      } ${
                        isHighlighted
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                      } ${colIndex === 0 ? 'pl-5' : ''} ${colIndex === COLUMNS.length - 1 ? 'pr-5' : ''}`}
                      onMouseEnter={() => handleHeaderEnter(colIndex)}
                      onMouseLeave={handleHeaderLeave}
                      onClick={() => setHighlightedColumn(highlightedColumn === colIndex ? null : colIndex)}
                      title={isHighlighted ? 'Clear column highlight' : 'Highlight column'}
                    >
                      <span className='inline-flex items-center gap-2'>
                        {Icon && <Icon className='h-3.5 w-3.5 opacity-60' aria-hidden />}
                        {col.label}
                      </span>
                    </th>
                  )
                })}
                <th className='w-8 pr-3' aria-hidden />
              </tr>
            </thead>
            <tbody className='divide-y divide-border/40'>
              {tableRows.map((row, rowIndex) => {
                const isHovered = hoveredRow === rowIndex
                return (
                  <tr
                    key={rowIndex}
                    className={`group transition-colors duration-150 ${
                      isHovered ? 'bg-primary/5' : 'hover:bg-muted/40'
                    }`}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {COLUMNS.map((col, colIndex) => {
                      const value = row[col.key] ?? ''
                      const display = col.key === 'name' ? value : truncate(value, 20)
                      const isHighlighted = highlightedColumn === colIndex
                      const isFirst = colIndex === 0
                      return (
                        <td
                          key={col.key}
                          className={`py-3 px-4 text-[13px] transition-colors duration-150 ${
                            col.width
                          } ${
                            isHighlighted ? 'bg-primary/5' : ''
                          } ${isFirst ? 'font-medium text-foreground pl-5' : 'text-muted-foreground'} ${
                            colIndex === COLUMNS.length - 1 ? 'pr-5' : ''
                          }`}
                          title={value || undefined}
                        >
                          <span className='block truncate max-w-[160px]'>{display || '—'}</span>
                        </td>
                      )
                    })}
                    <td className='w-8 pr-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <ChevronRight className='h-4 w-4' aria-hidden />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>

        <div className='border-t border-border/50 bg-muted/20 px-4 py-3 space-y-2'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-[11px] text-muted-foreground'>
              {tableRows.length} row{tableRows.length !== 1 ? 's' : ''} · sample from full dataset
            </span>
            {scrollState.canScrollRight && (
              <span className='flex items-center gap-1.5 text-[10px] font-medium text-primary'>
                <ChevronsRight className='h-3.5 w-3.5 shrink-0' aria-hidden />
                Scroll right for more columns
              </span>
            )}
          </div>
          <div className='flex items-center gap-2 text-[10px] text-muted-foreground'>
            <Info className='h-3.5 w-3.5 shrink-0 opacity-70' aria-hidden />
            <span>When you purchase, the file includes all <strong className='text-foreground/80'>{FULL_DOWNLOAD_COUNT} columns</strong> (e.g. google_id, type, email_2, email_3, facebook, total_reviews, latitude, longitude). This table is a preview only.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
