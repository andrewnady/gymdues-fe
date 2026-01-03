import { NextRequest, NextResponse } from 'next/server'
import { getAllGyms } from '@/lib/gyms-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const gyms = await getAllGyms(query.trim())
    
    // Filter and sort results by relevance (name match first, then location)
    const filteredGyms = gyms
      .filter((gym) => {
        const searchLower = query.toLowerCase()
        return (
          gym.name.toLowerCase().includes(searchLower) ||
          gym.city?.toLowerCase().includes(searchLower) ||
          gym.state?.toLowerCase().includes(searchLower) ||
          gym.description?.toLowerCase().includes(searchLower)
        )
      })
      .sort((a, b) => {
        const searchLower = query.toLowerCase()
        const aNameMatch = a.name.toLowerCase().startsWith(searchLower) ? 0 : 1
        const bNameMatch = b.name.toLowerCase().startsWith(searchLower) ? 0 : 1
        if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch
        
        const aNameContains = a.name.toLowerCase().includes(searchLower) ? 0 : 1
        const bNameContains = b.name.toLowerCase().includes(searchLower) ? 0 : 1
        if (aNameContains !== bNameContains) return aNameContains - bNameContains
        
        return (b.rating || 0) - (a.rating || 0)
      })

    return NextResponse.json(filteredGyms)
  } catch (error) {
    console.error('Error searching gyms:', error)
    // Fallback to mock data if API fails
    try {
      const { getAllGyms: getMockGyms } = await import('@/data/mock-gyms')
      const mockGyms = getMockGyms()
      const searchLower = query.toLowerCase()
      
      const filtered = mockGyms
        .filter((gym) => {
          return (
            gym.name.toLowerCase().includes(searchLower) ||
            gym.city?.toLowerCase().includes(searchLower) ||
            gym.state?.toLowerCase().includes(searchLower) ||
            gym.description?.toLowerCase().includes(searchLower)
          )
        })
        .sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().startsWith(searchLower) ? 0 : 1
          const bNameMatch = b.name.toLowerCase().startsWith(searchLower) ? 0 : 1
          if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch
          return (b.rating || 0) - (a.rating || 0)
        })
        .slice(0, 5)
      
      return NextResponse.json(filtered)
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError)
      return NextResponse.json([], { status: 500 })
    }
  }
}

