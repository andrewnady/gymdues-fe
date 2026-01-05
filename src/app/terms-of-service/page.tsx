import { getStaticPageBySlug } from '@/lib/static-pages-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('terms-of-service')

  return {
    title: page?.meta_title || page?.title || 'Terms of Service - GymDues',
    description: page?.meta_description || 'Terms of Service for GymDues',
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
