import { NextResponse } from 'next/server'
import { getBestGymPageSitemap } from '@/lib/gyms-api'

const BASE_URL =
  process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL ||
  'https://bestgyms.gymdues.com/'

const URLS_PER_SITEMAP = 100

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const match = slug?.match(/^(\d+)\.xml$/)

  if (!match) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const index = Number(match[1])

  try {
    const { data } = await getBestGymPageSitemap()
    const total = data?.length || 0

    const start = index * URLS_PER_SITEMAP
    const end = start + URLS_PER_SITEMAP

    if (start >= total) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const pageEntries = data.slice(start, end)

    const urls = pageEntries
      .map(
        (slug: string) => `  <url>
    <loc>${BASE_URL}${slug}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return new NextResponse('', { status: 500 })
  }
}