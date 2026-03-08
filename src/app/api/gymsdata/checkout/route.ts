import { NextResponse } from 'next/server'
import { submitCheckout } from '@/lib/gymsdata-api'

/**
 * POST /api/gymsdata/checkout
 * Body (JSON): name, email; optional state, city, type.
 * Proxies to backend POST /api/v1/gymsdata/checkout. Returns { url: stripeSessionUrl }.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.name !== 'string' || typeof body.email !== 'string') {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    const name = String(body.name).trim()
    const email = String(body.email).trim()
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }
    const state = typeof body.state === 'string' ? body.state.trim() || undefined : undefined
    const city = typeof body.city === 'string' ? body.city.trim() || undefined : undefined
    const type = typeof body.type === 'string' ? body.type.trim() || undefined : undefined

    const { url } = await submitCheckout(name, email, { state, city, type })
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
