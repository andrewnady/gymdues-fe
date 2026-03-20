'use client'

import { useLayoutEffect, useState } from 'react'
import type { Gym, GymAddress } from '@/types/gym'
import { GymLocationsMap } from '@/components/gym-locations-map'
import { GymAddressSections } from '@/components/gym-address-sections'

function getLocationFromHash(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  const params = new URLSearchParams(hash)
  const location = params.get('location')?.trim()
  return location || null
}

interface GymSlugAddressBlockProps {
  slug: string
  gym: Gym
  initialAddresses: GymAddress[]
}

/**
 * Reads #location= (address id) from the URL hash and passes it to the map and address sections.
 * Keeps in sync with hash changes (e.g. when user selects an address in the map).
 */
export function GymSlugAddressBlock({ slug, gym, initialAddresses }: GymSlugAddressBlockProps) {
  const [addressId, setAddressId] = useState<string | null>(null)

  // Sync from hash on mount and when hash changes (e.g. user clicked an address).
  // If gym has one location, default select it so Subscription/reviews work without manual selection.
  // useLayoutEffect so the selected address is shown on first paint when visiting with #location=.
  useLayoutEffect(() => {
    const fromHash = getLocationFromHash()
    const defaultId =
      fromHash ?? (initialAddresses.length === 1 ? String(initialAddresses[0].id) : null)
    setAddressId(defaultId)
    const handleHashChange = () => {
      const h = getLocationFromHash()
      setAddressId(h ?? (initialAddresses.length === 1 ? String(initialAddresses[0].id) : null))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [initialAddresses])

  return (
    <>
      {((gym.addresses_count ?? 0) > 0 || initialAddresses.length > 0) && (
        <GymLocationsMap
          slug={slug}
          gymId={gym.id}
          currentAddressId={addressId}
          initialAddresses={initialAddresses}
        />
      )}
      <GymAddressSections gym={gym} addressId={addressId} />
    </>
  )
}
