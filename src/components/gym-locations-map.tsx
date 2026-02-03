'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
}

export function GymLocationsMap({ slug, gymId, currentAddressId }: GymLocationsMapProps) {
  const router = useRouter()
  const [data, setData] = useState<GymAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    fetchAddresses()
  }, [fetchAddresses])

  const handleAddressClick = useCallback(
    (addressId: number | string) => {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      params.set('address_id', String(addressId))
      router.replace(`/gyms/${slug}?${params.toString()}`, { scroll: false })
    },
    [router, slug]
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
