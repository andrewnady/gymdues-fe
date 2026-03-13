import { NextResponse } from 'next/server'
import { submitCheckout } from '@/lib/gymsdata-api'
import { getGymsdataFrontendOriginFromRequest } from '@/app/gymsdata/_lib/get-gymsdata-base-path'

/**
 * POST /api/gymsdata/checkout
 * Body (JSON): name, email; optional state, city, type.
 * Proxies to backend POST /api/v1/gymsdata/checkout. Sends frontend_origin so backend
 * can set Stripe success_url and cancel_url (subdomain vs main domain).
 * Returns { url: stripeSessionUrl }.
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
    const frontendOrigin = getGymsdataFrontendOriginFromRequest(request)

    const { url } = await submitCheckout(name, email, { state, city, type }, frontendOrigin)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
