'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { GymSearchResult } from '@/types/gym'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const sizeClasses = {
  sm: {
    wrapper: 'p-1.5 rounded-xl',
    input: 'pl-10 h-10 text-sm',
    icon: 'left-3 h-4 w-4',
  },
  md: {
    wrapper: 'p-2 rounded-2xl',
    input: 'pl-12 h-12 md:h-14 text-sm md:text-base',
    icon: 'left-4 h-5 w-5',
  },
  lg: {
    wrapper: 'p-2.5 rounded-2xl',
    input: 'pl-14 h-14 md:h-16 text-base md:text-lg',
    icon: 'left-5 h-6 w-6',
  },
} as const

export type GymAutocompleteSearchSize = keyof typeof sizeClasses

interface GymAutocompleteSearchProps {
  size?: GymAutocompleteSearchSize
  className?: string
  /** When set, clicking a result calls this instead of navigating (e.g. show card and activate button). */
  onSelectGym?: (gym: GymSearchResult) => void
}

export function GymAutocompleteSearch({ size = 'md', className, onSelectGym }: GymAutocompleteSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<GymSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      setIsLoading(false)
      setShowResults(false)
      return
    }

    setIsLoading(true)
    setShowResults(true)
    try {
      const response = await fetch(
        `/api/gyms/search?q=${encodeURIComponent(term)}&per_page=10`
      )
      if (response.ok) {
        const data = await response.json()
        setResults(Array.isArray(data) ? data : [])
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error('Error searching gyms:', error)
      setResults([])
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      performSearch(searchTerm)
    }, 300)

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm, performSearch])

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/gyms?search=${encodeURIComponent(searchTerm)}`)
      setShowResults(false)
    }
  }

  const handleGymClick = (e: React.MouseEvent, gym: GymSearchResult) => {
    if (onSelectGym) {
      e.preventDefault()
      onSelectGym(gym)
    }
    setShowResults(false)
    setSearchTerm('')
  }

  const styles = sizeClasses[size]

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit}>
        <div className={cn('border border-border/70 bg-card/95 shadow-lg shadow-primary/5 transition-shadow focus-within:shadow-xl', styles.wrapper)}>
          <div className="flex gap-2 items-stretch">
            <div className="relative flex-1 min-w-0">
              <Search className={cn('absolute top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none', styles.icon)} />
              <Input
                type="text"
                placeholder="Search for gyms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (results.length > 0) {
                    setShowResults(true)
                  }
                }}
                className={cn('border-0 bg-transparent focus-visible:ring-0 focus-visible:outline-none', styles.input)}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Autocomplete Results */}
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/70 bg-card/98 shadow-xl shadow-primary/10 overflow-hidden z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
          {isLoading && (
            <div className="sticky top-0 z-10 bg-card/98">
              <div className="h-1 w-full overflow-hidden bg-muted/50 rounded-t-xl">
                <div className="h-full w-2/5 min-w-[6rem] animate-[loading-bar_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
              </div>
              <p className="px-4 py-3 text-sm text-muted-foreground">Searching gyms…</p>
            </div>
          )}
          {!isLoading && results.length > 0 ? (
            <ul className="py-2">
              {results.map((gym, index) => (
                <li key={gym.id}>
                  <Link
                    href={`/gyms/${gym.slug}`}
                    onClick={(e) => handleGymClick(e, gym)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-inset"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{gym.name}</h4>
                      {(gym.city || gym.state) && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {[gym.city, gym.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </Link>
                  {index < results.length - 1 && <Separator />}
                </li>
              ))}
            </ul>
          ) : null}
          {!isLoading && searchTerm.trim() && results.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No gyms found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

