'use client'

import { useCallback, useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getPaginatedGyms, getAddressesByLocation, getLocations } from '@/lib/gyms-api'
import type { Gym, GymWithAddressesGroup, LocationWithCount } from '@/types/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GymCard } from '@/components/gym-card'
import { Search } from 'lucide-react'

const GymsDiscoveryMap = dynamic(
  () => import('./gyms-discovery-map').then((m) => m.GymsDiscoveryMap),
  { ssr: false }
)

const PER_PAGE_ALL = 500

/**
 * Parse location value (e.g. "Denver, CO 80202" or "Denver, CO") into { city?, state?, postal_code? }.
 * Format: "City, State Zipcode" — zip is last token if all digits; otherwise "City, State" only.
 */
function parseLocationValue(value: string): { city?: string; state?: string; postal_code?: string } {
  const v = value?.trim() ?? ''
  if (!v) return {}
  if (/^\d+$/.test(v)) return { postal_code: v }
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

function parseHash(): { location: string; name: string } {
  if (typeof window === 'undefined') return { location: '', name: '' }
  const hash = window.location.hash.slice(1)
  const params = new URLSearchParams(hash)
  return {
    location: params.get('location')?.trim() || '',
    name: params.get('name')?.trim() || '',
  }
}

function buildHash(params: { location?: string; name?: string }): string {
  const current = parseHash()
  const location = params.location !== undefined ? params.location : current.location
  const name = params.name !== undefined ? params.name : current.name
  const p = new URLSearchParams()
  if (location) p.set('location', location)
  if (name) p.set('name', name)
  const s = p.toString()
  return s ? `#${s}` : ''
}

export function GymsMapPageClient() {
  const [hashParams, setHashParams] = useState({ location: '', name: '' })
  const [defaultLocation, setDefaultLocation] = useState<LocationWithCount | null>(null)
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
  const [nameOpen, setNameOpen] = useState(false)
  const [nameLoading, setNameLoading] = useState(false)
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null)
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null)
  const listItemRefs = useRef<Record<string, HTMLElement | null>>({})
  const locationRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const locationDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const location = hashParams.location
  const name = hashParams.name

  const updateUrl = useCallback((updates: { location?: string; name?: string }) => {
    const newHash = buildHash(updates)
    window.history.replaceState(null, '', `/gyms${newHash}`)
    setHashParams(parseHash())
  }, [])

  // Load default location (first = most gyms) when no location in URL
  useEffect(() => {
    getLocations()
      .then((list) => {
        if (list.length > 0) {
          setDefaultLocation(list[0])
          const current = parseHash()
          if (!current.location) {
            const value = stringifyLocation(list[0])
            updateUrl({ location: value, name: current.name })
            setLocationInput(value)
          }
        }
      })
      .catch(() => {})
  }, [updateUrl])

  // Sync inputs from hash
  useEffect(() => {
    const p = parseHash()
    setLocationInput(p.location)
    setNameInput(p.name)
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      setHashParams(parseHash())
      const p = parseHash()
      setLocationInput(p.location)
      setNameInput(p.name)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Location autocomplete (with empty query = top locations when open)
  useEffect(() => {
    if (locationDebounce.current) clearTimeout(locationDebounce.current)
    const q = locationInput.trim()
    setLocationLoading(true)
    locationDebounce.current = setTimeout(() => {
      getLocations(q || undefined)
        .then(setLocationOptions)
        .finally(() => {
          setLocationLoading(false)
          locationDebounce.current = null
        })
    }, q ? 250 : 0)
    return () => {
      if (locationDebounce.current) clearTimeout(locationDebounce.current)
    }
  }, [locationInput])

  // Name autocomplete (gym name search)
  useEffect(() => {
    if (nameDebounce.current) clearTimeout(nameDebounce.current)
    const q = nameInput.trim()
    if (!q) {
      setNameOptions([])
      setNameLoading(false)
      return
    }
    setNameLoading(true)
    nameDebounce.current = setTimeout(() => {
      fetch(`/api/gyms/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((data) => setNameOptions(Array.isArray(data) ? data.slice(0, 8) : []))
        .catch(() => setNameOptions([]))
        .finally(() => {
          setNameLoading(false)
          nameDebounce.current = null
        })
    }, 250)
    return () => {
      if (nameDebounce.current) clearTimeout(nameDebounce.current)
    }
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

  // Resolve effective location: from hash or default
  const effectiveLocation = location || (defaultLocation ? stringifyLocation(defaultLocation) : '')
  const parsed = parseLocationValue(effectiveLocation)

  // Load gyms and addresses by location
  useEffect(() => {
    if (!effectiveLocation.trim()) {
      setGyms([])
      setTotalGyms(0)
      setLocationGroups(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const promises: [Promise<{ gyms: Gym[]; meta: { total: number } }>, Promise<{ data: GymWithAddressesGroup[] }>] = [
      getPaginatedGyms({
        city: parsed.city,
        state: parsed.state,
        search: name?.trim() || undefined,
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
        setGyms(gymsRes.gyms)
        setTotalGyms(gymsRes.meta.total)
        setLocationGroups(locationRes.data.length > 0 ? locationRes.data : null)
      })
      .catch(() => {
        setGyms([])
        setTotalGyms(0)
        setLocationGroups(null)
      })
      .finally(() => setLoading(false))
  }, [effectiveLocation, name, parsed.city, parsed.state, parsed.postal_code])

  const handleSearch = useCallback(() => {
    const locValue = locationInput.trim() || effectiveLocation
    updateUrl({
      location: locValue,
      name: nameInput.trim() || undefined,
    })
    setLocationOpen(false)
    setNameOpen(false)
  }, [locationInput, nameInput, effectiveLocation, updateUrl])

  const handleSelectLocation = useCallback(
    (loc: LocationWithCount) => {
      const value = stringifyLocation(loc)
      setLocationInput(value)
      updateUrl({ location: value, name: hashParams.name })
      setLocationOpen(false)
    },
    [updateUrl, hashParams.name]
  )

  const handleSelectName = useCallback(
    (gym: Gym) => {
      setNameInput(gym.name)
      updateUrl({ location: hashParams.location, name: gym.name })
      setNameOpen(false)
    },
    [updateUrl, hashParams.location]
  )

  const handleGymSelect = useCallback((gymId: string) => {
    setSelectedGymId(gymId)
    setSelectedLocationKey(null)
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

  const totalLocations = locationGroups?.reduce((n, g) => n + g.addresses.length, 0) ?? 0
  const showLocationView = (locationGroups?.length ?? 0) > 0

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] min-h-[500px]">
      <div className="flex flex-wrap items-end gap-3 p-4 border-b bg-card rounded-t-lg">
        <div className="flex-1 min-w-[200px]" ref={locationRef}>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            City or Zipcode <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              placeholder="e.g. Denver, CO or 80202"
              value={locationInput}
              onChange={(e) => {
                setLocationInput(e.target.value)
                setLocationOpen(true)
              }}
              onFocus={() => setLocationOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
                if (e.key === 'Escape') setLocationOpen(false)
              }}
              aria-autocomplete="list"
              aria-expanded={locationOpen}
              className="pr-8"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            {locationOpen && (locationOptions.length > 0 || locationLoading) && (
              <ul
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
          <label className="text-xs font-medium text-muted-foreground block mb-1">Gym name</label>
          <div className="relative">
            <Input
              placeholder="Optional: filter by gym name"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value)
                setNameOpen(true)
              }}
              onFocus={() => setNameOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
                if (e.key === 'Escape') setNameOpen(false)
              }}
              aria-autocomplete="list"
              aria-expanded={nameOpen}
              className="pr-8"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            {nameOpen && (nameOptions.length > 0 || nameLoading) && (
              <ul
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
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 min-h-0 border border-t-0 rounded-b-lg overflow-hidden">
        <div className="flex flex-col min-h-0 border-r bg-background overflow-hidden">
          <div className="p-3 border-b bg-muted/50 font-medium shrink-0">
            {loading
              ? 'Loading…'
              : showLocationView
                ? `${totalLocations} location${totalLocations !== 1 ? 's' : ''} in area`
                : `${totalGyms} gyms`}
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
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
              <div className="space-y-6">
                {locationGroups.map((group) => (
                  <div key={group.gym.id}>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">{group.gym.name}</h3>
                    <ul className="space-y-2">
                      {group.addresses.map((addr) => {
                        const key = `${group.gym.id}-${addr.id}`
                        const isSelected = selectedLocationKey === key
                        const label =
                          addr.full_address ||
                          [addr.street, addr.city, addr.state].filter(Boolean).join(', ') ||
                          `Location #${addr.id}`
                        return (
                          <li
                            key={key}
                            ref={(el) => { listItemRefs.current[key] = el }}
                          >
                            <Link
                              href={`/gyms/${group.gym.slug}?address_id=${addr.id}`}
                              className={`block rounded-md border p-3 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-border'}`}
                              onClick={() => handleLocationSelect(String(group.gym.id), String(addr.id))}
                            >
                              <span className="font-medium text-sm">{label}</span>
                              {addr.city && addr.state && (
                                <span className="block text-xs text-muted-foreground mt-0.5">
                                  {addr.city}, {addr.state}
                                  {addr.postal_code ? ` ${addr.postal_code}` : ''}
                                </span>
                              )}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
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
