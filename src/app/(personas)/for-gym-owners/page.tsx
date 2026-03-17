import type { Metadata } from 'next'
import { CheckCircle2, MapPin, LogIn, HelpCircle } from 'lucide-react'
import { GymOwnerClaimCta } from './_components/gym-owner-claim-cta'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaqAccordion } from './_components/faq-accordion'
import { JsonLdSchema } from '@/components/json-ld-schema'
import { buildWebPageSchema, buildFAQPageSchema, buildProductSchema, buildBreadcrumbSchema } from '@/lib/schema-builder'

const title = 'Gym Owner Tools & Listing Management | GymDues'
const description =
  'Gym owner tools to claim and manage your Gymdues listing. Update pricing, respond to reviews, see competitor insights, and turn profile views into new members.'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForGymOwnersPage() {
  const webPageSchema = buildWebPageSchema({
    baseUrl: siteUrl,
    name: title,
    description,
    path: '/for-gym-owners',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'For Gym Owners', url: '/for-gym-owners' },
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'For Gym Owners', url: '/for-gym-owners' },
    ],
    siteUrl,
  )

  const faqSchema = buildFAQPageSchema(
    [
      {
        question: 'Is it really free to claim my gym?',
        answer:
          'Yes. Claiming your gym and managing your basic listing is completely free. You can update your info, respond to reviews, and see basic analytics without paying. Premium tools are optional.',
      },
      {
        question: 'What if someone already claimed my gym?',
        answer:
          "If you believe your gym has been claimed by someone who isn't authorized, you can request an ownership review during the claim process. Our team will verify documentation and help transfer the listing to the rightful owner.",
      },
      {
        question: 'How long does verification take?',
        answer:
          'For most owners, verification is instant or completed within a few minutes via email or phone. In some cases, it may take up to 1–2 business days if additional documents are needed.',
      },
      {
        question: 'Do I need a credit card to get started?',
        answer:
          "No. You can claim your gym and use the free tools without entering any payment details. You'll only add a card if you choose to upgrade to Premium.",
      },
      {
        question: 'Can I manage more than one location?',
        answer:
          'Yes. You can claim and manage multiple locations from the same account. Premium includes tools designed for franchises and chains.',
      },
    ],
    { baseUrl: siteUrl, name: 'Gym Owner Tools & FAQ | GymDues', path: '/for-gym-owners' },
  )

  const premiumProductSchema = buildProductSchema({
    name: 'GymDues Premium Subscription',
    description:
      'Premium subscription for gym owners on GymDues with priority placement, competitor pricing insights, lead details, booking tools, promotional banners, and bulk location management.',
    brandName: 'GymDues',
    price: 49,
    priceCurrency: 'USD',
    unitText: 'MON',
    availability: 'https://schema.org/InStock',
    seller: { name: 'GymDues', url: siteUrl },
  })

  return (
    <main className='min-h-screen bg-background'>
      <JsonLdSchema data={[webPageSchema, faqSchema, premiumProductSchema, breadcrumbSchema]} />
      <div className='container mx-auto px-4 py-12 lg:py-16 space-y-20'>
        <header className='text-center md:text-left'>
          <nav className='text-sm text-muted-foreground mb-2' aria-label='Breadcrumb'>
            <a href='/' className='hover:text-primary'>Home</a>
            <span className='mx-1.5'>/</span>
            <span className='text-foreground font-medium'>For Gym Owners</span>
          </nav>
          <h2 className='text-2xl md:text-3xl font-bold tracking-tight text-foreground'>
            For Gym Owners
          </h2>
        </header>
        {/* Section 1: Hero */}
        <section className='relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/[0.06] via-background to-emerald-500/[0.06] px-6 py-12 md:px-10 md:py-16 lg:px-12'>
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--primary)/8%,transparent)] pointer-events-none' />
          <div className='relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center'>
            <div>
              <p className='inline-flex items-center gap-2 rounded-full bg-primary/10 ring-1 ring-primary/20 px-3.5 py-1.5 text-sm font-semibold text-primary mb-5'>
                <span className='relative flex h-2 w-2'>
                  <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60' />
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-primary' />
                </span>
                Your Gym is Already Listed. Take Control.
              </p>
              <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4 leading-[1.15]'>
                Thousands of people are searching for your gym right now — are you
                managing what they see?
              </h1>
              <p className='text-base md:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed'>
                Your gym likely already exists on GymDues. Claim your profile to
                update pricing, respond to reviews, and turn more searches into new
                members.
              </p>
              <div className='space-y-4 max-w-xl'>
                {/* JS-enabled experience: interactive search + selected gym card */}
                <div className='js-only'>
                  <GymOwnerClaimCta searchSize='md' />
                </div>

                {/* No-JS fallback: simple HTML search form that works without client-side code */}
                <div className='no-js-only space-y-2'>
                  <form
                    action='/gyms'
                    method='get'
                    className='flex flex-col sm:flex-row gap-3 sm:items-center'
                  >
                    <label className='sr-only' htmlFor='nojs-gym-search'>
                      Search for gyms by name or city
                    </label>
                    <input
                      id='nojs-gym-search'
                      name='search'
                      type='text'
                      className='flex-1 min-w-0 rounded-2xl border border-border/70 bg-card/95 px-4 py-3 text-sm shadow-sm'
                      placeholder='Search for gyms by name or city…'
                    />
                    <button
                      type='submit'
                      className='sm:shrink-0 w-full sm:w-auto rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'
                    >
                      Search gyms
                    </button>
                  </form>
                  <p className='text-[11px] text-muted-foreground'>
                    No JavaScript? You can still search all gyms and then claim your listing from the
                    gym page.
                  </p>
                </div>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-border/60'>
                  <p className='text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1'>
                    <span>Can&apos;t find your gym?</span>
                    <a
                      href='/gyms'
                      className='inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors whitespace-nowrap'
                    >
                      Browse all gyms
                    </a>
                  </p>
                  <p className='text-xs text-muted-foreground sm:text-right inline-flex flex-nowrap items-center gap-x-1.5'>
                    <span className='whitespace-nowrap'>Already claimed?</span>
                    <a
                      href='/dashboard/auth/login'
                      className='inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors whitespace-nowrap'
                    >
                      <LogIn className='h-3.5 w-3.5' aria-hidden />
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className='relative'>
              <div className='absolute -inset-4 bg-gradient-to-br from-primary/15 via-transparent to-emerald-400/10 rounded-[2rem] blur-2xl opacity-60 pointer-events-none' />
              <div className='relative rounded-2xl border border-border/80 bg-card/95 backdrop-blur-sm p-6 shadow-xl shadow-primary/5 space-y-6'>
                <div>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90 mb-2'>
                    What you control
                  </p>
                  <p className='text-xs text-muted-foreground mb-3'>
                    Free covers the essentials. Premium unlocks more visibility and growth tools — all in one dashboard.
                  </p>
                  <ul className='space-y-2.5 text-sm text-muted-foreground'>
                    {/* Free listing basics (match Free card) */}
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Edit hours, amenities, photos, and key details.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Respond to reviews and member questions.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Track basic views and click analytics.</span>
                    </li>

                    {/* Premium benefits (match Premium card) */}
                    <li className='flex items-start gap-2 pt-2 border-t border-border/70 mt-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Priority placement in Gymdues search results.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Competitor pricing insights in your local market.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Lead contact details for trials and tours.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Booking &amp; trial request management tools.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Promotional banners for time-limited offers.</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Bulk location management for franchises and chains.</span>
                    </li>
                  </ul>
                </div>
                <div className='rounded-xl border border-border/80 bg-muted/50 p-4 space-y-3'>
                  <p className='text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
                    Example search result
                  </p>
                  <div className='rounded-xl border border-border/80 bg-background p-3.5 flex items-center justify-between gap-3 shadow-sm'>
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-foreground truncate'>IronCity Fitness</p>
                      <p className='text-xs text-muted-foreground flex items-center gap-1 mt-0.5'>
                        <MapPin className='h-3 w-3 shrink-0' />
                        Denver, CO · 1.2 miles away
                      </p>
                    </div>
                    <Badge className='shrink-0 rounded-full bg-emerald-500/90 text-emerald-50 text-[11px] font-medium px-2.5 py-0.5'>
                      Verified
                    </Badge>
                  </div>
                  <p className='text-[11px] text-muted-foreground leading-snug'>
                    Claimed gyms show as verified and convert more clicks into tours, trials, and
                    memberships.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: The Problem You're Solving */}
        <section className='space-y-8 rounded-3xl bg-muted/60 px-6 py-10 md:px-10 md:py-14 border border-border/70'>
          <div className='max-w-3xl'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/80'>
              The problem
            </p>
            <h2 className='mt-3 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-foreground'>
              Right now, someone else controls your first impression.
            </h2>
            <p className='mt-4 text-sm md:text-base text-muted-foreground max-w-2xl'>
              Every day your gym is unclaimed, you&apos;re losing prospects to outdated information,
              unanswered reviews, and competitors who already manage their listings.
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            <Card className='h-full rounded-2xl border border-border bg-background p-6 text-left shadow-sm'>
              <div className='mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600'>
                <span className='text-lg'>📉</span>
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Stale pricing drives prospects away
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                When your listed prices are wrong or out of date, people leave before contacting you.
                You lose the lead before you knew you had it.
              </p>
            </Card>

            <Card className='h-full rounded-2xl border border-border bg-background p-6 text-left shadow-sm'>
              <div className='mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600'>
                <span className='text-lg'>💬</span>
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Unresponded reviews hurt trust
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Every unanswered 3-star review is a conversion killer. Claimed owners respond.
                Unclaimed owners just lose members.
              </p>
            </Card>

            <Card className='h-full rounded-2xl border border-border bg-background p-6 text-left shadow-sm'>
              <div className='mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600'>
                <span className='text-lg'>🏆</span>
              </div>
              <h3 className='text-base font-semibold text-foreground'>
                Your competitors are already here
              </h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Nearby gyms have claimed their listings, optimized their profiles, and are getting
                the leads that should be yours.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 3: How Claiming Works */}
        <section className='space-y-6'>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <div>
              <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
                Claim your gym in three simple steps.
              </h2>
              <p className='text-muted-foreground max-w-xl'>
                Most owners get verified and into their dashboard in just a few
                minutes.
              </p>
            </div>
            <p className='text-sm font-medium text-emerald-600'>
              Takes less than 5 minutes for most owners.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-3'>
            <Card className='p-5 space-y-3'>
              <div className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
                1
              </div>
              <h3 className='font-semibold'>Find your gym</h3>
              <p className='text-sm text-muted-foreground'>
                Search by gym name or address and select your existing Gymdues
                listing. If it&apos;s not there, you can create a new one.
              </p>
            </Card>
            <Card className='p-5 space-y-3'>
              <div className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
                2
              </div>
              <h3 className='font-semibold'>Verify ownership</h3>
              <p className='text-sm text-muted-foreground'>
                Confirm that you&apos;re authorized via work email, phone, or a
                quick document upload if needed.
              </p>
            </Card>
            <Card className='p-5 space-y-3'>
              <div className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary'>
                3
              </div>
              <h3 className='font-semibold'>Access your dashboard</h3>
              <p className='text-sm text-muted-foreground'>
                Update info, respond to reviews, and track profile views — all from
                one place designed for busy owners.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 4: Free vs Premium (modern design) */}
        <section className='space-y-8'>
          <div className='text-center max-w-2xl mx-auto space-y-3'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary/80'>
              Free &amp; Premium only
            </p>
            <h2 className='text-xl md:text-2xl font-semibold'>
              Start free. Upgrade to Premium when you&apos;re ready.
            </h2>
            <p className='text-sm md:text-base text-muted-foreground'>
              We offer two options: free listing management, or Premium for more visibility and
              tools. No other tiers — just Free and Premium.
            </p>
          </div>

          <div className='relative'>
            <div className='max-w-5xl mx-auto'>
              <div className='flex items-center justify-center mb-6'>
                <span className='inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-[11px] font-medium text-muted-foreground'>
                  <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                  No contracts • Cancel anytime
                </span>
              </div>

              <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-stretch'>
                {/* Free plan */}
                <Card className='group rounded-2xl border border-border/80 bg-card/95 p-6 md:p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
                  <div className='flex flex-col h-full justify-between'>
                    <div className='space-y-4'>
                      <div>
                        <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                          Free forever
                        </p>
                        <h3 className='text-xl font-semibold mt-1'>Free listing management</h3>
                      </div>
                      <div>
                        <p className='text-3xl font-semibold'>$0</p>
                        <p className='text-xs text-muted-foreground'>per location / month</p>
                      </div>
                      <ul className='mt-4 space-y-2.5 text-sm text-muted-foreground'>
                        <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                          <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-primary'>
                            <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                          </span>
                          <span>Edit hours, amenities, photos, and key details.</span>
                        </li>
                        <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                          <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-primary'>
                            <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                          </span>
                          <span>Respond to reviews and member questions.</span>
                        </li>
                        <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                          <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 text-primary'>
                            <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                          </span>
                          <span>Track basic views and click analytics.</span>
                        </li>
                      </ul>
                    </div>
                    <Button className='mt-6 w-full' size='lg' variant='outline'>
                      List your gym for free
                    </Button>
                  </div>
                </Card>

                {/* Premium plan */}
                <Card className='group relative rounded-2xl border border-primary/70 bg-gradient-to-br from-primary/10 via-background to-emerald-50/50 p-6 md:p-7 shadow-xl shadow-primary/15 transition-all hover:-translate-y-1 hover:shadow-2xl'>
                  <div className='absolute -top-3 right-4'>
                    <Badge className='rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold shadow'>
                      Most popular
                    </Badge>
                  </div>

                  <div className='flex flex-col h-full justify-between'>
                    <div className='space-y-4'>
                      <div className='flex items-start justify-between gap-4'>
                        <div>
                          <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/90'>
                            Premium
                          </p>
                          <h3 className='text-xl font-semibold mt-1'>Premium Subscription</h3>
                        </div>
                        <div className='text-right'>
                          <p className='text-3xl font-semibold text-foreground'>$49</p>
                          <p className='text-xs text-muted-foreground'>per location / month</p>
                        </div>
                      </div>

                      <p className='text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200 rounded-xl px-3 py-2'>
                        Gym owners on Premium get <span className='font-semibold'>3× more profile clicks</span> on average.
                      </p>

                      <div className='grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground mt-2'>
                        <ul className='space-y-2.5'>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Priority placement in Gymdues search results.</span>
                          </li>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Competitor pricing insights in your local market.</span>
                          </li>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Lead contact details for trials and tours.</span>
                          </li>
                        </ul>
                        <ul className='space-y-2.5'>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Booking &amp; trial request management tools.</span>
                          </li>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Promotional banners for time-limited offers.</span>
                          </li>
                          <li className='flex items-start gap-2 group-hover:translate-x-0.5 transition-transform'>
                            <span className='mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary'>
                              <CheckCircle2 className='h-3.5 w-3.5' aria-hidden />
                            </span>
                            <span>Bulk location management for franchises and chains.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className='mt-6 space-y-2'>
                      <Button className='w-full' size='lg'>
                        List your gym
                      </Button>
                      <p className='text-[11px] text-muted-foreground text-center'>
                        Managing multiple locations? <span className='font-medium text-primary'>Talk to our team</span> for Premium pricing.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Verified Badge */}
        <section className='space-y-6'>
          <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center'>
            <div>
              <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
                Earn the Verified Business badge and stand out in search.
              </h2>
              <p className='text-muted-foreground mb-4'>
                When you claim and complete your profile, your gym can earn the
                Verified Business badge — a trust signal members see every time
                they compare options.
              </p>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Build instant trust with people comparing gyms in your area.</li>
                <li>• Make it clear your listing is the official, up-to-date one.</li>
                <li>• Reward for complete, accurate profiles that stay active.</li>
              </ul>
            </div>
            <Card className='p-5 space-y-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                What members see
              </p>
              <div className='rounded-2xl border bg-muted/40 p-4 flex items-center justify-between gap-4'>
                <div>
                  <p className='text-sm font-semibold'>Peak Performance Barbell Club</p>
                  <p className='text-xs text-muted-foreground'>
                    Verified business • Updated this week
                  </p>
                </div>
                <Badge className='rounded-full bg-emerald-500 text-xs text-emerald-50 px-3 py-1'>
                  Verified
                </Badge>
              </div>
              <p className='text-xs text-muted-foreground'>
                Profiles with the Verified badge get more clicks, more trial
                requests, and a higher chance of being shortlisted.
              </p>
            </Card>
          </div>
        </section>

        {/* Section 6: Dashboard Preview */}
        <section className='space-y-6'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
              A dashboard built for busy gym owners.
            </h2>
            <p className='text-muted-foreground'>
              See how people discover your gym, manage reviews, and keep pricing
              accurate — all from one simple place.
            </p>
          </div>
          <Card className='p-6 md:p-8 bg-gradient-to-br from-background via-muted/60 to-background border border-border/60'>
            <div className='grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]'>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-semibold'>Gymdues owner dashboard</p>
                    <p className='text-xs text-muted-foreground'>
                      Overview • Last 30 days
                    </p>
                  </div>
                  <Badge variant='outline' className='text-xs'>
                    Live preview
                  </Badge>
                </div>
                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-xl bg-background p-3 shadow-sm'>
                    <p className='text-xs text-muted-foreground'>Profile views</p>
                    <p className='text-2xl font-semibold'>1,248</p>
                    <p className='text-xs text-emerald-600'>+32% vs. last month</p>
                  </div>
                  <div className='rounded-xl bg-background p-3 shadow-sm'>
                    <p className='text-xs text-muted-foreground'>Clicks to website</p>
                    <p className='text-2xl font-semibold'>312</p>
                    <p className='text-xs text-emerald-600'>+18% vs. last month</p>
                  </div>
                  <div className='rounded-xl bg-background p-3 shadow-sm'>
                    <p className='text-xs text-muted-foreground'>Trial requests</p>
                    <p className='text-2xl font-semibold'>47</p>
                    <p className='text-xs text-emerald-600'>+3.1% conversion</p>
                  </div>
                </div>
                <div className='rounded-xl bg-background p-3 shadow-sm space-y-2'>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Quick-start checklist
                  </p>
                  <ul className='space-y-1 text-xs text-muted-foreground'>
                    <li>✓ Add membership plans and pricing</li>
                    <li>✓ Upload photos of your space</li>
                    <li>• Respond to 3 new reviews</li>
                    <li>• Turn on trial request notifications</li>
                  </ul>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='rounded-xl bg-background p-3 shadow-sm space-y-3'>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Review responses
                  </p>
                  <div className='space-y-3'>
                    <div className='rounded-lg border bg-muted/40 p-3'>
                      <p className='text-xs font-semibold mb-1'>
                        &ldquo;Great staff and clean facility.&rdquo;
                      </p>
                      <p className='text-xs text-muted-foreground mb-1'>
                        — 5-star review from Alex, 3 days ago
                      </p>
                      <p className='text-xs text-foreground'>
                        Your reply:{' '}
                        <span className='text-muted-foreground'>
                          &ldquo;Thanks Alex! We appreciate you training with us.&rdquo;
                        </span>
                      </p>
                    </div>
                    <div className='rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground'>
                      Draft a response to &ldquo;Wish there were more 6am
                      classes.&rdquo; and publish it in one click.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 7: B2B Trust Signals */}
        <section className='space-y-8'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
              Trusted by gyms of every size.
            </h2>
            <p className='text-muted-foreground'>
              From single-location studios to national chains, owners use Gymdues
              to keep their listings accurate and convert more online interest into
              memberships.
            </p>
          </div>
          <div className='grid gap-6 md:grid-cols-3'>
            <Card className='p-5'>
              <p className='text-3xl font-semibold mb-1'>60K+</p>
              <p className='text-sm text-muted-foreground'>
                gyms and studios tracked across the U.S.
              </p>
            </Card>
            <Card className='p-5'>
              <p className='text-3xl font-semibold mb-1'>500K+</p>
              <p className='text-sm text-muted-foreground'>
                monthly searches from people comparing gyms.
              </p>
            </Card>
            <Card className='p-5'>
              <p className='text-3xl font-semibold mb-1'>50K+</p>
              <p className='text-sm text-muted-foreground'>
                clicks and trial requests driven to gym websites each month.
              </p>
            </Card>
          </div>
          <Card className='p-6 md:p-8'>
            <div className='grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center'>
              <blockquote className='border-l-4 border-primary/60 pl-4 md:pl-6 space-y-3'>
                <p className='text-sm md:text-base text-muted-foreground'>
                  &ldquo;Updating our pricing and responding to reviews on Gymdues
                  helped us turn more online searches into actual tours. It takes a
                  few minutes a week and pays for itself every month.&rdquo;
                </p>
                <footer className='text-xs text-foreground'>
                  — Gym owner, multi-location training studio
                </footer>
              </blockquote>
              <div className='space-y-3 text-sm text-muted-foreground'>
                <p className='font-semibold text-foreground'>
                  Built for the broader fitness ecosystem
                </p>
                <p>
                  Data from Gymdues also powers tools for franchise development,
                  equipment suppliers, and software companies — giving your gym
                  broader visibility across the industry.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 8: Multi-location / Chain CTA */}
        <section className='space-y-6'>
          <Card className='p-6 md:p-8 bg-primary/5 border-primary/20'>
            <div className='grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center'>
              <div>
                <h2 className='text-2xl font-semibold mb-2'>
                  Managing 5+ locations? Get Premium for your whole portfolio.
                </h2>
                <p className='text-sm text-muted-foreground mb-3'>
                  Keep branding, pricing, and promotions consistent across your
                  locations — with Premium tools for each. We offer custom pricing
                  for multi-location and franchise accounts.
                </p>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>• Centralized control for brand and pricing</li>
                  <li>• Location-level access for local managers</li>
                  <li>• Chain-level reporting on views, clicks, and leads</li>
                </ul>
              </div>
              <div className='space-y-3'>
                <Button className='w-full' size='lg' variant='outline' asChild>
                  <a href='/contact'>Contact us for Premium pricing</a>
                </Button>
                <p className='text-xs text-muted-foreground text-center'>
                  Ideal for franchises, regional chains, and multi-location owners.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Section 9: Final CTA + FAQ */}
        <section className='space-y-10'>
          <Card className='p-6 md:p-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-xl space-y-2'>
              <h2 className='text-2xl md:text-3xl font-semibold'>
                Ready to take control of your gym&apos;s online presence?
              </h2>
              <p className='text-muted-foreground'>
                Claim your gym on Gymdues and start turning more searches into new
                members — free in just a few minutes.
              </p>
            </div>
            <div className='w-full max-w-md space-y-3'>
              <GymOwnerClaimCta searchSize='md' />
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1.5 pt-1'>
                <p className='text-xs text-muted-foreground text-center sm:text-left inline-flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-start gap-x-1.5'>
                  <span className='whitespace-nowrap'>Already claimed?</span>
                  <a
                    href='/dashboard/auth/login'
                    className='inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:border-primary/50 transition-colors whitespace-nowrap'
                  >
                    <LogIn className='h-3.5 w-3.5' aria-hidden />
                    Sign in to your dashboard
                  </a>
                </p>
              </div>
            </div>
          </Card>
          {/* FAQ – same card style as /gymsdata, with JS and no-JS modes */}
          <section
            className='max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'
            aria-labelledby='faq-heading'
          >
            <div className='p-6 md:p-8 pb-4'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                  <HelpCircle className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h2 id='faq-heading' className='text-lg font-semibold text-foreground md:text-xl'>
                    Frequently asked questions
                  </h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Quick answers about claiming your gym, verification, and how Free vs Premium works for owners.
                  </p>
                </div>
              </div>
            </div>

            {/* JS: Radix accordion UI */}
            <div className='js-only w-full px-6 md:px-8 pb-6'>
              <FaqAccordion />
            </div>

            {/* No-JS: native <details> so questions can still be opened */}
            <div className='no-js-only w-full px-6 md:px-8 pb-6 text-sm'>
              <details className='border-t border-border/60' open>
                <summary className='cursor-pointer list-none font-semibold py-4 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  Is it really free to claim my gym?
                </summary>
                <div className='text-muted-foreground leading-relaxed pb-4'>
                  Yes. Claiming your gym and managing your basic listing is completely free. You can
                  update your info, respond to reviews, and see basic analytics without paying.
                  Premium tools are optional.
                </div>
              </details>
              <details className='border-t border-border/60'>
                <summary className='cursor-pointer list-none font-semibold py-4 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  What if someone already claimed my gym?
                </summary>
                <div className='text-muted-foreground leading-relaxed pb-4'>
                  If you believe your gym has been claimed by someone who isn&apos;t authorized, you
                  can request an ownership review during the claim process. Our team will verify
                  documentation and help transfer the listing to the rightful owner.
                </div>
              </details>
              <details className='border-t border-border/60'>
                <summary className='cursor-pointer list-none font-semibold py-4 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  How long does verification take?
                </summary>
                <div className='text-muted-foreground leading-relaxed pb-4'>
                  For most owners, verification is instant or completed within a few minutes via
                  email or phone. In some cases, it may take up to 1–2 business days if additional
                  documents are needed.
                </div>
              </details>
              <details className='border-t border-border/60'>
                <summary className='cursor-pointer list-none font-semibold py-4 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  Do I need a credit card to get started?
                </summary>
                <div className='text-muted-foreground leading-relaxed pb-4'>
                  No. You can claim your gym and use the free tools without entering any payment
                  details. You&apos;ll only add a card if you choose to upgrade to Premium.
                </div>
              </details>
              <details className='border-t border-border/60'>
                <summary className='cursor-pointer list-none font-semibold py-4 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  Can I manage more than one location?
                </summary>
                <div className='text-muted-foreground leading-relaxed pb-4'>
                  Yes. You can claim and manage multiple locations from the same account. Premium
                  includes tools designed for franchises and chains.
                </div>
              </details>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}

