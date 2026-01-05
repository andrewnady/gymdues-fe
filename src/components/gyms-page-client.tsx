'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPaginatedGyms } from '@/lib/gyms-api'
import { GymCard } from '@/components/gym-card'
import { Button } from '@/components/ui/button'
import { Gym } from '@/types/gym'

// Helper to parse hash parameters
function parseHashParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const hash = window.location.hash.slice(1) // Remove #
  const params: Record<string, string> = {}
  if (hash) {
    hash.split('&').forEach((pair) => {
      const [key, value] = pair.split('=')
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value)
      }
    })
  }
  return params
}

// Helper to build hash string from params
function buildHashString(params: Record<string, string>): string {
  const parts: string[] = []
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  })
  return parts.length > 0 ? `#${parts.join('&')}` : ''
}

export function GymsPageClient() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [totalGyms, setTotalGyms] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [fromIndex, setFromIndex] = useState<number | null>(null)
  const [toIndex, setToIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [trending, setTrending] = useState<boolean | undefined>(undefined)

  const perPage = 12

  // Load gyms based on hash parameters
  const loadGyms = async () => {
    const params = parseHashParams()
    const search = params.search || ''
    const stateParam = params.state || ''
    const cityParam = params.city || ''
    const trendingParam = params.trending === 'true' ? true : params.trending === 'false' ? false : undefined
    const page = params.page ? parseInt(params.page, 10) || 1 : 1

    setSearchTerm(search)
    setState(stateParam)
    setCity(cityParam)
    setTrending(trendingParam)
    setCurrentPage(page)
    setLoading(true)

    try {
      const { gyms: pageGyms, meta } = await getPaginatedGyms({
        search,
        state: stateParam,
        city: cityParam,
        trending: trendingParam,
        page,
        perPage,
      })

      setGyms(pageGyms)
      setTotalGyms(meta.total)
      setTotalPages(meta.last_page || 1)
      setCurrentPage(meta.current_page || page)
      setFromIndex(meta.from)
      setToIndex(meta.to)
    } catch (error) {
      console.error('Failed to load gyms:', error)
      setGyms([])
      setTotalGyms(0)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadGyms()
  }, [])

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      loadGyms()
    }

    window.addEventListener('hashchange', handleHashChange)
    // Also listen for custom hashchange event from search input
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Build page URL with hash
  const buildPageUrl = (page: number) => {
    const params: Record<string, string> = {}

    if (searchTerm) {
      params.search = searchTerm
    }
    if (state) {
      params.state = state
    }
    if (city) {
      params.city = city
    }
    if (typeof trending === 'boolean') {
      params.trending = trending.toString()
    }
    if (page > 1) {
      params.page = page.toString()
    }

    const hashString = buildHashString(params)
    return `/gyms${hashString}`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <>
      {gyms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>
      )}

      {totalGyms === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? `No gyms found matching "${searchTerm}". Try adjusting your search.`
              : 'No gyms found. Try adjusting your search.'}
          </p>
        </div>
      )}

      {totalGyms > 0 && totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium">
              {fromIndex ?? (currentPage - 1) * perPage + 1}
            </span>
            {'–'}
            <span className="font-medium">
              {toIndex ?? Math.min(currentPage * perPage, totalGyms)}
            </span>{' '}
            of{' '}
            <span className="font-medium">{totalGyms}</span> gyms
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              asChild
            >
              <Link href={buildPageUrl(currentPage - 1)}>Previous</Link>
            </Button>

            <span className="text-sm text-muted-foreground">
              Page <span className="font-medium">{currentPage}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              asChild
            >
              <Link href={buildPageUrl(currentPage + 1)}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

