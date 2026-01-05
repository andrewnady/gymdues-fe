import { getStaticPageBySlug } from '@/lib/static-pages-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getStaticPageBySlug('how-it-works')

  return {
    title: page?.meta_title || page?.title || 'How It Works - GymDues',
    description: page?.meta_description || 'Learn how GymDues works',
  }
}

export default async function HowItWorksPage() {
  const page = await getStaticPageBySlug('how-it-works')

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
