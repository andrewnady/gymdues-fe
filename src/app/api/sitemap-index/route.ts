const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

/**
 * Main sitemap index at /sitemap.xml (via next.config rewrite).
 * Lists: static.xml, blog.xml, gyms.xml.
 */
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap/static.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap/blog.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap/gyms.xml</loc>
  </sitemap>
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
