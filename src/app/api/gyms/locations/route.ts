import { NextRequest, NextResponse } from 'next/server'
import { getLocations } from '@/lib/gyms-api'

/**
 * Proxies gyms/locations for the Advanced filter city autocomplete.
 * Query param: q (optional) – search filter for location label.
 * Returns LocationWithCount[] (same as backend GET /api/v1/gyms/locations).
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')?.trim() || undefined
    const data = await getLocations(q)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json([], { status: 500 })
  }
}
