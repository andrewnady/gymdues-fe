import type { Metadata } from 'next'
import { CheckCircle2, MapPin, LogIn } from 'lucide-react'
import { GymOwnerClaimCta } from './_components/gym-owner-claim-cta'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaqAccordion } from './_components/faq-accordion'

const title = 'For Gym Owners Page | GymDues'
const description =
  'Claim your gym on Gymdues in minutes. Update pricing, respond to reviews, see competitor insights, and turn profile views into new members.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForGymOwnersPage() {
  return (
    <main className='min-h-screen bg-background'>
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
                <GymOwnerClaimCta searchSize='md' />
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-border/60'>
                  <p className='text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1'>
                    <span className='inline-flex items-center gap-1.5'>
                      <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' aria-hidden />
                      Under 5 minutes
                    </span>
                    <span className='text-muted-foreground/60' aria-hidden>·</span>
                    <span>No credit card required</span>
                    <span className='text-muted-foreground/60' aria-hidden>·</span>
                    <span>Can&apos;t find your gym? Add a new location in the claim flow.</span>
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
                  <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90 mb-3'>
                    What you control
                  </p>
                  <ul className='space-y-2.5 text-sm text-muted-foreground'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Membership pricing, hours, and amenities</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Photos, branding, and featured offers</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle2 className='h-4 w-4 shrink-0 text-primary/80 mt-0.5' />
                      <span>Review responses and Q&amp;A</span>
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

        {/* Section 2: Membership for Gyms – What You Get */}
        <section className='space-y-6'>
          <div className='max-w-2xl'>
            <h2 className='text-2xl md:text-3xl font-semibold mb-2'>
              A membership built for gyms, not just members.
            </h2>
            <p className='text-muted-foreground'>
              This page is about what Gymdues does for <span className='font-medium text-foreground'>your business</span>:
              claim control, list your gym, upgrade to Premium, and unlock pricing
              intelligence on your competitors.
            </p>
          </div>
          <div className='grid gap-4 md:grid-cols-4'>
            <Card className='p-5 space-y-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                1
              </span>
              <h3 className='font-semibold text-base'>Claim your gym</h3>
              <p className='text-sm text-muted-foreground'>
                Take ownership of your existing Gymdues listing so you control
                pricing, photos, reviews, and how you appear in search.
              </p>
            </Card>
            <Card className='p-5 space-y-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                2
              </span>
              <h3 className='font-semibold text-base'>List your gym</h3>
              <p className='text-sm text-muted-foreground'>
                Add missing locations or new openings so people can actually find
                you when they compare membership options in your area.
              </p>
            </Card>
            <Card className='p-5 space-y-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                3
              </span>
              <h3 className='font-semibold text-base'>Go Premium</h3>
              <p className='text-sm text-muted-foreground'>
                Unlock priority placement, richer leads, and conversion tools that
                turn profile views into tours, trials, and new memberships.
              </p>
            </Card>
            <Card className='p-5 space-y-2'>
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary'>
                4
              </span>
              <h3 className='font-semibold text-base'>Intelligence pricing tool</h3>
              <p className='text-sm text-muted-foreground'>
                Use our hidden pricing intelligence from Gymdues data to benchmark
                your rates against nearby competitors and spot smart pricing moves.
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
            <h2 className='text-2xl md:text-3xl font-semibold'>
              Start free. Upgrade to Premium when you&apos;re ready.
            </h2>
            <p className='text-sm md:text-base text-muted-foreground'>
              We offer two options: free listing management, or Premium for more visibility and
              tools. No other tiers — just Free and Premium.
            </p>
          </div>

          <div className='relative'>
            <div className='pointer-events-none absolute inset-x-0 -inset-y-10 md:-inset-y-14 bg-gradient-to-b from-primary/5 via-background to-background' />
            <div className='relative max-w-5xl mx-auto'>
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
                      <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
                        <li>• Edit hours, amenities, photos, and membership details</li>
                        <li>• Respond to reviews and member questions</li>
                        <li>• Basic analytics on profile views and clicks</li>
                        <li>• Appear in local search results on GymDues</li>
                      </ul>
                    </div>
                    <Button className='mt-6 w-full' size='lg' variant='outline'>
                      Claim your gym free
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
                          <h3 className='text-xl font-semibold mt-1'>Premium growth tools</h3>
                        </div>
                        <div className='text-right'>
                          <p className='text-3xl font-semibold text-foreground'>$49</p>
                          <p className='text-xs text-muted-foreground'>per location / month</p>
                        </div>
                      </div>

                      <p className='text-xs sm:text-sm font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200 rounded-xl px-3 py-2'>
                        Gym owners on Premium get <span className='font-semibold'>3× more profile clicks</span> on average.
                      </p>

                      <div className='grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground mt-1'>
                        <ul className='space-y-2'>
                          <li>• Priority placement in GymDues search results</li>
                          <li>• Competitor pricing insights in your local market</li>
                          <li>• Lead contact details for trial and tour requests</li>
                        </ul>
                        <ul className='space-y-2'>
                          <li>• Booking &amp; trial request management tools</li>
                          <li>• Promotional banners for time-limited offers</li>
                          <li>• Bulk location management for franchises and chains</li>
                        </ul>
                      </div>
                    </div>

                    <div className='mt-6 space-y-2'>
                      <Button className='w-full' size='lg'>
                        Upgrade to Premium
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

          <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start'>
            <div>
              <h2 className='text-xl md:text-2xl font-semibold mb-2'>
                Frequently asked questions
              </h2>
              <p className='text-sm text-muted-foreground'>
                Answers to common questions from gym owners and operators.
              </p>
              <FaqAccordion />
            </div>
            <div className='space-y-4 text-sm text-muted-foreground'>
              <Card className='p-5 space-y-2'>
                <p className='text-xs font-semibold text-muted-foreground'>
                  SEO title target
                </p>
                <p className='text-sm font-medium text-foreground'>
                  Gym Owner Tools &amp; Listing Management | Gymdues
                </p>
                <p className='text-xs'>
                  Optimized to capture &ldquo;gym owners&rdquo; and &ldquo;gym
                  listing management&rdquo; searches while staying natural and
                  click-worthy.
                </p>
              </Card>
              <p className='text-xs text-muted-foreground'>
                In the main site navigation, make sure &ldquo;Claim your gym&rdquo;
                is visible as a primary call-to-action so owners can always get
                back to this page.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

