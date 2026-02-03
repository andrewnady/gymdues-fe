'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { getPaginatedGyms, getStates } from '@/lib/gyms-api'
import type { Gym, StateWithCount } from '@/types/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GymCard } from '@/components/gym-card'
import { Search } from 'lucide-react'

const GymsDiscoveryMap = dynamic(
  () => import('./gyms-discovery-map').then((m) => m.GymsDiscoveryMap),
  { ssr: false }
)

/** Fetch all gyms for the selected state/search in one request (no pagination) */
const PER_PAGE_ALL = 500
const DEFAULT_STATE = 'New York'
const DEFAULT_STATE_LABEL = 'New York (New York)'

function parseHash(): { state: string; search: string } {
  if (typeof window === 'undefined') return { state: DEFAULT_STATE, search: '' }
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash)
  return {
    state: params.get('state')?.trim() || DEFAULT_STATE,
    search: params.get('search')?.trim() || '',
  }
}

function buildHash(params: { state?: string; search?: string }): string {
  const current = parseHash()
  const state = params.state !== undefined ? params.state : current.state
  const search = params.search !== undefined ? params.search : current.search
  const p = new URLSearchParams()
  if (state) p.set('state', state)
  if (search) p.set('search', search)
  const s = p.toString()
  return s ? `#${s}` : ''
}

export function GymsMapPageClient() {
  const [hashParams, setHashParams] = useState({ state: DEFAULT_STATE, search: '' })
  const [gyms, setGyms] = useState<Gym[]>([])
  const [totalGyms, setTotalGyms] = useState(0)
  const [loading, setLoading] = useState(true)
  const [states, setStates] = useState<StateWithCount[]>([])
  const [stateInput, setStateInput] = useState(DEFAULT_STATE_LABEL)
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false)
  const [gymName, setGymName] = useState('')
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null)
  const listItemRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const stateInputRef = useRef<HTMLDivElement>(null)

  const state = hashParams.state
  const search = hashParams.search

  const updateUrl = useCallback((updates: { state?: string; search?: string }) => {
    const newHash = buildHash(updates)
    window.history.replaceState(null, '', `/gyms${newHash}`)
    setHashParams(parseHash())
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash.slice(1)
    const parsed = parseHash()
    if (!hash) {
      window.history.replaceState(null, '', `/gyms#state=${DEFAULT_STATE}`)
      setHashParams({ state: DEFAULT_STATE, search: '' })
    } else {
      setHashParams(parsed)
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => setHashParams(parseHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    getStates().then(setStates)
  }, [])

  useEffect(() => {
    const el = stateInputRef.current
    if (!el) return
    const handleClickOutside = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) setStateDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setLoading(true)
    getPaginatedGyms({
      state: state || undefined,
      search: search || undefined,
      page: 1,
      perPage: PER_PAGE_ALL,
    })
      .then(({ gyms: g, meta: m }) => {
        setGyms(g)
        setTotalGyms(m.total)
      })
      .catch(() => {
        setGyms([])
        setTotalGyms(0)
      })
      .finally(() => setLoading(false))
  }, [state, search])

  useEffect(() => {
    const s = states.find((x) => x.state === state)
    if (s) setStateInput(`${s.stateName} (${s.state})`)
    else if (state) setStateInput(state)
  }, [state, states])

  const stateFilter = stateInput.trim().toLowerCase()
  const stateOptions = stateFilter
    ? states.filter(
      (s) =>
        s.state.toLowerCase().includes(stateFilter) ||
        s.stateName.toLowerCase().includes(stateFilter)
    )
    : states

  const handleSelectState = useCallback(
    (s: StateWithCount) => {
      setStateInput(`${s.stateName} (${s.state})`)
      setStateDropdownOpen(false)
      updateUrl({ state: s.state, search: gymName.trim() || undefined })
    },
    [updateUrl, gymName]
  )

  const handleSearch = useCallback(() => {
    const match = states.find(
      (s) =>
        s.state.toLowerCase() === stateInput.trim().toLowerCase() ||
        s.stateName.toLowerCase() === stateInput.trim().toLowerCase() ||
        `${s.stateName} (${s.state})`.toLowerCase() === stateInput.trim().toLowerCase()
    )
    if (match) {
      updateUrl({ state: match.state, search: gymName.trim() || undefined })
    } else if (stateOptions.length > 0) {
      handleSelectState(stateOptions[0])
    } else {
      updateUrl({ search: gymName.trim() || undefined })
    }
  }, [stateInput, gymName, states, stateOptions, updateUrl, handleSelectState])

  const handleGymSelect = useCallback((gymId: string) => {
    setSelectedGymId(gymId)
    const el = listItemRefs.current[gymId]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3 p-4 border-b bg-card rounded-t-lg">
        <div className="flex-1 min-w-[200px]" ref={stateInputRef}>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            State <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              className="pr-8"
              placeholder="e.g. New York (NY)"
              value={stateInput}
              onChange={(e) => {
                setStateInput(e.target.value)
                setStateDropdownOpen(true)
              }}
              onFocus={() => setStateDropdownOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
                if (e.key === 'Escape') setStateDropdownOpen(false)
              }}
              aria-autocomplete="list"
              aria-expanded={stateDropdownOpen}
              aria-controls="state-autocomplete-list"
              role="combobox"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            {stateDropdownOpen && stateOptions.length > 0 && (
              <ul
                id="state-autocomplete-list"
                className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {stateOptions.slice(0, 20).map((s) => (
                  <li
                    key={s.state}
                    role="option"
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none"
                    onClick={() => handleSelectState(s)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectState(s)
                      }
                    }}
                  >
                    {s.stateName} ({s.state}) — {s.count} gyms
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground block mb-1">Gym name</label>
          <Input
            placeholder="Gym name"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Main: list + map */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 border border-t-0 rounded-b-lg overflow-hidden">
        {/* Left: scrollable gym cards */}
        <div className="flex flex-col min-h-0 border-r bg-background overflow-hidden">
          <div className="p-3 border-b bg-muted/50 font-medium shrink-0">
            {loading ? 'Loading…' : `${totalGyms} gyms`}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            )}
            {!loading && gyms.length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No gyms found. Try adjusting your search or filters.
              </p>
            )}
            {!loading && gyms.length > 0 && (
              <div className="space-y-4">
                {gyms.map((gym) => {
                  const isSelected = selectedGymId !== null && String(gym.id) === String(selectedGymId)
                  return (
                    <div
                      key={gym.id}
                      ref={(el) => {
                        listItemRefs.current[String(gym.id)] = el
                      }}
                      className={isSelected ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : undefined}
                    >
                      <GymCard
                        gym={gym}
                        selectMode
                        onSelect={() => handleGymSelect(String(gym.id))}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div className="lg:col-span-2 min-h-[300px] lg:min-h-0 flex flex-col bg-muted/30">
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Loading map…
            </div>
          ) : (
            <div className="flex-1 min-h-[300px] w-full">
              <GymsDiscoveryMap
                gyms={gyms}
                selectedGymId={selectedGymId}
                onGymSelect={handleGymSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
