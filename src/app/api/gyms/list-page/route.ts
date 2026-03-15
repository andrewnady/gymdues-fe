import { NextResponse } from 'next/server'
import { getListPageData } from '@/lib/gyms-api'

/**
 * Returns list-page data (states + locations) from the backend API.
 * Uses /api/v1/gyms/*.
 *
 * Response shape:
 * {
 *   states: { state: string, stateName: string, count: number }[],
 *   locations: { label: string, city: string | null, state: string | null, postal_code: string | null, count: number }[]
 * }
 */
export async function GET() {
  try {
    const data = await getListPageData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('List page API error:', error)
    return NextResponse.json(
      { error: 'Failed to load list page data' },
      { status: 500 }
    )
  }
}
