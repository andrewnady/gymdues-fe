import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Users, Award, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ReadMoreText } from '@/components/read-more-text'

export const metadata: Metadata = {
  title: 'About Gymdues | How We Track Gym Membership Prices',
  description:
    'Learn how we collect and update gym membership pricing, our editorial standards, and how to get the most accurate costs.',
}

export default function AboutPage() {
  return (
    <div className='min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-12'>
            <h1 className='text-4xl font-bold mb-4'>About GymDues</h1>
            <ReadMoreText className='text-muted-foreground text-lg'>
              GymDues helps you find the right gym faster by making memberships easier to
              compare—prices, plans, and real experiences all in one place. We turn common searches
              like <strong>la fitness membership cost</strong>,{' '}
              <strong>anytime fitness membership cost</strong>,{' '}
              <strong>24 hour fitness membership cost</strong>, and{' '}
              <strong>lifetime gym membership cost</strong> into clear, side-by-side insights so you
              can understand the real monthly cost, what’s included, and what fees to expect.
              Whether you&apos;re choosing a neighborhood gym or a premium club, GymDues helps you
              avoid surprises, spot the best value, and join with confidence.
            </ReadMoreText>
          </div>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground leading-relaxed mb-4'>
                At GymDues, we believe that everyone deserves access to quality fitness facilities
                that match their goals, budget, and lifestyle. Our mission is to simplify the
                process of finding and choosing the right gym by providing comprehensive, up-to-date
                information about fitness centers in your area.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                We&apos;re committed to helping you make informed decisions through detailed
                listings, authentic reviews, and transparent pricing information. Whether
                you&apos;re a fitness enthusiast, a beginner starting your journey, or someone
                looking to switch gyms, we&apos;re here to help you find your perfect fit.
              </p>
            </CardContent>
          </Card>

          <div className='grid md:grid-cols-2 gap-6 mb-8'>
            <Card>
              <CardHeader>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4'>
                  <Target className='h-6 w-6 text-primary' />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  To become the most trusted platform for gym discovery, helping millions of people
                  find their ideal fitness home and achieve their health goals.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className='inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4'>
                  <Heart className='h-6 w-6 text-primary' />
                </div>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  Transparency, authenticity, and user-first approach. We believe in honest reviews,
                  accurate information, and putting your fitness journey first.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
              <CardDescription>Everything you need to find your perfect gym</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Users className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Comprehensive Listings</h3>
                    <p className='text-sm text-muted-foreground'>
                      Detailed information about facilities, amenities, and membership plans
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Award className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Authentic Reviews</h3>
                    <p className='text-sm text-muted-foreground'>
                      Real feedback from verified members to help you make informed decisions
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Target className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Easy Comparison</h3>
                    <p className='text-sm text-muted-foreground'>
                      Compare prices, features, and amenities side-by-side
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-4'>
                  <div className='rounded-full bg-primary/10 p-2'>
                    <Heart className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-semibold mb-1'>Free Service</h3>
                    <p className='text-sm text-muted-foreground'>
                      Our service is completely free for users - no hidden fees or charges
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex flex-col md:flex-row gap-6 items-start'>
                  <div className='flex-shrink-0 w-32 h-32 overflow-hidden rounded-full'>
                    <Image
                      src='/images/admir.png'
                      alt='Admir Salcinovic'
                      width={200}
                      height={200}
                      className='h-full w-full object-cover'
                      priority
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-xl font-semibold mb-2'>Admir Salcinovic</h3>
                    <p className='text-muted-foreground mb-4'>Founder & Chief Executive Officer</p>
                    <p className='text-muted-foreground leading-relaxed mb-4'>
                      Admir Salcinovic founded GymDues to solve a universal consumer problem: the
                      lack of a single reliable source for accurate gym information, pricing, and
                      trends. With over 15 years of experience in digital strategy and a
                      Bachelor&apos;s degree in Computer Science from Kennesaw State University,
                      Admir directs the company&apos;s global growth.
                    </p>
                    <p className='text-muted-foreground leading-relaxed mb-4'>
                      Prior to GymDues, Admir built a proven track record of entrepreneurial success
                      in the digital publishing world, creating, scaling, and successfully selling a
                      portfolio of specialized websites. This experience solidified his expertise in
                      search engine optimization, audience growth, and building valuable digital
                      assets from the ground up.
                    </p>
                    <p className='text-muted-foreground leading-relaxed'>
                      Admir is based in Atlanta, Georgia, where he lives with his wife and children.
                      He remains committed to the core mission of leveling the playing field by
                      providing consumers and businesses with the data needed to thrive in a
                      competitive environment.
                    </p>
                    <div className='pt-4'>
                      <Link
                        href='https://admirsalcinovic.com/'
                        target='blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2'
                      >
                        Learn more about Admir Salcinovic
                        <svg
                          className='h-4 w-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Admir Salcinovic',
            jobTitle: 'Founder & Chief Executive Officer',
            image: 'https://admirsalcinovic.com/wp-content/uploads/2025/12/admir.png',
            worksFor: {
              '@type': 'Organization',
              name: 'GymDues',
            },
            url: 'https://admirsalcinovic.com/',
            sameAs: 'https://admirsalcinovic.com/',
            email: 'adproductions@gmail.com',
            birthDate: '1986-05-06',
            birthPlace: {
              '@type': 'Place',
              name: 'Zenica',
              addressCountry: 'BA',
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Atlanta',
              addressRegion: 'Georgia',
              addressCountry: 'US',
            },
            alumniOf: {
              '@type': 'EducationalOrganization',
              name: 'Kennesaw State University',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Kennesaw',
                addressRegion: 'Georgia',
                addressCountry: 'US',
              },
            },
            knowsAbout: [
              'Digital Marketing',
              'Search Engine Optimization',
              'Web Development',
              'Data Analytics',
              'Entrepreneurship',
            ],
            description:
              'Founder and Chief Executive Officer of GymDues with over 15 years of experience in digital strategy, SEO, and building valuable digital assets.',
          }),
        }}
      />
    </div>
  )
}
