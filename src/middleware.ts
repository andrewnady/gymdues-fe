import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Redirect to the bare homepage, stripping ALL query params and path segments. */
function redirectHome(request: NextRequest): NextResponse {
  // request.nextUrl.origin = 'https://gymdues.com' (scheme + host only, no path/query)
  return NextResponse.redirect(`${request.nextUrl.origin}/`, { status: 301 })
}

/** Resolve host (use X-Forwarded-Host when behind a proxy so subdomain rewrite works). */
function getHost(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-host')
  if (forwarded) return forwarded.split(',')[0]?.trim() || ''
  return request.headers.get('host') || ''
}

/** True when request is for gymsdata subdomain (Host, X-Forwarded-Host, or request URL host). */
function isGymsdataSubdomain(request: NextRequest): boolean {
  const host = getHost(request)
  if (host.startsWith('gymsdata.')) return true
  const urlHost = request.nextUrl.hostname
  return urlHost.startsWith('gymsdata.')
}

export function middleware(request: NextRequest) {
  const hostname = getHost(request)

  // Route bestgyms subdomain to /best-gyms/* pages
  if (hostname.startsWith('bestgyms.')) {
    const url = request.nextUrl.clone()
    const path = url.pathname
    const bestGymsUrl = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'

    // Serve sitemap index for bestgyms subdomain
    if (path === '/sitemap.xml' || path === '/sitemap.xml/') {
      url.pathname = '/api/sitemap-best-gyms-index'
      return NextResponse.rewrite(url)
    }

    // Skip static files, Next.js internals, and API routes
    if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
      return NextResponse.next()
    }

    // // Redirect trailing slashes to canonical (no trailing slash), except root
    // if (path !== '/' && path.endsWith('/')) {
    //   const canonicalPath = path.replace(/\/$/, '')
    //   return NextResponse.redirect(new URL(`${bestGymsUrl}${canonicalPath}`), 301)
    // }

    // Root → /best-gyms browse page
    if (path === '/') {
      url.pathname = '/best-gyms'
      const canonicalUrl = `${bestGymsUrl}/`
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-pathname', '/')
      const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
      return response
    }

    // /best-{city}-gyms → /best-gyms/{city}
    // e.g. /best-houston-gyms → /best-gyms/houston
    const cityMatch = path.match(/^\/best-(.+)-gyms?\/?$/)
    if (cityMatch) {
      url.pathname = `/best-gyms/${cityMatch[1]}`
      const canonicalPath = path.replace(/\/$/, '')
      const canonicalUrl = `${bestGymsUrl}${canonicalPath}/`
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-pathname', canonicalPath)
      const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
      return response
    }

    // No pattern matched on the bestgyms subdomain — redirect to the base URL
    return NextResponse.redirect(new URL(bestGymsUrl), { status: 301 })
  }

  // Route gymsdata subdomain to /gymsdata/* pages (use isGymsdataSubdomain so request URL host is used when Host header is stripped by proxy)
  if (isGymsdataSubdomain(request)) {
    const url = request.nextUrl.clone()
    const path = url.pathname
    const gymsDataUrl = process.env.NEXT_PUBLIC_GYMSDATA_BASE_URL || 'https://gymsdata.gymdues.com'

    // Serve sitemap index for gymsdata subdomain
    if (path === '/sitemap.xml' || path === '/sitemap.xml/') {
      url.pathname = '/api/sitemap-gymsdata-index'
      return NextResponse.rewrite(url)
    }

    // Skip static files, Next.js internals, and API routes
    if (path.startsWith('/_next') || path.startsWith('/api') || path.includes('.')) {
      return NextResponse.next()
    }

    // // Redirect trailing slashes to canonical (no trailing slash), except root
    // if (path !== '/' && path.endsWith('/')) {
    //   const canonicalPath = path.replace(/\/$/, '')
    //   return NextResponse.redirect(new URL(`${bestGymsUrl}${canonicalPath}`), 301)
    // }

    // On subdomain: canonical URLs must NOT include /gymsdata (e.g. /california/ not /gymsdata/california/)
    // Redirect /gymsdata and /gymsdata/* to clean path so production never shows /gymsdata/ in the URL
    if (path === '/gymsdata' || path === '/gymsdata/' || path.startsWith('/gymsdata/')) {
      const cleanPath = path.replace(/^\/gymsdata\/?/, '/') || '/'
      const pathWithSlash = cleanPath === '/' || cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`
      const redirectUrl = new URL(pathWithSlash + url.search, gymsDataUrl)
      return NextResponse.redirect(redirectUrl, 301)
    }

    // Root → /gymsdata (dataset list page); use trailing slash to match next.config trailingSlash
    if (path === '/' || path === '') {
      url.pathname = '/gymsdata/'
      const canonicalUrl = `${gymsDataUrl}/`
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-pathname', '/')
      const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
      response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
      return response
    }

    // Any other path on subdomain (e.g. /california/, /california/los-angeles/, /types/fitness-centers/)
    // → rewrite to /gymsdata/* so the app serves the right page; URL stays clean (no /gymsdata in browser)
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`
    url.pathname = `/gymsdata${pathWithSlash}`
    const canonicalUrl = `${gymsDataUrl}${pathWithSlash}`
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathWithSlash)
    const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } })
    response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
    return response
  }

  // ── Bulk 404 redirect rules ──────────────────────────────────────────────
  // Skip for gymsdata subdomain so state/city/type paths are never sent home
  // (they are handled above via rewrite when isGymsdataSubdomain is true).
  if (isGymsdataSubdomain(request)) {
    return NextResponse.next()
  }

  // All redirects use redirectHome(request) which builds the destination from
  // request.nextUrl.origin (scheme+host only) so query params are always stripped.
  const pathname = request.nextUrl.pathname

  // Pattern 0a: legacy path prefixes from previous site platforms
  // e.g. /item/u185/26807/, /webapp/wcs/stores/…, /b/Bath/N-5yc1vZbzb3
  const legacyPrefixes = [
    '/item/', '/webapp/', '/shop/',
    '/b/', '/c/', '/category/', '/contents/',
  ]
  if (legacyPrefixes.some(p => pathname.startsWith(p))) {
    return redirectHome(request)
  }

  // Pattern 0b: legacy files added explicitly to the matcher
  // e.g. /pages.php?stove201025810.html, /index.html
  if (pathname === '/pages.php' || pathname === '/index.html') {
    return redirectHome(request)
  }

  // Pattern 0c: Apple app site association file (not served)
  if (pathname === '/apple-app-site-association') {
    return redirectHome(request)
  }

  // Pattern 0d: WordPress RSS/Atom feed URLs
  // e.g. /feed/, /comments/feed/, /pure-barre-membership-cost/feed/
  if (
    pathname === '/feed' || pathname === '/feed/' ||
    pathname === '/comments/feed' || pathname === '/comments/feed/' ||
    pathname.endsWith('/feed') || pathname.endsWith('/feed/')
  ) {
    return redirectHome(request)
  }

  // Pattern 1: paths whose first segment is a 6+ digit number
  // e.g. /586536/60-Gift-Ideas-…, /522102/EAGLES-Cupcake-Rings-…
  if (/^\/\d{6,}(\/|$)/.test(pathname)) {
    return redirectHome(request)
  }

  // Pattern 2: single-segment word+number slugs (external/spam link artifacts)
  // e.g. /isolation153, /duck93, /soon71, /penalty11?kg=32272
  // Excludes real site routes: /gyms/, /best-gyms/, /blog/, /best-*, etc.
  const realRoutePrefixes = [
    '/gyms/', '/best-gyms/', '/blog/', '/best-',
    '/about', '/contact', '/privacy-policy', '/terms-of-service',
  ]
  if (
    /^\/[a-zA-Z][a-zA-Z0-9-]*\d+\/?$/.test(pathname) &&
    !realRoutePrefixes.some(prefix => pathname.startsWith(prefix))
  ) {
    return redirectHome(request)
  }

  // Pattern 3: homepage with external tracking query params that cause
  // duplicate-URL coverage issues (e.g. /?_g=463728, /?k=217…&channel=…)
  if (pathname === '/') {
    const sp = request.nextUrl.searchParams
    if (sp.has('_g') || sp.has('k')) {
      return redirectHome(request)
    }
  }
  // ── End bulk 404 redirect rules ──────────────────────────────────────────

  const response = NextResponse.next()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

  // Get the pathname as requested (preserve trailing slash if present)
  
  // Build canonical URL to match the exact requested URL
  // Use the pathname as-is to preserve trailing slashes
  let canonicalUrl = `${siteUrl}${pathname}`
  
  // Only normalize root path (ensure it's just /)
  if (pathname === '/') {
    canonicalUrl = `${siteUrl}/`
  }
  
  // Add pathname to headers so generateMetadata can access it
  response.headers.set('x-pathname', pathname)
  
  // Add canonical HTTP header - matches the current requested URL
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)
  
  // Add X-Robots-Tag header
  // Special case for robots.txt - should be noindex
  if (pathname === '/robots.txt') {
    response.headers.set('X-Robots-Tag', 'noindex')
  } else {
    // For all other pages, set index, follow with max preview settings
    response.headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, fonts, etc. (static assets)
     * Note: robots.txt and sitemap.xml are included so we can set headers for them.
     * /pages.php and /index.html are listed explicitly because the wildcard
     * regex above skips paths that contain a file extension dot.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\..*).*)',
    '/robots.txt',
    '/sitemap.xml',
    '/pages.php',
    '/index.html',
  ],
}

