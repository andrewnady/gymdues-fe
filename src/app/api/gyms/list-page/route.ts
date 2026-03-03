import { NextResponse } from 'next/server'
import { getMockListPageData } from '@/usa-list/data/mock-list-page-data'

/**
 * Returns list-page data (states + locations) for the gymsdata page.
 * Uses mock data until your backend provides an equivalent endpoint.
 *
 * Response shape:
 * {
 *   states: { state: string, stateName: string, count: number }[],
 *   locations: { label: string, city: string | null, state: string | null, postal_code: string | null, count: number }[]
 * }
 *
 * You can copy this mock response to your API or point the frontend to your endpoint
 * and return the same JSON shape.
 */
export async function GET() {
  try {
    const data = getMockListPageData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('List page API error:', error)
    return NextResponse.json(
      { error: 'Failed to load list page data' },
      { status: 500 }
    )
  }
}
