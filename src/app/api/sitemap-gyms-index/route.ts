import { getPaginatedGyms } from '@/lib/gyms-api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
const GYMS_PER_SITEMAP = 500

/**
 * Gyms sitemap index at /sitemap/gyms.xml (via next.config rewrite).
 * Lists: /sitemap/gyms/0.xml, /sitemap/gyms/1.xml, ...
 */
export async function GET() {
  let count = 1
  try {
    const { meta } = await getPaginatedGyms({
      page: 1,
      perPage: GYMS_PER_SITEMAP,
      fields: 'sitemap',
    })
    count = Math.ceil(meta.total / GYMS_PER_SITEMAP)
  } catch {
    count = 1
  }
  const entries = Array.from({ length: count }, (_, i) => i)
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (i) => `  <sitemap>
    <loc>${BASE_URL}/sitemap/gyms/${i}.xml</loc>
  </sitemap>`,
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
