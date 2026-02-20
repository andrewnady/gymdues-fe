'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Gym } from '@/types/gym'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function GymAutocompleteSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Gym[]>([])
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
    try {
      const response = await fetch(`/api/gyms/search?q=${encodeURIComponent(term)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.slice(0, 5)) // Show only first 5 matches
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

  const handleGymClick = () => {
    setShowResults(false)
    setSearchTerm('')
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl p-2 shadow-2xl">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
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
                className="pl-12 h-14 text-base border-0 focus-visible:ring-0 bg-transparent"
              />
            </div>
            {/* <Button
              type="submit"
              size="lg"
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-xl"
            >
              Search
            </Button> */}
          </div>
        </div>
      </form>

      {/* Autocomplete Results */}
      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((gym, index) => (
                <li key={gym.id}>
                  <Link
                    href={`/gyms/${gym.slug}`}
                    onClick={handleGymClick}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{gym.name}</h4>
                    </div>
                  </Link>
                  {index < results.length - 1 && <Separator />}
                </li>
              ))}
            </ul>
          ) : searchTerm.trim() ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No gyms found
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

