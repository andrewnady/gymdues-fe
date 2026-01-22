import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
  
  // Get the pathname
  const pathname = request.nextUrl.pathname
  
  // Build canonical URL
  // For dynamic routes (gyms/[slug], blog/[slug]), remove trailing slash
  // For static routes, ensure trailing slash (except root)
  let canonicalUrl = `${siteUrl}${pathname}`
  
  // Check if it's a dynamic route (gyms/[slug] or blog/[slug])
  const isDynamicRoute = pathname.match(/^\/(gyms|blog)\/[^/]+/)
  
  if (pathname === '/') {
    // Root path - no trailing slash
    canonicalUrl = `${siteUrl}/`
  } else if (isDynamicRoute) {
    // Dynamic route - remove trailing slash if present
    canonicalUrl = `${siteUrl}${pathname.replace(/\/$/, '')}`
  } else {
    // Static route - ensure trailing slash
    canonicalUrl = `${siteUrl}${pathname.endsWith('/') ? pathname : `${pathname}/`}`
  }
  
  // Add canonical HTTP header
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

