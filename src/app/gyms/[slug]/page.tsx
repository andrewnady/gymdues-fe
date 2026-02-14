import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getGymBySlug } from '@/lib/gyms-api'
import { getReviewCount, getGymHeroImagePath } from '@/lib/utils'
import { GymHeroImage } from '@/components/gym-hero-image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPin, Star } from 'lucide-react'
import { faqCategories } from '@/data/faqs'
import { GymAboutSection } from '@/components/gym-about-section'
import { NewsletterSubscription } from '@/components/newsletter-subscription'
import { ReadMoreText } from '@/components/read-more-text'
import { GymSlugAddressBlock } from '@/components/gym-slug-address-block'
import { Breadcrumb } from '@/components/breadcrumb'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  let gym

  try {
    gym = await getGymBySlug(slug)
  } catch {
    return {
      title: 'Gym Not Found - GymDues',
    }
  }

  if (!gym) {
    return {
      title: 'Gym Not Found - GymDues',
    }
  }

  // Get the current pathname from headers to match the requested URL
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || `/gyms/${slug}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
  // Use the pathname as-is to match the current URL (preserve trailing slash)
  const gymUrl = new URL(pathname, siteUrl).toString()
  const heroPath = getGymHeroImagePath(gym)
  const gymImage = heroPath
    ? (heroPath.startsWith('http') ? heroPath : `${siteUrl}${heroPath}`)
    : `${siteUrl}/images/bg-header.jpg`

  const title = `${gym.name}: Memberships, Fees, Classes, and Facilities | GymDues`
  const description = gym.description
    ? `${gym.description.substring(0, 155)}...`
    : `Find ${gym.name} membership prices, plans, reviews, and facilities. Compare costs and join the gym that fits your lifestyle.`

  return {
    title,
    description,
    alternates: {
      canonical: gymUrl,
      languages: {
        'en-US': gymUrl,
        'x-default': gymUrl,
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
      title,
      description,
      url: gymUrl,
      siteName: 'GymDues',
      images: [
        {
          url: gymImage,
          width: 1200,
          height: 630,
          alt: `${gym.name} - Gym Membership Information`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [gymImage],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

export default async function GymDetailPage({ params }: PageProps) {
  const { slug } = await params

  let gym

  try {
    gym = await getGymBySlug(slug)
  } catch (error) {
    console.error('Failed to load gym:', error)
    // Log more details in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', {
        slug,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
    notFound()
  }

  if (!gym) {
    notFound()
  }

  // Get site URL from environment or default to production
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
  const gymUrl = new URL(`/gyms/${slug}`, siteUrl).toString()
  const heroPath = getGymHeroImagePath(gym)
  const gymImage = heroPath
    ? (heroPath.startsWith('http') ? heroPath : `${siteUrl}${heroPath}`)
    : `${siteUrl}/images/bg-header.jpg`

  // Get dates for structured data - format as ISO strings
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().toISOString()
    try {
      return new Date(dateStr).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  const publishedDateForSchema = formatDate(gym.created_at)
  const modifiedDateForSchema = formatDate(gym.updated_at) || publishedDateForSchema

  // Offer Schemas (Schema.org) - One for each membership plan
  const offerSchemas = gym.pricing?.map((plan) => {
    const price = typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price
    return {
      '@context': 'https://schema.org',
      '@type': 'Offer',
      name: `${gym.name} - ${plan.tier_name}`,
      description: plan.description || `${plan.tier_name} membership plan`,
      price: price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: price,
        priceCurrency: 'USD',
        unitText: plan.frequency.toLowerCase(),
      },
      seller: {
        '@type': 'ExerciseGym',
        name: gym.name,
        url: gym.website || gymUrl,
      },
    }
  }) || []

  // Review Schemas (Schema.org)
  const reviewSchemas = gym.reviews?.map((review) => {
    // Format date for review
    const reviewDate = review.reviewed_at ?? new Date().toISOString().split('T')[0]

    // Strip HTML tags from review text
    const reviewBody = review.text?.replace(/<[^>]*>/g, '').trim() || ''

    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'ExerciseGym',
        name: gym.name,
        url: gymUrl,
      },
      author: {
        '@type': 'Person',
        name: review.reviewer || 'Anonymous',
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(review.rate || 0),
      },
      datePublished: reviewDate,
      reviewBody: reviewBody,
    }
  }) || []

  // FAQ Schema (Schema.org)
  const faqSchema = gym.faqs && gym.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: gym.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.replace(/<[^>]*>/g, ''), // Strip HTML tags
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<[^>]*>/g, ''), // Strip HTML tags
      },
    })),
  } : null

  // ExerciseGym Schema (additional schema for gym)
  const exerciseGymSchema = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: gym.name,
    description: gym.description,
    image: gymImage,
    datePublished: publishedDateForSchema,
    dateModified: modifiedDateForSchema,
    url: gym.website || gymUrl,
    telephone: gym.phone,
    email: gym.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress:
        typeof gym.address === 'string'
          ? gym.address
          : (gym.address?.full_address ?? gym.address?.street ?? gym.city ?? ''),
      addressLocality: gym.city,
      addressRegion: gym.state,
      postalCode: gym.zipCode,
      addressCountry: 'US',
    },
    ...(gym.hours && gym.hours.length > 0 && {
      openingHoursSpecification: gym.hours.map((hour) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${hour.day.charAt(0).toUpperCase() + hour.day.slice(1)}`,
        opens: hour.from,
        closes: hour.to,
      })),
    }),
    ...(reviewSchemas.length > 0 && {
      review: reviewSchemas,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: parseFloat(gym.rating?.toString()).toFixed(1),
        reviewCount: getReviewCount(gym),
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(gym.amenities && gym.amenities.length > 0 && {
      amenityFeature: gym.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
      })),
    }),
  }

  // Breadcrumb Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Gyms',
        item: `${siteUrl}/gyms`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: gym.name,
        item: gymUrl,
      },
    ],
  }

  return (
    <div className='min-h-screen relative'>
      {/* JSON-LD Structured Data - only output when data exists to avoid empty/null for SEO */}
      {/* Offer Schemas for each membership plan */}
      {offerSchemas.length > 0 &&
        offerSchemas.map((offer, index) => (
          <script
            key={`offer-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(offer),
            }}
          />
        ))}
      {/* Review Schemas */}
      {reviewSchemas.length > 0 &&
        reviewSchemas.map((review, index) => (
          <script
            key={`review-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(review),
            }}
          />
        ))}
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
      {/* ExerciseGym Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(exerciseGymSchema),
        }}
      />
      {/* Hero Section */}
      <div className='relative h-64 md:h-96 w-full bg-muted'>
        <GymHeroImage src={heroPath} alt={gym.name} />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
          <div className='container mx-auto'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-4'>
              <div>
                {/* Breadcrumb Schema */}
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                  }}
                />
                {/* Breadcrumb Navigation */}
                <div className='container mx-auto py-2'>
                  <Breadcrumb
                    className='!text-background'
                    items={[
                      { label: 'Home', href: '/' },
                      { label: 'Gyms', href: '/gyms' },
                      { label: gym.name, href: `/gyms/${slug}` },
                    ]}
                  />
                </div>
                <h1 className='text-4xl md:text-5xl font-bold mb-2'>
                  {gym.name}: Memberships, Fees, Classes, and Facilities
                </h1>
                <div className='flex flex-wrap items-center gap-4 mb-4'>
                  <div className='flex items-center gap-1'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='font-semibold'>
                      {parseFloat(gym.rating?.toString()).toFixed(1) || 0}
                    </span>
                    <span className='text-sm opacity-90'>({getReviewCount(gym)} reviews)</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <MapPin className='h-5 w-5' />
                    <span>
                      {gym.city}, {gym.state}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info in Hero */}
              {/* <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20'>
                <h3 className='font-semibold mb-3 text-lg'>Contact Information</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-start gap-2'>
                    <MapPin className='h-4 w-4 mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='font-medium'>{gym.address}</p>
                      <p className='text-white/80'>
                        {gym.city}, {gym.state} {gym.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 flex-shrink-0' />
                    <a href={`tel:${gym.phone}`} className='hover:underline'>
                      {gym.phone}
                    </a>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4 flex-shrink-0' />
                    <a href={`mailto:${gym.email}`} className='hover:underline'>
                      {gym.email}
                    </a>
                  </div>
                  {gym.website && (
                    <div className='flex items-center gap-2'>
                      <Globe className='h-4 w-4 flex-shrink-0' />
                      <a
                        href={gym.website}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:underline'
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  <Button className='w-full mt-3 bg-white text-black hover:bg-white/90'>
                    <Link href={`tel:${gym.phone}`}>Call Now</Link>
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* About - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>About {gym.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <GymAboutSection description={gym.description} />
          </CardContent>
        </Card>

        {/* Map and address sections: #location= (address id) is read from hash on the client */}
        <GymSlugAddressBlock slug={slug} gym={gym} />

        {/* Amenities - Full Width */}
        {gym.amenities && gym.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amenities for {gym.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-2'>
                {gym.amenities.map((amenity) => (
                  <Badge key={amenity} variant='secondary'>
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Newsletter Section - Full Width */}
        <NewsletterSubscription />

        {/* FAQs - Full Width */}
        {gym.faqs &&
          gym.faqs.length > 0 &&
          (() => {
            // Group FAQs by category
            const faqsByCategory: Record<string, typeof gym.faqs> = gym.faqs.reduce((acc, faq) => {
              const category = faq.category || 'General'
              if (!acc[category]) {
                acc[category] = []
              }
              acc[category].push(faq)
              return acc
            }, {} as Record<string, typeof gym.faqs>)

            // Get categories that have FAQs
            const availableCategories = faqCategories.filter(
              (cat) => faqsByCategory[cat.id]?.length > 0,
            )
            // Add 'General' category if there are FAQs without categories
            if (
              faqsByCategory['General']?.length > 0 &&
              !availableCategories.some((cat) => cat.id === 'General')
            ) {
              availableCategories.unshift({ id: 'General', title: 'General' })
            }

            return (
              <Card className='border-none shadow-none p-0'>
                <CardHeader>
                  <CardTitle className='text-center'>
                    <h2 className='text-3xl md:text-4xl font-bold mb-2'>
                      Frequently Asked Questions for {gym.name}
                    </h2>
                    <ReadMoreText className='font-normal text-muted-foreground text-lg'>
                      Have questions before joining {gym.name}? This FAQ covers the most common
                      things people want to know—membership options, pricing expectations, fees,
                      cancellations, guest policies, and what&apos;s included in each plan. We also
                      answer the same high-intent searches members ask online, like{' '}
                      <strong>{gym.name} membership</strong>,{' '}
                      <strong>{gym.name} membership cost</strong>,{' '}
                      <strong>{gym.name} membership cost per month</strong>,{' '}
                      <strong>{gym.name} membership plans</strong>, and{' '}
                      <strong>{gym.name} membership price per month</strong>—so you can make a
                      confident decision without surprises.
                    </ReadMoreText>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                  <Tabs defaultValue={availableCategories[0]?.id || 'General'} className='w-full'>
                    <TabsList className='flex flex-wrap w-full gap-2 mb-6 h-auto p-2 bg-transparent'>
                      {availableCategories.map((category) => (
                        <TabsTrigger
                          key={category.id}
                          value={category.id}
                          className='text-xs md:text-sm whitespace-normal min-h-[3rem] px-4 py-2 leading-tight text-center border rounded-md data-[state=active]:bg-background data-[state=active]:border-primary data-[state=inactive]:bg-muted data-[state=inactive]:border-border'
                        >
                          {category.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {availableCategories.map((category) => (
                      <TabsContent key={category.id} value={category.id}>
                        <Card>
                          <CardContent>
                            <Accordion
                              type='single'
                              collapsible
                              className='w-full'
                              defaultValue={faqsByCategory[category.id]?.[0]?.id}
                            >
                              {faqsByCategory[category.id].map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id}>
                                  <AccordionTrigger className='text-lg font-semibold'>
                                    <div dangerouslySetInnerHTML={{ __html: faq.question }} />
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )
          })()}
      </div>
    </div>
  )
}
