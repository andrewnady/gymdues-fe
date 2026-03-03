import { getBestGymPageSitemap } from '@/lib/gyms-api'

const BASE_URL =
  process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL ||
  'https://bestgyms.gymdues.com'

const URLS_PER_SITEMAP = 100

export async function GET() {
  try {
    const { data } = await getBestGymPageSitemap()
    const total = data?.length || 0
    const count = Math.ceil(total / URLS_PER_SITEMAP)

    const entries = Array.from({ length: count }, (_, i) => i)

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (i) => `  <sitemap>
    <loc>${BASE_URL}/sitemaps/best-gyms/${i}.xml</loc>
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
  } catch {
    return new Response('', { status: 500 })
  }
}