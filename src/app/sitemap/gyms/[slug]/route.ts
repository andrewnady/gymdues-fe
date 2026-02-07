import { NextResponse } from 'next/server'
import { getPaginatedGyms } from '@/lib/gyms-api'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
const GYMS_PER_SITEMAP = 500

/** Serves /sitemap/gyms/0.xml, /sitemap/gyms/1.xml, ... (500 gyms per file) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const match = slug?.match(/^(\d+)\.xml$/)
  if (!match) {
    return new NextResponse('Not Found', { status: 404 })
  }
  const index = Number(match[1])
  const page = index + 1
  try {
    const { gyms } = await getPaginatedGyms({
      page,
      perPage: GYMS_PER_SITEMAP,
      fields: 'sitemap',
    })
    const urlset = gyms
      .map(
        (gym) => `  <url>
    <loc>${BASE_URL}/gyms/${gym.slug}/</loc>
    <lastmod>${(gym.updated_at ? new Date(gym.updated_at) : new Date()).toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      )
      .join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch {
    return new NextResponse('', { status: 404 })
  }
}
