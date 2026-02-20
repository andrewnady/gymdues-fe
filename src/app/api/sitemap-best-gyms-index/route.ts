import { getCityStates } from '@/lib/gyms-api'

const BEST_GYMS_BASE_URL = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'
const URLS_PER_SITEMAP = 100

/**
 * Best-gyms sitemap index — only served from bestgyms.gymdues.com.
 * Reached via /sitemap.xml on bestgyms.gymdues.com (middleware rewrite).
 */
export async function GET() {
  const listingBase = BEST_GYMS_BASE_URL.replace(/\/$/, '')

  let count = 1
  try {
    const { cities, states } = await getCityStates("sitemaps")
    console.log([cities, states])
    const total =
      cities.filter((c) => c.city).length +
      states.filter((s) => s.stateName).length
    count = Math.max(1, Math.ceil(total / URLS_PER_SITEMAP))
  } catch {
    count = 1
  }

  const entries = Array.from({ length: count }, (_, i) => i)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (i) => `  <sitemap>
    <loc>${listingBase}/sitemap/best-gyms/${i}.xml</loc>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
