import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getGymBySlug } from '@/lib/gyms-api'
import { getReviewCount } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, MapPin, Phone, Mail, Globe } from 'lucide-react'
import { faqCategories } from '@/data/faqs'
import { GymNewsletterSection } from '@/components/gym-newsletter-section'
import { GymAboutSection } from '@/components/gym-about-section'

/**
 * Formats a time string to AM/PM format without leading zeros
 * Handles various input formats (24-hour, 12-hour, etc.)
 */
function formatTimeToAmPm(timeString: string): string {
  if (!timeString) return ''

  // Remove any whitespace
  const time = timeString.trim()

  // Check if already in AM/PM format
  if (time.toLowerCase().includes('am') || time.toLowerCase().includes('pm')) {
    // Remove leading zeros from hours
    return time.replace(/\b0(\d):/g, '$1:').replace(/\b0(\d)\s/g, '$1 ')
  }

  // Try to parse as 24-hour format (HH:MM or HH:MM:SS)
  const time24Regex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  const match = time.match(time24Regex)

  if (match) {
    let hours = parseInt(match[1], 10)
    const minutes = match[2]
    const period = hours >= 12 ? 'PM' : 'AM'

    // Convert to 12-hour format
    if (hours === 0) {
      hours = 12
    } else if (hours > 12) {
      hours = hours - 12
    }

    return `${hours}:${minutes} ${period}`
  }

  // If parsing fails, return original
  return time
}

/**
 * Formats a date string to standard US DateTime format
 * Example: "December 3, 2025 at 7:04 PM" or "Dec 3, 2025, 7:04 PM"
 */
function formatUSDateTime(dateString: string): string {
  if (!dateString) return ''

  try {
    const date = new Date(dateString)

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }

    // Format to US DateTime: "Month Day, Year at Hour:Minute AM/PM"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York', // US Eastern Time
    }

    const formatted = date.toLocaleString('en-US', options)

    // Replace comma before time with "at" for better readability
    // "December 3, 2025, 7:04 PM" -> "December 3, 2025 at 7:04 PM"
    return formatted.replace(/, (\d{1,2}:\d{2} (?:AM|PM))$/, ' at $1')
  } catch {
    // If parsing fails, return original
    return dateString
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function GymDetailPage({ params }: PageProps) {
  const { slug } = await params
  let gym

  try {
    gym = await getGymBySlug(slug)
  } catch (error) {
    console.error('Failed to load gym:', error)
    notFound()
  }

  if (!gym) {
    notFound()
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative h-64 md:h-96 w-full bg-muted'>
        {gym.gallery?.[0]?.path && (
          <Image
            src={gym.gallery[0].path}
            alt={gym.name}
            fill
            className='object-cover'
            priority
          />
        )}
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
          <div className='container mx-auto'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
              <div>
                <h1 className='text-4xl md:text-5xl font-bold mb-2'>{gym.name}</h1>
                <div className='flex flex-wrap items-center gap-4 mb-4'>
                  <div className='flex items-center gap-1'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='font-semibold'>
                      {parseFloat(gym.rating.toString()).toFixed(1) || 0}
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
              <div className='bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-white/20'>
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
                  <Button className='w-full mt-3 bg-white text-black hover:bg-white/90' asChild>
                    <Link href={`tel:${gym.phone}`}>Call Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8 space-y-8'>
        {/* About - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <GymAboutSection description={gym.description} />
          </CardContent>
        </Card>

        {/* Membership Plans and Hours - Side by Side */}
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Membership Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>{getReviewCount(gym)} total reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {gym.reviews.map((review) => (
                  <div key={review.id} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-semibold'>{review.reviewer}</p>
                        <div className='flex items-center gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rate
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className='text-sm text-muted-foreground'>
                        {formatUSDateTime(review.reviewed_at)}
                      </span>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: review.text }}
                      className='text-muted-foreground'
                    />
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hours */}
          <Card>
            <CardHeader>
              <CardTitle>Operating Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {gym.hours.map((hour, index) => (
                  <div key={index} className='flex items-center justify-between text-sm'>
                    <span className='font-medium capitalize'>{hour.day}</span>
                    <span>
                      {formatTimeToAmPm(hour.from)} - {formatTimeToAmPm(hour.to)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Amenities - Full Width */}
        {gym.amenities && gym.amenities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
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

        {/* Membership Plans - Full Width */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Plans</CardTitle>
            <CardDescription>Choose the plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {gym.pricing?.map((plan) => (
                <Card key={plan.id} className={plan.is_popular ? 'border-primary border-2' : ''}>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg'>{plan.tier_name}</CardTitle>
                      {plan.is_popular && <Badge variant='default'>Popular</Badge>}
                    </div>
                    <div className='mt-2'>
                      <span className='text-3xl font-bold'>
                        ${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}
                      </span>
                      <span className='text-muted-foreground'>/{plan.frequency}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      dangerouslySetInnerHTML={{ __html: plan.description }}
                      className='text-primary'
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Section - Full Width */}
        <GymNewsletterSection />

        {/* FAQs - Full Width */}
        {gym.faqs &&
          gym.faqs.length > 0 &&
          (() => {
            // Group FAQs by category
            const faqsByCategory: Record<string, typeof gym.faqs> = {}
            gym.faqs.forEach((faq) => {
              const category = faq.category || 'General'
              if (!faqsByCategory[category]) {
                faqsByCategory[category] = []
              }
              faqsByCategory[category].push(faq)
            })

            // Get categories that have FAQs
            const availableCategories = faqCategories.filter(
              (cat) => faqsByCategory[cat]?.length > 0,
            )
            // Add 'General' category if there are FAQs without categories
            if (faqsByCategory['General']?.length > 0 && !availableCategories.includes('General')) {
              availableCategories.push('General')
            }

            return (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className='p-6'>
                  <Tabs defaultValue={availableCategories[0] || 'General'} className='w-full'>
                    <TabsList className='flex flex-wrap w-full gap-2 mb-6 h-auto p-2 bg-transparent'>
                      {availableCategories.map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className='text-xs md:text-sm whitespace-normal min-h-[3rem] px-4 py-2 leading-tight text-center border rounded-md data-[state=active]:bg-background data-[state=active]:border-primary data-[state=inactive]:bg-muted data-[state=inactive]:border-border'
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {availableCategories.map((category) => (
                      <TabsContent key={category} value={category}>
                        <Card>
                          <CardHeader>
                            <CardTitle>{category}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Accordion
                              type='single'
                              collapsible
                              className='w-full'
                              defaultValue={faqsByCategory[category]?.[0]?.id}
                            >
                              {faqsByCategory[category].map((faq) => (
                                <AccordionItem key={faq.id} value={faq.id}>
                                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                                  <AccordionContent>{faq.answer}</AccordionContent>
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
