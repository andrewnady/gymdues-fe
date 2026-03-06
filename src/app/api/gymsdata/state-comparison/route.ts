import { NextResponse } from 'next/server'
import { getStateComparison } from '@/lib/gymsdata-api'

/**
 * GET /api/gymsdata/state-comparison
 * GET /api/gymsdata/state-comparison?states=CA,TX,FL
 * Proxies to backend api/v1/gymsdata/state-comparison.
 * No query = return all states for client-side comparison.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const states = searchParams.get('states')?.trim() || undefined
    const data = await getStateComparison(states)
    if (!data) {
      return NextResponse.json({ states: [] })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error('State comparison API error:', error)
    return NextResponse.json(
      { error: 'Failed to load state comparison' },
      { status: 500 }
    )
  }
}
