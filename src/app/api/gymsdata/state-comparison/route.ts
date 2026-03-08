import { NextResponse } from 'next/server'
import { getStateComparison } from '@/lib/gymsdata-api'

const STATE_COMPARISON_TIMEOUT_MS = 15_000

/**
 * GET /api/gymsdata/state-comparison
 * GET /api/gymsdata/state-comparison?states=CA,TX,FL
 * Proxies to backend api/v1/gymsdata/state-comparison.
 * No query = return all states for client-side comparison.
 * Times out after 15s to avoid indefinite loading.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const states = searchParams.get('states')?.trim() || undefined

    const data = await Promise.race([
      getStateComparison(states),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('State comparison request timed out')), STATE_COMPARISON_TIMEOUT_MS)
      ),
    ])

    if (!data) {
      return NextResponse.json({ states: [] })
    }
    return NextResponse.json(data)
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes('timed out')
    if (isTimeout) {
      return NextResponse.json(
        { error: 'Request timed out', states: [] },
        { status: 504 }
      )
    }
    console.error('State comparison API error:', error)
    return NextResponse.json(
      { error: 'Failed to load state comparison', states: [] },
      { status: 500 }
    )
  }
}
