'use client'

import { useLayoutEffect, useState } from 'react'
import type { Gym } from '@/types/gym'
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
}

/**
 * Reads #location= (address id) from the URL hash and passes it to the map and address sections.
 * Keeps in sync with hash changes (e.g. when user selects an address in the map).
 */
export function GymSlugAddressBlock({ slug, gym }: GymSlugAddressBlockProps) {
  const [addressId, setAddressId] = useState<string | null>(null)

  // Sync from hash on mount and when hash changes (e.g. user clicked an address).
  // useLayoutEffect so the selected address is shown on first paint when visiting with #location=.
  useLayoutEffect(() => {
    setAddressId(getLocationFromHash())
    const handleHashChange = () => setAddressId(getLocationFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  return (
    <>
      {(gym.addresses_count ?? 0) > 0 && (
        <GymLocationsMap
          slug={slug}
          gymId={gym.id}
          currentAddressId={addressId}
        />
      )}
      <GymAddressSections gym={gym} addressId={addressId} />
    </>
  )
}
