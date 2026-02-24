'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { getAddressesByGymId } from '@/lib/gyms-api'
import type { GymAddress } from '@/types/gym'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const GymLocationsMapView = dynamic(
  () => import('./gym-locations-map-view').then((m) => m.GymLocationsMapView),
  { ssr: false }
)

/** Fetch all addresses in one request (backend supports up to 100 per_page) */
const PER_PAGE_ALL = 100

interface GymLocationsMapProps {
  slug: string
  gymId: string
  currentAddressId: string | null
  /** Server-prefetched addresses. When provided, skips the initial client-side fetch
   *  so the address list is already visible in the SSR HTML (no-JS fallback). */
  initialAddresses?: GymAddress[]
}

export function GymLocationsMap({ slug, gymId, currentAddressId, initialAddresses }: GymLocationsMapProps) {
  const [data, setData] = useState<GymAddress[]>(initialAddresses ?? [])
  const [loading, setLoading] = useState(!initialAddresses)
  const [error, setError] = useState<string | null>(null)
  const didFetch = useRef(false)

  const fetchAddresses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAddressesByGymId(gymId, { page: 1, per_page: PER_PAGE_ALL })
      setData(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load addresses')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [gymId])

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true
    // Skip fetch when the server already provided the address list
    if (initialAddresses !== undefined) return
    fetchAddresses()
  }, [fetchAddresses, initialAddresses])

  const handleAddressClick = useCallback(
    (addressId: number | string) => {
      if (typeof window === 'undefined') return
      const hash = `#location=${encodeURIComponent(String(addressId))}`
      window.history.replaceState(null, '', `/gyms/${slug}${hash}`)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    },
    [slug]
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Select a location:</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left: scrollable address list (fixed height to match map) */}
          <div className="flex flex-col h-[500px] min-h-[300px] overflow-y-auto overflow-x-hidden pr-1">
            {loading && (
              <p className="text-muted-foreground text-sm">Loading addresses…</p>
            )}
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
            {!loading && !error && data.length === 0 && (
              <p className="text-muted-foreground text-sm">No addresses found.</p>
            )}
            {!loading && !error && data.length > 0 && (
              <ul className="space-y-2 p-2" role="list">
                {data.map((addr) => {
                  const isSelected =
                    currentAddressId != null && String(addr.id) === String(currentAddressId)
                  const label =
                    addr.full_address ||
                    [addr.street, addr.city, addr.state].filter(Boolean).join(', ') ||
                    `Address #${addr.id}`
                  return (
                    <li key={addr.id}>
                      <button
                        type="button"
                        onClick={() => handleAddressClick(addr.id)}
                        className={`w-full text-left rounded-md border p-3 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isSelected ? 'border-primary bg-primary/5' : 'border-border'
                          }`}
                      >
                        <span className="font-medium">{label}</span>
                        {addr.city && addr.state && (
                          <span className="block text-sm text-muted-foreground mt-0.5">
                            {addr.city}, {addr.state}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Right: map (same height as left) */}
          <div className="h-[500px] min-h-[300px] z-0">
            <noscript>
              <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-700 text-sm">
                  Please enable JavaScript rendering in your browser to view the interactive map and full details.
                </p>
              </div>
            </noscript>
            {loading ? (
              <div className="h-full min-h-[300px] flex items-center justify-center bg-muted rounded-md text-muted-foreground">
                Loading map…
              </div>
            ) : (
              <GymLocationsMapView
                addresses={data}
                currentAddressId={currentAddressId}
                onAddressSelect={handleAddressClick}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
