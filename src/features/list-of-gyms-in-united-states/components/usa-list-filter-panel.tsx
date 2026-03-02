'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  Filter,
  MapPin,
  ChevronDown,
  Building2,
  Mail,
  Phone,
  Globe2,
  Star,
  Dumbbell,
  Share2,
  Search,
  Loader2,
  FileDown,
  DollarSign,
} from 'lucide-react'
import type { StateWithCount } from '@/types/gym'
import type { LocationWithCount } from '@/types/gym'

interface UsaListFilterPanelProps {
  sortedStates: StateWithCount[]
  totalGyms: number
}

const TOP_STATE_COUNT = 6
const PRICE_PER_1000 = 99 // placeholder
const BYTES_PER_RECORD = 2048 // ~2KB for CSV row

const GYM_TYPES = [
  '24-Hour Gyms',
  'Budget (<$50/mo)',
  'Luxury Fitness',
  'CrossFit Boxes',
  'Yoga Studios',
  'Martial Arts',
  'Specialty (Climbing, Swimming, etc.)',
] as const

const DATA_OPTIONS = [
  { icon: Mail, label: 'Has Email' },
  { icon: Phone, label: 'Has Phone' },
  { icon: Globe2, label: 'Has Website' },
  { icon: Share2, label: 'Has Social Media' },
  { label: 'Full Contact (Email + Phone)' },
] as const

const RATING_OPTIONS = [
  { label: '5 Stars Only', desc: '' },
  { label: '4+ Stars', desc: '' },
  { label: 'Under 3 Stars', desc: 'Reputation management leads' },
  { label: 'Not Yet Rated', desc: 'New businesses' },
] as const

const BUSINESS_SIZE = [
  'Single Location',
  'Small Chain (2-10)',
  'Regional Chain (11-50)',
  'National Brands (50+)',
] as const

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debouncedValue
}

