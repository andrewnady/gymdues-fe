'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'

export function GymSearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  // Update URL with search parameter (preserves other params like state, city, trending)
  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.trim()) {
      params.set('search', value.trim())
    } else {
      params.delete('search')
    }
    router.push(`/gyms?${params.toString()}`)
  }, 300)

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateSearch(value)
  }

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const search = searchParams.get('search') || ''
    setSearchTerm(search)
  }, [searchParams])

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

