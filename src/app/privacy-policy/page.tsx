import { getStaticPageBySlug } from '@/lib/static-pages-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Force dynamic rendering to avoid build-time API calls
export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getStaticPageBySlug('privacy-policy')
    return {
      title: page?.meta_title || page?.title || 'Privacy Policy - GymDues',
      description: page?.meta_description || 'Privacy Policy for GymDues',
    }
  } catch {
    return {
      title: 'Privacy Policy - GymDues',
      description: 'Privacy Policy for GymDues',
    }
  }
}

export default async function PrivacyPolicyPage() {
  const page = await getStaticPageBySlug('privacy-policy')

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
