import { NextRequest, NextResponse } from 'next/server'
import { getPaginatedGyms } from '@/lib/gyms-api'

/**
 * Proxies sample gyms for the Advanced filter live preview.
 * Avoids CORS by fetching on the server. Returns { data: gyms[], total: number }.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state')?.trim() || undefined
    const city = searchParams.get('city')?.trim() || undefined

    const { gyms, meta } = await getPaginatedGyms({
      state,
      city,
      page: 1,
      perPage: 5,
    })

    const data = gyms.slice(0, 5).map((g) => ({
      name: g.name,
      slug: g.slug,
      city: g.city,
      state: g.state,
    }))

    return NextResponse.json({ data, total: meta.total })
  } catch (error) {
    console.error('Error fetching sample gyms:', error)
    return NextResponse.json({ data: [], total: 0 }, { status: 500 })
  }
}
