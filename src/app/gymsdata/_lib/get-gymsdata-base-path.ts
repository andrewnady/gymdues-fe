import { headers } from 'next/headers'

/**
 * When the site is served on the gymsdata subdomain (e.g. gymsdata.gymdues.com),
 * returns '' so links can be built without /gymsdata/ (e.g. /california/, /trends/).
 * On the main domain returns '/gymsdata' so links are /gymsdata/california/, etc.
 * Call only from Server Components or route handlers.
 */
export async function getGymsdataBasePath(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  return host.startsWith('gymsdata.') ? '' : '/gymsdata'
}

/**
 * Build the frontend base URL for Stripe success/cancel redirects.
 * Use in Route Handlers (request available). Subdomain: https://gymsdata.gymdues.com.
 * Main domain: https://gymdues.com/gymsdata (so backend can build /gymsdata/checkout/success).
 */
export function getGymsdataFrontendOriginFromRequest(request: Request): string {
  const url = new URL(request.url)
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host
  const proto = (request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')).replace(/\/$/, '')
  const baseUrl = `${proto}://${host}`.replace(/\/$/, '')
  const isSubdomain = host.startsWith('gymsdata.')
  return isSubdomain ? baseUrl : `${baseUrl}/gymsdata`
}
