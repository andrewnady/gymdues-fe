import { generateSitemaps } from '../../sitemap'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

/**
 * Sitemap index for /sitemap.xml (via next.config rewrite).
 * Next.js does not serve an index at /sitemap.xml when using generateSitemaps().
 */
export async function GET() {
  const sitemaps = await generateSitemaps()
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap>
    <loc>${BASE_URL}/sitemap/${s.id}.xml</loc>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
