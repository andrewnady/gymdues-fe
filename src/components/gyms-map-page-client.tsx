'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { getPaginatedGyms, getAddressesByLocation, getLocations } from '@/lib/gyms-api'
import type { Gym, GymWithAddressesGroup, LocationWithCount } from '@/types/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GymCard } from '@/components/gym-card'
import { GymCardCompact } from '@/components/gym-card-compact'
import { Search } from 'lucide-react'

const GymsDiscoveryMap = dynamic(
  () => import('./gyms-discovery-map').then((m) => m.GymsDiscoveryMap),
  { ssr: false }
)

const PER_PAGE_ALL = 10

/** Renders location groups with compact cards; first visible card is active and map flies to it (zoom 15). */
function LocationGroupsList({
  locationGroups,
  selectedGymId,
  listItemRefs,
  scrollContainerRef,
  onGymSelect,
  firstAddressKey,
}: {
  locationGroups: GymWithAddressesGroup[]
  selectedGymId: string | null
  listItemRefs: React.RefObject<Record<string, HTMLElement | null>>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  onGymSelect: (gymId: string, firstLocationKey?: string | null) => void
  firstAddressKey: (g: GymWithAddressesGroup) => string | null
}) {
  const didSetInitial = useRef(false)
  // When list first gets data, set first group active so map flies to first location (zoom 15)
  useEffect(() => {
    if (locationGroups.length === 0 || didSetInitial.current) return
    didSetInitial.current = true
    const first = locationGroups[0]
    const key = firstAddressKey(first)
    onGymSelect(String(first.gym.id), key ?? undefined)
  }, [locationGroups, onGymSelect, firstAddressKey])

  // IntersectionObserver: first *visible* card in the scroll area is active; fly map to that location
  useEffect(() => {
    const root = scrollContainerRef.current
    if (!root || locationGroups.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(
          (e) => e.isIntersecting && e.intersectionRatio >= 0.5
        )
        if (visible.length === 0) return
        // First visible = topmost in the list (smallest top relative to viewport)
        const sorted = [...visible].sort(
          (a, b) =>
            (a.target as HTMLElement).getBoundingClientRect().top -
            (b.target as HTMLElement).getBoundingClientRect().top
        )
        const firstVisible = sorted[0]
        const gymId = (firstVisible.target as HTMLElement).getAttribute('data-gym-id')
        if (!gymId) return
        const group = locationGroups.find((g) => String(g.gym.id) === gymId)
        if (group) {
          const key = firstAddressKey(group)
          onGymSelect(gymId, key ?? undefined)
        }
      },
      { root, threshold: [0.5], rootMargin: '0px' }
    )
    locationGroups.forEach((group) => {
      const el = listItemRefs.current[String(group.gym.id)]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [locationGroups, listItemRefs, scrollContainerRef, onGymSelect, firstAddressKey])

  return (
    <div className="space-y-6">
      {locationGroups.map((group) => {
        const firstKey = firstAddressKey(group)
        return (
          <div
            key={group.gym.id}
            data-gym-id={String(group.gym.id)}
            ref={(el) => { listItemRefs.current[String(group.gym.id)] = el }}
            className={selectedGymId !== null && String(group.gym.id) === String(selectedGymId) ? 'ring-2 ring-primary ring-offset-2 rounded-lg' : undefined}
          >
            <GymCardCompact
              gym={group.gym}
              selectMode
              onSelect={() => onGymSelect(String(group.gym.id), firstKey ?? undefined)}
            />
          </div>
        )
      })}
    </div>
  )
}

/**
 * Parse location value (e.g. "Denver, CO 80202" or "Denver, CO") into { city?, state?, postal_code? }.
 * Format: "City, State Zipcode" — zip is last token if all digits; otherwise "City, State" only.
 */
function parseLocationValue(value: string): { city?: string; state?: string; postal_code?: string } {
  const v = value?.trim() ?? ''
  if (!v) return {}
  if (/^\d+$/.test(v)) return { postal_code: v }
  // State-only from list page hash: ", CA" -> { state: "CA" }
  if (/^,\s*[A-Za-z]{2}$/.test(v)) return { state: v.replace(/^,\s*/, '').trim() }
  const parts = v.split(/\s+/)
  const last = parts[parts.length - 1]
  if (last && /^\d+$/.test(last)) {
    const postal_code = last
    const cityState = parts.slice(0, -1).join(' ')
    const comma = cityState.lastIndexOf(',')
    if (comma > 0) {
      return {
        city: cityState.slice(0, comma).trim(),
        state: cityState.slice(comma + 1).trim(),
        postal_code,
      }
    }
  }
  const comma = v.lastIndexOf(',')
  if (comma > 0) {
    return { city: v.slice(0, comma).trim(), state: v.slice(comma + 1).trim() }
  }
  return { city: v }
}

/** Build display label: "City, State Zipcode" (all three when available) */
function locationLabel(loc: LocationWithCount): string {
  const parts = [loc.city, loc.state].filter(Boolean)
  const cityState = parts.join(', ')
  if (loc.postal_code) return cityState ? `${cityState} ${loc.postal_code}` : loc.postal_code
  return cityState
}

/** Value to store in URL and show in input (same as label now that we have all three) */
function stringifyLocation(loc: LocationWithCount): string {
  return locationLabel(loc)
}

/** Display format for state-only value ", CA" -> "State: CA" */
function locationDisplay(loc: string) {
  return loc && /^,\s*[A-Za-z]{2}$/.test(loc) ? `State: ${loc.replace(/^,\s*/, '')}` : loc
}

export function GymsMapPageClient() {
  const [defaultLocation, setDefaultLocation] = useState<LocationWithCount | null>(null)
  /** Applied filter values sent in API requests (kept in state, not in URL) */
  const [appliedLocation, setAppliedLocation] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [gyms, setGyms] = useState<Gym[]>([])
  const [totalGyms, setTotalGyms] = useState(0)
  const [locationGroups, setLocationGroups] = useState<GymWithAddressesGroup[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [locationInput, setLocationInput] = useState('')
  const [locationOptions, setLocationOptions] = useState<LocationWithCount[]>([])
  const [locationOpen, setLocationOpen] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [nameOptions, setNameOptions] = useState<Gym[]>([])
  const [nameLoading, setNameLoading] = useState(false)
  const [nameOpen, setNameOpen] = useState(false)
  const nameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameAbortRef = useRef<AbortController | null>(null)
  const nameJustSelectedRef = useRef(false)
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null)
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null)
  const listItemRefs = useRef<Record<string, HTMLElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const initialLocationOptionsRef = useRef<LocationWithCount[]>([])
  const locationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const locationAbortRef = useRef<AbortController | null>(null)
  const locationInputRef = useRef('')
  const nameInputRef = useRef('')

  locationInputRef.current = locationInput
  nameInputRef.current = nameInput

  const location = appliedLocation
  const name = appliedName

  // Load default location on mount once; also set locationOptions so autocomplete doesn't need a second fetch
  useEffect(() => {
    getLocations()
      .then((list) => {
        if (list.length > 0) {
          initialLocationOptionsRef.current = list
          setDefaultLocation(list[0])
          setLocationOptions(list)
          const value = stringifyLocation(list[0])
          setAppliedLocation(value)
          setLocationInput(locationDisplay(value))
        }
      })
      .catch(() => {})
  }, [])

  // Location options: empty → initial list; typing → filter initial list first, then fetch /locations for other cities/zips
  useEffect(() => {
    const q = locationInput.trim()
    const qLower = q.toLowerCase()
    if (!q) {
      setLocationOptions(initialLocationOptionsRef.current)
      setLocationLoading(false)
      return
    }
    const initial = initialLocationOptionsRef.current
    const filteredFromInitial = initial.filter(
      (loc) =>
        (loc.label ?? '').toLowerCase().includes(qLower) ||
        (loc.city ?? '').toLowerCase().includes(qLower) ||
        (loc.state ?? '').toLowerCase().includes(qLower) ||
        (loc.postal_code ?? '').includes(q)
    )
    setLocationOptions(filteredFromInitial)
    if (q.length < 2) {
      setLocationLoading(false)
      return
    }
    if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current)
    locationDebounceRef.current = setTimeout(() => {
      locationAbortRef.current?.abort()
      const controller = new AbortController()
      locationAbortRef.current = controller
      setLocationLoading(true)
      getLocations(q, { signal: controller.signal })
        .then((list) => {
          if (!controller.signal.aborted) setLocationOptions(list)
        })
        .catch(() => {
          if (!controller.signal.aborted) setLocationOptions(filteredFromInitial)
        })
        .finally(() => {
          if (locationAbortRef.current === controller) {
            locationAbortRef.current = null
            setLocationLoading(false)
          }
          locationDebounceRef.current = null
        })
    }, 400)
    return () => {
      locationAbortRef.current?.abort()
      if (locationDebounceRef.current) clearTimeout(locationDebounceRef.current)
    }
  }, [locationInput])

  // Gym name autocomplete: debounced (400ms), min 2 chars, scoped by current location
  useEffect(() => {
    const q = nameInput.trim()
    if (!q) {
      setNameOptions([])
      setNameLoading(false)
      return
    }
    if (q.length < 2) {
      setNameOptions([])
      setNameLoading(false)
      return
    }
    if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current)
    nameDebounceRef.current = setTimeout(() => {
      const loc = appliedLocation || (defaultLocation ? stringifyLocation(defaultLocation) : '')
      const parsedLoc = parseLocationValue(loc)
      const params = new URLSearchParams({ q })
      if (parsedLoc.city) params.set('city', parsedLoc.city)
      if (parsedLoc.state) params.set('state', parsedLoc.state)
      nameAbortRef.current?.abort()
      const controller = new AbortController()
      nameAbortRef.current = controller
      setNameLoading(true)
      fetch(`/api/gyms/search?${params}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => {
          if (!controller.signal.aborted) setNameOptions(Array.isArray(data) ? data.slice(0, 12) : [])
        })
        .catch(() => {
          if (!controller.signal.aborted) setNameOptions([])
        })
        .finally(() => {
          if (nameAbortRef.current === controller) {
            nameAbortRef.current = null
            setNameLoading(false)
          }
          nameDebounceRef.current = null
        })
    }, 400)
    return () => {
      nameAbortRef.current?.abort()
      if (nameDebounceRef.current) clearTimeout(nameDebounceRef.current)
    }
  }, [nameInput, appliedLocation, defaultLocation])

  // When user clears gym name, apply immediately so list reloads without name filter
  useEffect(() => {
    if (nameInput.trim() === '') setAppliedName('')
  }, [nameInput])

  // Click outside for dropdowns
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setLocationOpen(false)
      if (nameRef.current && !nameRef.current.contains(e.target as Node)) setNameOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Effective location/name for API requests: applied state or default location
  const effectiveLocation = location || (defaultLocation ? stringifyLocation(defaultLocation) : '')
  const parsed = parseLocationValue(effectiveLocation)

  const gymsRequestIdRef = useRef(0)

  // Load gyms and addresses by location; resolve zip-only to city/state so gyms API gets correct params
  useEffect(() => {
    if (!effectiveLocation.trim()) {
      setGyms([])
      setTotalGyms(0)
      setLocationGroups(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const requestId = ++gymsRequestIdRef.current
    const searchQuery = (name ?? '').trim() || undefined
    const hasCityOrState = (parsed.city ?? parsed.state)?.trim()
    const zipOnly = !hasCityOrState && (parsed.postal_code ?? '').trim()

    const runFetch = (city?: string, state?: string) => {
      const promises: [Promise<{ gyms: Gym[]; meta: { total: number } }>, Promise<{ data: GymWithAddressesGroup[] }>] = [
        getPaginatedGyms({
          city: city?.trim() || undefined,
          state: state?.trim() || undefined,
          search: searchQuery,
          page: 1,
          perPage: PER_PAGE_ALL,
        }),
        getAddressesByLocation({
          city: parsed.city,
          postal_code: parsed.postal_code,
        }),
      ]
      Promise.all(promises)
        .then(([gymsRes, locationRes]) => {
          if (requestId !== gymsRequestIdRef.current) return
          setGyms(gymsRes.gyms)
          setTotalGyms(gymsRes.meta.total)
          setLocationGroups(locationRes.data.length > 0 ? locationRes.data : null)
        })
        .catch(() => {
          if (requestId !== gymsRequestIdRef.current) return
          setGyms([])
          setTotalGyms(0)
          setLocationGroups(null)
        })
        .finally(() => {
          if (requestId === gymsRequestIdRef.current) setLoading(false)
        })
    }

    if (zipOnly) {
      getLocations(parsed.postal_code!)
        .then((list) => {
          if (requestId !== gymsRequestIdRef.current) return
          const first = list[0]
          runFetch(first?.city ?? undefined, first?.state ?? undefined)
        })
        .catch(() => {
          if (requestId !== gymsRequestIdRef.current) return
          runFetch(undefined, undefined)
        })
    } else {
      runFetch(parsed.city, parsed.state)
    }
  }, [effectiveLocation, name, parsed.city, parsed.state, parsed.postal_code])

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const locValue = (locationInputRef.current ?? locationInput).toString().trim() || effectiveLocation
    const nameValue = (nameInputRef.current ?? nameInput).toString().trim()
    setAppliedLocation(locValue)
    setAppliedName(nameValue)
    setLocationOpen(false)
    setNameOpen(false)
  }, [effectiveLocation, locationInput, nameInput])

  const handleSelectLocation = useCallback((loc: LocationWithCount) => {
    const value = stringifyLocation(loc)
    setLocationInput(value)
    setAppliedLocation(value)
    setLocationOpen(false)
  }, [])

  const handleSelectName = useCallback((gym: Gym) => {
    nameJustSelectedRef.current = true
    setNameInput(gym.name)
    setAppliedName(gym.name)
    setNameOpen(false)
  }, [])

  /** When firstLocationKey is set (location view), map flies to that address */
  const handleGymSelect = useCallback((gymId: string, firstLocationKey?: string | null) => {
    setSelectedGymId(gymId)
    setSelectedLocationKey(firstLocationKey ?? null)
    const el = listItemRefs.current[gymId]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  const handleLocationSelect = useCallback((gymId: string, addressId: string) => {
    const key = `${gymId}-${addressId}`
    setSelectedLocationKey(key)
    setSelectedGymId(null)
    const el = listItemRefs.current[key]
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  // When user filters by gym name, show gym list (so count matches); otherwise show location groups
  const showLocationView = (locationGroups?.length ?? 0) > 0 && !(name ?? '').trim()

  const firstAddressKey = useCallback((group: GymWithAddressesGroup): string | null => {
    const first = group.addresses.find(
      (a) => a?.latitude != null && a?.longitude != null && Number(a.latitude) !== 0 && Number(a.longitude) !== 0
    ) ?? group.addresses[0]
    return first ? `${group.gym.id}-${first.id}` : null
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      <form
        onSubmit={handleSearch}
        className="flex flex-wrap items-end gap-3 p-4 border-b bg-card rounded-t-lg"
        role="search"
        aria-label="Filter gyms by location and name"
      >
        <div className="flex-1 min-w-[200px]" ref={locationRef}>
          <label htmlFor="gyms-location-input" className="text-xs font-medium text-muted-foreground block mb-1">
            City or Zipcode <span className="text-destructive" aria-hidden>*</span>
          </label>
          <div className="relative">
            <Input
              id="gyms-location-input"
              type="text"
              autoComplete="off"
              placeholder="e.g. Denver, CO or 80202"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value)
                setLocationOpen(true)
              }}
              onFocus={() => setLocationOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setLocationOpen(false)
              }}
              aria-autocomplete="list"
              aria-expanded={locationOpen}
              aria-controls="gyms-location-listbox"
              className="pr-8"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
            {locationOpen && (locationOptions.length > 0 || locationLoading) && (
              <ul
                id="gyms-location-listbox"
                className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {locationLoading && (
                  <li className="px-3 py-2 text-sm text-muted-foreground">Loading…</li>
                )}
                {!locationLoading && locationOptions.map((loc) => (
                  <li
                    key={[loc.city, loc.state, loc.postal_code].filter(Boolean).join('-')}
                    role="option"
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none"
                    onClick={() => handleSelectLocation(loc)}
                  >
                    {loc.label} — {loc.count} gyms
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-[200px]" ref={nameRef}>
          <label htmlFor="gyms-name-input" className="text-xs font-medium text-muted-foreground block mb-1">
            Gym name
          </label>
          <div className="relative">
            <Input
              id="gyms-name-input"
              type="text"
              autoComplete="off"
              placeholder="Optional: filter by gym name"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value)
                setNameOpen(true)
              }}
              onBlur={() => {
                if (nameJustSelectedRef.current) {
                  nameJustSelectedRef.current = false
                  return
                }
                const value = (nameInputRef.current ?? nameInput).toString().trim()
                setAppliedName((prev) => (prev === value ? prev : value))
              }}
              onFocus={() => setNameOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setNameOpen(false)
              }}
              aria-autocomplete="list"
              aria-expanded={nameOpen}
              aria-controls="gyms-name-listbox"
              className="pr-8"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden />
            {nameOpen && (nameOptions.length > 0 || nameLoading) && (
              <ul
                id="gyms-name-listbox"
                className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
                role="listbox"
              >
                {nameLoading && (
                  <li className="px-3 py-2 text-sm text-muted-foreground">Loading…</li>
                )}
                {!nameLoading && nameOptions.map((gym) => (
                  <li
                    key={gym.id}
                    role="option"
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-muted focus:bg-muted focus:outline-none"
                    onClick={() => handleSelectName(gym)}
                  >
                    {gym.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <Button type="submit" className="shrink-0">
          <Search className="h-4 w-4 mr-2" aria-hidden />
          Search
        </Button>
      </form>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 border border-t-0 rounded-b-lg overflow-hidden">
        <div className="flex flex-col min-h-0 border-r bg-background overflow-hidden">
          <div className="p-3 border-b bg-muted/50 font-medium shrink-0">
            {loading
              ? 'Loading…'
              : showLocationView
                ? `${locationGroups?.length ?? 0} gyms in ${parsed.city || effectiveLocation}`
                : `${totalGyms} gyms`}
          </div>
          <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto p-4">
            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            )}
            {!loading && !effectiveLocation && (
              <p className="text-muted-foreground text-sm py-4 text-center">
                Select a city or zipcode to see gyms.
              </p>
            )}
            {!loading && effectiveLocation && !showLocationView && gyms.length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No gyms found. Try a different location or gym name.
              </p>
            )}
            {!loading && showLocationView && locationGroups && (
              <LocationGroupsList
                locationGroups={locationGroups}
                selectedGymId={selectedGymId}
                listItemRefs={listItemRefs}
                scrollContainerRef={scrollContainerRef}
                onGymSelect={handleGymSelect}
                firstAddressKey={firstAddressKey}
              />
            )}
            {!loading && !showLocationView && gyms.length > 0 && (
              <div className="space-y-4">
                {gyms.map((gym) => {
                  const isSelected = selectedGymId !== null && String(gym.id) === String(selectedGymId)
                  return (
                    <div
                      key={gym.id}
                      ref={(el) => { listItemRefs.current[String(gym.id)] = el }}
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
                locationGroups={showLocationView ? locationGroups : null}
                selectedLocationKey={selectedLocationKey}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
