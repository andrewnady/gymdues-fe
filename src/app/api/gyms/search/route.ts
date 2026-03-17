import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api-config'

/**
 * Proxies to backend GET /api/v1/gyms/search/
 * Backend expects: q (search term), per_page (optional, default 10, max 20).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || searchParams.get('search') || ''
    const perPage = Math.min(20, Math.max(1, Number(searchParams.get('per_page')) || 10))

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const baseUrl = getApiBaseUrl()
    const url = new URL('/api/v1/gyms/search/', baseUrl)
    url.searchParams.set('q', query.trim())
    url.searchParams.set('per_page', String(perPage))

    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.error('Backend search failed:', response.status, response.statusText)
      return NextResponse.json([])
    }

    const data = await response.json()
    const list = Array.isArray(data) ? data : []
    return NextResponse.json(list)
  } catch (error) {
    console.error('Error searching gyms:', error)
    return NextResponse.json([])
  }
}

