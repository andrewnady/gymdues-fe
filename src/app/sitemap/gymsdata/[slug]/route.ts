import { NextResponse } from 'next/server'
import { getGymsdataSitemap } from '@/lib/gymsdata-api'

const BASE_URL =
  process.env.NEXT_PUBLIC_GYMSDATA_BASE_URL ||
  'https://gymsdata.gymdues.com'

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
    const { data } = await getGymsdataSitemap()
    const total = data?.length ?? 0

    const start = index * URLS_PER_SITEMAP
    const end = start + URLS_PER_SITEMAP

    if (start >= total) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const pageEntries = (data ?? []).slice(start, end)

    const urls = pageEntries
      .map((pathSegment: string) => {
        const loc = pathSegment ? `${BASE_URL}/${pathSegment}/` : `${BASE_URL}/`
        return `  <url>
    <loc>${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${pathSegment === '' || pathSegment === 'gymsdata' ? 0.9 : 0.8}</priority>
  </url>`
      })
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
