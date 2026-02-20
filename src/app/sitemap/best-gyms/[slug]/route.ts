import { NextResponse } from 'next/server'
import { getCityStates } from '@/lib/gyms-api'

const BEST_GYMS_BASE_URL = process.env.NEXT_PUBLIC_BEST_GYMS_BASE_URL || 'https://bestgyms.gymdues.com'
const URLS_PER_SITEMAP = 100

function toSlug(name?: string): string {
  return name?.toLowerCase().replace(/\s+/g, '-') || ''
}

/** Serves /sitemap/best-gyms/0.xml, /sitemap/best-gyms/1.xml, ... (100 URLs per file) */
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

  try {
    const { cities, states } = await getCityStates("sitemaps")
    const base = BEST_GYMS_BASE_URL.replace(/\/$/, '')

    const allEntries = [
      ...cities
        .filter((c) => c.city)
        .map((c) => ({
          url: `${base}/best-${toSlug(c.city)}-gyms/`,
          priority: '0.8',
        })),
      ...states
        .filter((s) => s.stateName)
        .map((s) => ({
          url: `${base}/best-${toSlug(s.stateName)}-gyms/`,
          priority: '0.7',
        })),
    ]

    const pageEntries = allEntries.slice(index * URLS_PER_SITEMAP, (index + 1) * URLS_PER_SITEMAP)

    if (pageEntries.length === 0) {
      return new NextResponse('Not Found', { status: 404 })
    }

    const urlset = pageEntries
      .map(
        (entry) => `  <url>
    <loc>${entry.url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority}</priority>
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
    return new NextResponse('', { status: 500 })
  }
}
