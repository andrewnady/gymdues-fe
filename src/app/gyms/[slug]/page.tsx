import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getGymBySlug } from '@/data/mock-gyms';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MapPin, Phone, Mail, Globe, Check } from 'lucide-react';
import { faqCategories } from '@/data/faqs';
import { GymNewsletterSection } from '@/components/gym-newsletter-section';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GymDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const gym = getGymBySlug(slug);

  if (!gym) {
    notFound();
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <div className='relative h-64 md:h-96 w-full bg-muted'>
        <Image src={gym.featureImage} alt={gym.name} fill className='object-cover' priority />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
          <div className='container mx-auto'>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-6'>
              <div>
                <h1 className='text-4xl md:text-5xl font-bold mb-2'>{gym.name}</h1>
                <div className='flex flex-wrap items-center gap-4 mb-4'>
                  <div className='flex items-center gap-1'>
                    <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                    <span className='font-semibold'>{gym.rating}</span>
                    <span className='text-sm opacity-90'>({gym.reviewCount} reviews)</span>
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
            <p className='text-muted-foreground leading-relaxed'>{gym.description}</p>
          </CardContent>
        </Card>

        {/* Membership Plans and Hours - Side by Side */}
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Membership Plans */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>{gym.reviewCount} total reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {gym.reviews.map((review) => (
                  <div key={review.id} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-semibold'>{review.author}</p>
                        <div className='flex items-center gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className='text-sm text-muted-foreground'>{review.date}</span>
                    </div>
                    <p className='text-muted-foreground'>{review.comment}</p>
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
                    <span className='font-medium'>{hour.day}</span>
                    <span className={hour.closed ? 'text-muted-foreground' : ''}>
                      {hour.closed ? 'Closed' : `${hour.open} - ${hour.close}`}
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
               {gym.plans.map((plan) => (
                 <Card key={plan.id} className={plan.popular ? 'border-primary border-2' : ''}>
                   <CardHeader>
                     <div className='flex items-center justify-between'>
                       <CardTitle className='text-lg'>{plan.name}</CardTitle>
                       {plan.popular && <Badge variant='default'>Popular</Badge>}
                     </div>
                     <div className='mt-2'>
                       <span className='text-3xl font-bold'>${plan.price}</span>
                       <span className='text-muted-foreground'>/{plan.duration}</span>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <ul className='space-y-2'>
                       {plan.features.map((feature, index) => (
                         <li key={index} className='flex items-start gap-2'>
                           <Check className='h-4 w-4 text-primary mt-0.5 flex-shrink-0' />
                           <span className='text-sm'>{feature}</span>
                         </li>
                       ))}
                     </ul>
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

