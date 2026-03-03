'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Ruler, Search, Building2, TrendingUp, DollarSign, Target, Loader2 } from 'lucide-react'

const RADII = [5, 10, 15, 25, 50] as const

interface LocationWithCount {
  label: string
  city: string | null
  state: string | null
  postal_code: string | null
  count: number
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debouncedValue
}

/** Mock result for a given market and radius. Replace with API call later. */
function getMockResults(market: string, radiusMiles: number) {
  const isLA = /los angeles|la\b/i.test(market.trim())
  const baseTotal = isLA && radiusMiles === 10 ? 247 : 180 + Math.floor(Math.random() * 120)
  const leaders = isLA && radiusMiles === 10
    ? [{ name: 'LA Fitness', count: 12 }, { name: 'Equinox', count: 8 }]
    : [
        { name: 'LA Fitness', count: 8 + Math.floor(Math.random() * 6) },
        { name: 'Planet Fitness', count: 5 + Math.floor(Math.random() * 5) },
      ]
  const gaps = isLA && radiusMiles === 10
    ? [{ category: 'Yoga', count: 3 }, { category: 'Rock Climbing', count: 0 }]
    : [
        { category: 'Yoga', count: 2 + Math.floor(Math.random() * 4) },
        { category: 'Rock Climbing', count: Math.floor(Math.random() * 2) },
      ]
  const avgPrice = isLA && radiusMiles === 10 ? 65 : 45 + Math.floor(Math.random() * 40)
  const saturation = isLA && radiusMiles === 10 ? 72 : 50 + Math.floor(Math.random() * 40)
  const saturationLabel = saturation >= 80 ? 'High' : saturation >= 50 ? 'Moderate' : 'Low'
  return { baseTotal, leaders, gaps, avgPrice, saturation, saturationLabel }
}

export function CompetitiveIntelligenceTool() {
  const [market, setMarket] = useState('Los Angeles, CA')
  const [radius, setRadius] = useState(10)
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<ReturnType<typeof getMockResults> | null>(null)
  const [marketOpen, setMarketOpen] = useState(false)
  const [marketOptions, setMarketOptions] = useState<LocationWithCount[]>([])
  const [marketLoading, setMarketLoading] = useState(false)
  const marketRef = useRef<HTMLDivElement>(null)
  const debouncedMarket = useDebounce(market.trim(), 300)

  useEffect(() => {
    if (!debouncedMarket) {
      setMarketOptions([])
      setMarketLoading(false)
      return
    }
    setMarketLoading(true)
    const params = new URLSearchParams({ q: debouncedMarket })
    fetch(`/api/gyms/locations?${params.toString()}`)
      .then((r) => r.json())
      .then((data: LocationWithCount[]) => {
        setMarketOptions(Array.isArray(data) ? data : [])
      })
      .catch(() => setMarketOptions([]))
      .finally(() => setMarketLoading(false))
  }, [debouncedMarket])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (marketRef.current && !marketRef.current.contains(e.target as Node)) setMarketOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectLocation = useCallback((loc: LocationWithCount) => {
    setMarket(loc.label)
    setMarketOpen(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setResults(getMockResults(market, radius))
    setSubmitted(true)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Enter your target market</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div ref={marketRef}>
            <label htmlFor="ci-market" className="block text-sm font-medium text-muted-foreground mb-1.5">
              Target market (city, state or ZIP)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" aria-hidden />
              <input
                id="ci-market"
                type="text"
                value={market}
                onChange={(e) => {
                  setMarket(e.target.value)
                  setMarketOpen(true)
                }}
                onFocus={() => setMarketOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setMarketOpen(false)
                }}
                placeholder="e.g. Los Angeles, CA"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Target market (city, state or ZIP)"
                aria-autocomplete="list"
                aria-expanded={marketOpen}
              />
              {marketLoading ? (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin z-10" aria-hidden />
              ) : (
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" aria-hidden />
              )}
              {marketOpen && (marketOptions.length > 0 || debouncedMarket || marketLoading) && (
                <ul
                  className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg max-h-56 overflow-auto"
                  role="listbox"
                >
                  {marketLoading && debouncedMarket && (
                    <li className="px-3 py-2 text-sm text-muted-foreground">Searching…</li>
                  )}
                  {!marketLoading && debouncedMarket && marketOptions.length === 0 && (
                    <li className="px-3 py-2 text-sm text-muted-foreground">No locations found</li>
                  )}
                  {!marketLoading && marketOptions.map((loc) => (
                    <li
                      key={[loc.city, loc.state, loc.postal_code].filter(Boolean).join('-')}
                      role="option"
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        selectLocation(loc)
                      }}
                    >
                      {loc.label} — {loc.count.toLocaleString('en-US')} gyms
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="ci-radius" className="block text-sm font-medium text-muted-foreground mb-1.5">
              Radius
            </label>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden />
              <select
                id="ci-radius"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring appearance-none"
                aria-label="Radius in miles"
              >
                {RADII.map((m) => (
                  <option key={m} value={m}>{m} miles</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Search className="h-4 w-4" aria-hidden />
            Analyze market
          </button>
        </div>
      </form>

      {submitted && results && (
        <section className="rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm" aria-live="polite">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Total gyms in area</span>
              </div>
              <p className="text-2xl font-bold tabular-nums">{results.baseTotal}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Market leaders</span>
              </div>
              <p className="text-sm font-medium">
                {results.leaders.map((l) => `${l.name} (${l.count})`).join(', ')}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 sm:col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Gap opportunities</span>
              </div>
              <ul className="text-sm font-medium list-disc list-inside">
                {results.gaps.map((g) => (
                  <li key={g.category}>
                    {g.category}: {g.count === 0 ? '0' : `only ${g.count}`}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" aria-hidden />
                <span className="text-sm font-medium">Average price point</span>
              </div>
              <p className="text-2xl font-bold">${results.avgPrice}/month</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="text-muted-foreground text-sm font-medium mb-1">Saturation score</div>
              <p className="text-2xl font-bold tabular-nums">{results.saturation}/100</p>
              <p className="text-sm text-muted-foreground">({results.saturationLabel})</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