export function UsaListFilterPanel({ sortedStates, totalGyms }: UsaListFilterPanelProps) {
  const [selectedState, setSelectedState] = useState<string>('')
  const [cityInput, setCityInput] = useState('')
  const [cityOpen, setCityOpen] = useState(false)
  const [cityOptions, setCityOptions] = useState<LocationWithCount[]>([])
  const [cityLoading, setCityLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationWithCount | null>(null)
  const [zipInput, setZipInput] = useState('')
  const [radiusLocation, setRadiusLocation] = useState('')
  const [radiusMiles, setRadiusMiles] = useState('')
  const [gymTypes, setGymTypes] = useState<Set<string>>(new Set())
  const [dataOptions, setDataOptions] = useState<Set<string>>(new Set())
  const [rating, setRating] = useState<Set<string>>(new Set())
  const [businessSize, setBusinessSize] = useState<Set<string>>(new Set())
  const [sampleGyms, setSampleGyms] = useState<{ name: string; slug: string; city?: string; state?: string }[]>([])
  const [sampleLoading, setSampleLoading] = useState(false)
  const [filteredTotal, setFilteredTotal] = useState<number | null>(null)
  const cityRef = useRef<HTMLDivElement>(null)

  const stateData = sortedStates.find(
    (s) => s.state === selectedState || s.stateName === selectedState,
  )
  const topStates = sortedStates.slice(0, TOP_STATE_COUNT)
  const debouncedCity = useDebounce(cityInput.trim(), 300)

  const toggleSet = (setter: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) => {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // City autocomplete via /api/gyms/locations (proxies backend gyms/locations)
  useEffect(() => {
    if (!debouncedCity) {
      setCityOptions([])
      setCityLoading(false)
      return
    }
    setCityLoading(true)
    const params = new URLSearchParams({ q: debouncedCity })
    fetch(`/api/gyms/locations?${params.toString()}`)
      .then((r) => r.json())
      .then((data: LocationWithCount[]) => {
        setCityOptions(Array.isArray(data) ? data : [])
      })
      .catch(() => setCityOptions([]))
      .finally(() => setCityLoading(false))
  }, [debouncedCity])

  // Click outside to close city dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLocation = useCallback((loc: LocationWithCount) => {
    setCityInput(loc.label)
    setSelectedLocation(loc)
    if (loc.state) setSelectedState(loc.state)
    setCityOpen(false)
  }, [])

  // Filtered count: prefer selected location count, else state count
  const displayCount = selectedLocation?.count ?? stateData?.count ?? null

  // Fetch sample gyms and total when state/city changes
  useEffect(() => {
    if (!selectedState && !selectedLocation) {
      setSampleGyms([])
      setFilteredTotal(null)
      setSampleLoading(false)
      return
    }
    setSampleLoading(true)
    const params = new URLSearchParams()
    if (selectedState) params.set('state', selectedState)
    if (selectedLocation?.city) params.set('city', selectedLocation.city)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    // Use Next.js API route to avoid CORS; server fetches from backend
    fetch(`/api/gyms/sample?${params.toString()}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data: unknown) => {
        clearTimeout(timeoutId)
        const raw = data as Record<string, unknown>
        const list = Array.isArray(raw?.data) ? raw.data as Record<string, unknown>[] : []
        const total = typeof raw?.total === 'number' ? raw.total : displayCount ?? null
        setSampleGyms(
          list.slice(0, 5).map((g) => ({
            name: (g.name ?? g.title ?? '—') as string,
            slug: (g.slug ?? '') as string,
            city: g.city as string | undefined,
            state: g.state as string | undefined,
          }))
        )
        setFilteredTotal(total)
      })
      .catch(() => {
        clearTimeout(timeoutId)
        setSampleGyms([])
        setFilteredTotal(displayCount)
      })
      .finally(() => setSampleLoading(false))
    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [selectedState, selectedLocation?.city ?? '', displayCount])

  const effectiveTotal = filteredTotal ?? displayCount ?? 0
  const estimatedSizeMB = (effectiveTotal * BYTES_PER_RECORD) / (1024 * 1024)
  const estimatedPrice = effectiveTotal > 0 ? (effectiveTotal / 1000) * PRICE_PER_1000 : 0

  const browseHref = (() => {
    if (!stateData && !selectedLocation) return '/gymsdata'
    if (cityInput.trim() && (selectedLocation || stateData)) {
      const loc = selectedLocation
        ? `${selectedLocation.city ?? cityInput}, ${selectedLocation.state ?? stateData?.state ?? ''}`
        : `${cityInput.trim()}, ${stateData?.state}`
      return `/gymsdata#location=${encodeURIComponent(loc)}`
    }
    if (stateData) return `/gymsdata#state=${encodeURIComponent(stateData.state)}`
    return '/gymsdata'
  })()

  const hasLocationSelection = !!selectedState || !!cityInput.trim() || !!zipInput.trim()

  return (
    <section className='max-w-6xl mx-auto mb-16' aria-label='Advanced filter'>
      <div className='flex items-center gap-2 mb-2'>
        <Filter className='h-6 w-6 text-primary shrink-0' />
        <h2 className='text-2xl md:text-3xl font-semibold'>
          Advanced filter
        </h2>
      </div>
      <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
        Multi-level filtering: location, gym type, data completeness, rating, and business size. Live
        preview shows matching count and sample records.
      </p>

      <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
        {/* Location */}
        <div className='p-4 md:p-6 border-b border-border/60'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2'>
            <MapPin className='h-4 w-4' />
            Location
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className='block'>
              <span className='text-xs font-medium text-muted-foreground'>By state (with gym counts)</span>
              <div className='relative mt-1.5'>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedLocation(null)
                  }}
                  className='w-full rounded-lg border border-input bg-background pl-3 pr-10 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 appearance-none cursor-pointer'
                  aria-describedby='filter-state-description'
                >
                  <option value=''>All states — browse entire U.S. list</option>
                  {sortedStates.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.stateName} — {s.count.toLocaleString('en-US')} gyms
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' aria-hidden />
              </div>
            </label>
            <div ref={cityRef} className='block'>
              <span className='text-xs font-medium text-muted-foreground'>By city (autocomplete)</span>
              <div className='relative mt-1.5'>
                <input
                  type='text'
                  value={cityInput}
                  onChange={(e) => {
                    setCityInput(e.target.value)
                    setCityOpen(true)
                    if (!e.target.value) setSelectedLocation(null)
                  }}
                  onFocus={() => setCityOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setCityOpen(false)
                  }}
                  placeholder='Search city (e.g. Los Angeles)'
                  className='w-full rounded-lg border border-input bg-background pl-3 pr-10 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  aria-label='Filter by city'
                  aria-autocomplete='list'
                  aria-expanded={cityOpen}
                />
                {cityLoading ? (
                  <Loader2 className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin' />
                ) : (
                  <Search className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                )}
                {cityOpen && (cityOptions.length > 0 || (debouncedCity && cityLoading)) && (
                  <ul
                    className='absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg max-h-56 overflow-auto'
                    role='listbox'
                  >
                    {cityLoading && debouncedCity && (
                      <li className='px-3 py-2 text-sm text-muted-foreground'>Searching…</li>
                    )}
                    {!cityLoading && cityOptions.map((loc) => (
                      <li
                        key={[loc.city, loc.state, loc.postal_code].filter(Boolean).join('-')}
                        role='option'
                        className='px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none'
                        onClick={() => selectLocation(loc)}
                      >
                        {loc.label} — {loc.count.toLocaleString('en-US')} gyms
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <p id='filter-state-description' className='sr-only'>
            Select a state to filter the gym list by location and see the count for that state.
          </p>
          <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <label className='block'>
              <span className='text-xs font-medium text-muted-foreground'>ZIP code</span>
              <input
                type='text'
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder='Enter ZIP'
                className='mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                aria-label='Filter by ZIP code'
              />
            </label>
            <label className='block'>
              <span className='text-xs font-medium text-muted-foreground'>Radius search</span>
              <div className='mt-1.5 flex gap-2'>
                <input
                  type='text'
                  value={radiusLocation}
                  onChange={(e) => setRadiusLocation(e.target.value)}
                  placeholder='City or address'
                  className='flex-1 rounded-lg border border-input bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  aria-label='Location for radius search'
                />
                <input
                  type='text'
                  inputMode='numeric'
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(e.target.value)}
                  placeholder='Mi'
                  className='w-20 rounded-lg border border-input bg-background px-3 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                  aria-label='Radius in miles'
                />
              </div>
            </label>
          </div>
          {topStates.length > 0 && (
            <div className='mt-4'>
              <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>Quick pick state</span>
              <div className='mt-2 flex flex-wrap gap-2'>
                {topStates.map((s) => (
                  <button
                    key={s.state}
                    type='button'
                    onClick={() => {
                      setSelectedState(selectedState === s.state ? '' : s.state)
                      setSelectedLocation(null)
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                      selectedState === s.state ? 'bg-primary text-primary-foreground' : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <MapPin className='h-3.5 w-3.5 shrink-0' />
                    {s.stateName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gym type, Data completeness, Rating, Business size */}
        <div className='p-4 md:p-6 border-b border-border/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <div>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2'>
              <Dumbbell className='h-4 w-4' />
              Gym type
            </h3>
            <div className='flex flex-wrap gap-2'>
              {GYM_TYPES.map((label) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => toggleSet(setGymTypes, label)}
                  className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    gymTypes.has(label) ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-foreground hover:bg-muted hover:border-primary/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2'>Data completeness</h3>
            <div className='flex flex-wrap gap-2'>
              {DATA_OPTIONS.map((item) => {
                const Icon = 'icon' in item ? item.icon : undefined
                const label = item.label
                return (
                  <button
                    key={label}
                    type='button'
                    onClick={() => toggleSet(setDataOptions, label)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      dataOptions.has(label) ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-foreground hover:bg-muted hover:border-primary/40'
                    }`}
                  >
                    {Icon && <Icon className='h-3.5 w-3.5 shrink-0' />}
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2'>
              <Star className='h-4 w-4' />
              Rating
            </h3>
            <div className='flex flex-wrap gap-2'>
              {RATING_OPTIONS.map(({ label, desc }) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => toggleSet(setRating, label)}
                  title={desc}
                  className={`inline-flex flex-col items-start rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    rating.has(label) ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-foreground hover:bg-muted hover:border-primary/40'
                  }`}
                >
                  {label}
                  {desc ? (
                    <span className='text-[10px] text-muted-foreground font-normal mt-0.5 block'>
                      {desc}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2'>Business size</h3>
            <div className='flex flex-wrap gap-2'>
              {BUSINESS_SIZE.map((label) => (
                <button
                  key={label}
                  type='button'
                  onClick={() => toggleSet(setBusinessSize, label)}
                  className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    businessSize.has(label) ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-foreground hover:bg-muted hover:border-primary/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className='p-4 md:p-6 border-b border-border/60 bg-muted/20'>
          <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>Live preview</h3>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='space-y-3'>
              <div className='flex flex-wrap items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <Building2 className='h-5 w-5 text-primary' />
                  <span className='text-2xl font-bold tabular-nums'>
                    {displayCount != null ? displayCount.toLocaleString('en-US') : totalGyms.toLocaleString('en-US')}
                  </span>
                  <span className='text-sm text-muted-foreground'>matching gyms</span>
                </div>
                {effectiveTotal > 0 && (
                  <>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <FileDown className='h-4 w-4' />
                      ~{estimatedSizeMB < 0.1 ? '< 0.1' : estimatedSizeMB.toFixed(1)} MB download
                    </div>
                    <div className='flex items-center gap-2 text-sm font-medium'>
                      <DollarSign className='h-4 w-4 text-primary' />
                      ${Math.round(estimatedPrice).toLocaleString('en-US')} estimated
                    </div>
                  </>
                )}
              </div>
              <p className='text-xs text-muted-foreground'>
                Pricing is dynamic based on selection. Sample records below; full data available after purchase.
              </p>
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2'>Sample data (up to 5 records)</p>
              {sampleLoading ? (
                <div className='flex items-center gap-2 text-sm text-muted-foreground py-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Loading…
                </div>
              ) : sampleGyms.length > 0 ? (
                <ul className='space-y-1.5'>
                  {sampleGyms.map((g) => (
                    <li key={g.slug || g.name}>
                      <Link
                        href={g.slug ? `/gyms/${g.slug}` : '/gymsdata'}
                        className='text-sm text-primary hover:underline underline-offset-2'
                      >
                        {g.name}
                        {g.city && g.state && (
                          <span className='text-muted-foreground font-normal'> — {g.city}, {g.state}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className='text-sm text-muted-foreground py-1'>
                  {hasLocationSelection ? 'Select state or city to see sample records.' : 'Choose a state or city above to see a live preview.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className='border-t bg-muted/30 px-4 md:px-6 py-4'>
          {stateData || selectedLocation ? (
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10'>
                  <Building2 className='h-5 w-5 text-primary' />
                </div>
                <div>
                  <p className='font-semibold text-foreground'>
                    {(displayCount ?? 0).toLocaleString('en-US')} gyms
                    {cityInput.trim() ? ` in ${cityInput.trim()}` : stateData ? ` in ${stateData.stateName}` : ''}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Live count · View full list with membership prices and plans
                  </p>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-2 shrink-0'>
                <Link
                  href={browseHref}
                  className='inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors'
                >
                  Browse gyms{cityInput.trim() ? ` in ${cityInput.trim()}` : stateData ? ` in ${stateData.stateName}` : ''}
                  <ChevronDown className='h-4 w-4 rotate-[270deg]' aria-hidden />
                </Link>
                <Link
                  href='/gymsdata'
                  className='inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors'
                >
                  <MapPin className='h-4 w-4' />
                  Browse all gyms
                </Link>
              </div>
            </div>
          ) : (
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <p className='text-sm text-muted-foreground'>
                Select a state or city to see the gym count, sample records, and estimated pricing. Then browse the filtered list on the gyms page.
              </p>
              <Link
                href='/gymsdata'
                className='inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors shrink-0'
              >
                <MapPin className='h-4 w-4' />
                Browse all gyms
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
