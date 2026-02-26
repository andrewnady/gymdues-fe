import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

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

  const response = NextResponse.next()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

  // Get the pathname as requested (preserve trailing slash if present)
  const pathname = request.nextUrl.pathname
  
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
     * Note: robots.txt and sitemap.xml are included so we can set headers for them
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\..*).*)',
    '/robots.txt',
    '/sitemap.xml',
  ],
}

