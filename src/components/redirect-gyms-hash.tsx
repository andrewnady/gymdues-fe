'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

/**
 * If user is on home (/) with a hash that contains gyms map params (location or name),
 * redirect to /gyms with the same hash so they see the browse gyms page, not home.
 */
export function RedirectGymsHash() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/' || typeof window === 'undefined') return
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const params = new URLSearchParams(hash)
    const hasLocation = params.has('location')
    const hasName = params.has('name')
    if (hasLocation || hasName) {
      router.replace(`/gyms#${hash}`)
    }
  }, [pathname, router])

  return null
}
