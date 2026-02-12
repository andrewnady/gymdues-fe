/**
 * API Configuration Helper
 * Handles different API URLs for server-side (Docker) vs client-side (browser) calls
 */

/**
 * Gets the API base URL based on the environment
 * - Server-side (Docker): use API_BASE_URL when set (e.g. http://nginx:80)
 * - Server-side (local/cPanel): when API_BASE_URL is not set, use public URL so fetches work
 * - Client-side (browser): uses cms.gymdues.com in dev, localhost:8080 otherwise
 */
export function getApiBaseUrl(): string {
  const isDev = process.env.NODE_ENV === 'development'

  // Check if we're on the server side (Node.js environment)
  if (typeof window === 'undefined') {
    // Server-side: prefer API_BASE_URL when set (Docker internal URL)
    if (process.env.API_BASE_URL) {
      return process.env.API_BASE_URL
    }
    // When not in Docker (e.g. local dev or cPanel), server must use a reachable URL
    if (isDev && !process.env.NEXT_PUBLIC_API_BASE_URL) {
      return 'https://cms.gymdues.com'
    }
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
  }

  // Client-side: use public URL that browser can access
  if (isDev && !process.env.NEXT_PUBLIC_API_BASE_URL) {
    return 'https://cms.gymdues.com'
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
}

/**
 * Gets the public image URL base for transforming URLs
 * In development, use cms.gymdues.com for images
 */
function getPublicImageUrl(): string {
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) {
    return 'https://cms.gymdues.com'
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
}

/**
 * Transforms URLs in API responses to replace Docker internal hostnames with public URLs
 * This fixes issues where Winter CMS generates URLs with 'nginx' hostname
 * In development, transforms to cms.gymdues.com for better image handling
 */
export function transformApiUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  const publicUrl = getPublicImageUrl()
  const urlStr = url.toString()
  
  // Replace nginx hostname with public URL
  let transformed = urlStr
    .replace(/http:\/\/nginx(\/|:)/g, `${publicUrl}$1`)
    .replace(/https:\/\/nginx(\/|:)/g, `${publicUrl}$1`)
  
  // In development, also replace localhost:8080 with cms.gymdues.com for images
  if (process.env.NODE_ENV === 'development') {
    transformed = transformed
      .replace(/http:\/\/localhost:8080(\/|$)/g, 'https://cms.gymdues.com$1')
      .replace(/https:\/\/localhost:8080(\/|$)/g, 'https://cms.gymdues.com$1')
  }
  
  return transformed
}

/**
 * Recursively transforms all URLs in an object/array response
 */
export function transformApiResponse(data: unknown): unknown {
  if (typeof data === 'string') {
    // Transform string URLs
    return transformApiUrl(data)
  } else if (Array.isArray(data)) {
    // Recursively transform array elements
    return data.map(transformApiResponse)
  } else if (data !== null && typeof data === 'object') {
    // Recursively transform object properties
    const transformed: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      // Transform URL-like fields
      if (typeof value === 'string' && (key.toLowerCase().includes('url') || key.toLowerCase().includes('path') || key.toLowerCase().includes('image') || key.toLowerCase().includes('logo'))) {
        transformed[key] = transformApiUrl(value)
      } else {
        transformed[key] = transformApiResponse(value)
      }
    }
    return transformed
  }
  return data
}
