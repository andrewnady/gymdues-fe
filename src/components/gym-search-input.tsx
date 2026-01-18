'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

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

export function GymSearchInput() {
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize from hash on mount
  useEffect(() => {
    const params = parseHashParams()
    setSearchTerm(params.search || '')
  }, [])

  // Update URL hash with search parameter
  const updateSearch = useDebouncedCallback((value: string) => {
    const params = parseHashParams()
    const previousSearch = params.search || ''
    const newSearch = value.trim()
    
    if (newSearch) {
      params.search = newSearch
      // Always reset to page 1 when search changes (different from previous)
      if (previousSearch !== newSearch) {
        delete params.page
      }
    } else {
      delete params.search
      // Reset page when clearing search
      delete params.page
    }

    const hashString = buildHashString(params)
    // Update hash without page reload
    window.history.replaceState(null, '', `/gyms${hashString}`)
    
    // Trigger a custom event to notify the page component
    window.dispatchEvent(new Event('hashchange'))
  }, 300)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateSearch(value)
  }

  // Sync with hash changes (e.g., browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const params = parseHashParams()
      setSearchTerm(params.search || '')
    }

    // Listen to both native hashchange and custom hashchange events
    window.addEventListener('hashchange', handleHashChange)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search gyms..."
        className="pl-10"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  )
}

