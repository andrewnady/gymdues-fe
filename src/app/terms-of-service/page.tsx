import { getStaticPageBySlug } from '@/lib/static-pages-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 60

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getStaticPageBySlug('terms-of-service')
    const metadata: Metadata = {
      title: page?.meta_title || page?.title || 'Terms of Service - GymDues',
      description: page?.meta_description || 'Terms of Service for GymDues',
      alternates: {
        canonical: `${siteUrl}/terms-of-service/`,
        languages: {
          'en-US': `${siteUrl}/terms-of-service/`,
          'x-default': `${siteUrl}/terms-of-service/`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title: page?.meta_title || page?.title || 'Terms of Service - GymDues',
        description: page?.meta_description || 'Terms of Service for GymDues',
        url: `${siteUrl}/terms-of-service/`,
        siteName: 'GymDues',
        type: 'website',
        images: [
          {
            url: `${siteUrl}/images/logo.svg`,
            width: 1200,
            height: 630,
            alt: 'Terms of Service - GymDues',
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: page?.meta_title || page?.title || 'Terms of Service - GymDues',
        description: page?.meta_description || 'Terms of Service for GymDues',
        images: [`${siteUrl}/images/logo.svg`],
        creator: '@gymdues',
        site: '@gymdues',
      },
    }

    // Add published and updated date meta tags
    const otherTags: Record<string, string> = {}
    if (page?.created_at) {
      otherTags['article:published_time'] = new Date(page.created_at).toISOString()
    }
    if (page?.updated_at && page.updated_at !== page.created_at) {
      otherTags['article:modified_time'] = new Date(page.updated_at).toISOString()
    }
    if (Object.keys(otherTags).length > 0) {
      metadata.other = otherTags
    }

    return metadata
  } catch {
    return {
      title: 'Terms of Service - GymDues',
      description: 'Terms of Service for GymDues',
      alternates: {
        canonical: `${siteUrl}/terms-of-service/`,
        languages: {
          'en-US': `${siteUrl}/terms-of-service/`,
          'x-default': `${siteUrl}/terms-of-service/`,
        },
      },
    }
  }
}

export default async function TermsOfServicePage() {
  const page = await getStaticPageBySlug('terms-of-service')

  if (!page) {
    notFound()
  }

  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <h1 className='text-4xl font-bold mb-8'>{page.title}</h1>
        <div className='static-page-content' dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </div>
  )
}
