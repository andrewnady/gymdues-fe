import { headers } from 'next/headers'

const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

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
 * Origin (protocol + host) to use for canonical and Open Graph URLs.
 * On subdomain (gymsdata.*) returns that origin (e.g. https://gymsdata.gymdues.com).
 * On main domain returns DEFAULT_SITE_URL (e.g. https://gymdues.com).
 */
export async function getGymsdataCanonicalOrigin(): Promise<string> {
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  const scheme = proto.replace(/\/$/, '') || 'https'
  if (host.startsWith('gymsdata.')) {
    return `${scheme}://${host}`.replace(/\/$/, '')
  }
  return DEFAULT_SITE_URL.replace(/\/$/, '')
}

/**
 * Full canonical URL for a gymsdata page. Use in generateMetadata alternates and openGraph.url.
 * @param pathSegments - optional path after base, e.g. '' for root, 'california' for state, 'california/san-diego' for city
 */
export async function getGymsdataCanonicalUrl(pathSegments = ''): Promise<string> {
  const [basePath, origin] = await Promise.all([getGymsdataBasePath(), getGymsdataCanonicalOrigin()])
  const base = basePath ? `${basePath}/` : '/'
  const path = pathSegments ? `${pathSegments}/` : ''
  return `${origin}${base}${path}`
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
