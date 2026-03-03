import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { getListPageData } from '@/lib/gyms-api'
import { ListingByStateSection } from '@/usa-list/components/listing-by-state-section'
import { UsaMapOrTableSection } from '@/usa-list/components/usa-map-or-table-section'
import { GymsByStateTable } from '@/usa-list/components/gyms-by-state-table'
import {
  Globe2,
  MapPin,
  ArrowRightCircle,
  DollarSign,
  ListOrdered,
  Star,
  Building2,
  Search,
  Filter,
  Table2,
  HelpCircle,
  Info,
  TrendingUp,
  BarChart2,
  Gift,
  Megaphone,
  Code,
  Package,
  ChevronRight,
} from 'lucide-react'
import { usaListPageFaqs } from '@/usa-list/data/usa-list-page-faqs'
import { UsaListStateComparison } from '@/usa-list/components/usa-list-state-comparison'
import { UsaListFilterPanel } from '@/usa-list/components/usa-list-filter-panel'
import { UsaListStickyCta } from '@/usa-list/components/usa-list-sticky-cta'
import { TopCitiesTable } from '@/usa-list/components/top-cities-table'
import { DistributionByLocationChips } from '@/usa-list/components/distribution-by-location-chips'
import { CheckCircle2, Download } from 'lucide-react'
import { stateGymsdataPath } from '@/lib/gymsdata-utils'
import { DownloadSampleButton } from '@/components/download-sample-button'
import { ExitIntentPopup } from '@/components/exit-intent-popup'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { GymsdataStatesSortLinks } from './_components/gymsdata-states-sort-links'
import { StateByStateComparisonTable } from './_components/state-by-state-comparison-table'
import { buildStateComparisonRows } from './_data/state-comparison-stats'
import { GymsdataHeroBanner } from './_components/gymsdata-hero-banner'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = new URL('/gymsdata/', siteUrl).toString()
  const title = 'Complete List of Gyms in United States - Verified Contact Database 2026 | Gymdues'
  const description =
    '60K+ verified gym contacts vs. competitors. Complete list of gyms in the United States by state & city. Phone numbers, emails, interactive map. Download free sample or buy full database. Updated weekly.'

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': canonicalUrl,
        'x-default': canonicalUrl,
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
      url: canonicalUrl,
      siteName: 'GymDues',
      type: 'website',
      images: [
        {
          url: `${siteUrl}/images/bg-header.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/images/bg-header.jpg`],
      creator: '@gymdues',
      site: '@gymdues',
    },
  }
}

type PageProps = { searchParams?: Promise<{ sort?: string }> }

export default async function GymsdataPage({ searchParams }: PageProps) {
  const { states, locations } = await getListPageData()
  const totalGyms = states.reduce((sum, state) => sum + (state.count || 0), 0)
  const totalStates = states.length
  const params = await searchParams
  const sortBy = params?.sort === 'name' ? 'name' : 'count'
  const sortedStates =
    sortBy === 'name'
      ? [...states].sort((a, b) => (a.stateName ?? '').localeCompare(b.stateName ?? ''))
      : [...states].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  const topCities = locations.slice(0, 10)
  const top10States = sortedStates.slice(0, 10)
  const maxStateCount = top10States[0]?.count ?? 1
  const stateComparisonRows = buildStateComparisonRows(sortedStates)

  // Last Monday (data updated weekly) – same date used everywhere
  const now = new Date()
  const daysSinceMonday = (now.getDay() + 6) % 7
  const lastMonday = new Date(now)
  lastMonday.setDate(now.getDate() - daysSinceMonday)
  lastMonday.setHours(0, 0, 0, 0)
  const lastUpdateDateStr = lastMonday.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const schemaDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Complete List of Gyms in United States - Verified Contact Database 2026',
    description: `60K+ verified gym contacts. ${totalGyms.toLocaleString('en-US')}+ gyms across ${totalStates} states. Phone numbers, emails, state & city. Updated weekly.`,
    url: `${siteUrl}/gymsdata/`,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: {
      '@type': 'Organization',
      name: 'Gymdues',
      url: siteUrl,
      logo: `${siteUrl}/images/logo.svg`,
    },
  }
  const schemaOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gymdues',
    url: siteUrl,
    logo: `${siteUrl}/images/logo.svg`,
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'List of Gyms in United States', item: `${siteUrl}/gymsdata/` },
    ],
  }

  return (
    <div className='min-h-screen bg-background'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaDataset) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <div className='container mx-auto px-4 py-12 lg:py-16 pb-24'>
        {/* Breadcrumb */}
        <nav className='max-w-6xl mx-auto mb-6 text-sm text-muted-foreground' aria-label='Breadcrumb'>
          <ol className='flex flex-wrap items-center gap-1'>
            <li><Link href='/' className='hover:text-primary'>Home</Link></li>
            <li aria-hidden>/</li>
            <li className='text-foreground font-medium'>List of Gyms in United States</li>
          </ol>
        </nav>

        {/* No-JS: friendly notice – all content works */}
        <div className='no-js-only max-w-6xl mx-auto mb-6'>
          <p className='rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground'>
            <strong>Full experience without JavaScript.</strong> All links and the full table work. Browse by state above and use the table below.
          </p>
        </div>

        {/* Hero Banner – white background, badge + heading + paragraph + CTA, image right */}
        <div className='max-w-6xl mx-auto mb-8'>
          <GymsdataHeroBanner />
        </div>

        {/* Overview strip – local gyms data + why choose section (inspired by GymsListsHQ) */}
        <section className='max-w-6xl mx-auto mb-10 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
          {/* Left: data-backed promise */}
          <div className='rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7 shadow-[0_14px_35px_rgba(16,185,129,0.15)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-900 mb-2 flex items-center gap-2'>
              <span className='inline-block h-2 w-2 rounded-full bg-emerald-500' />
              Gyms &amp; Fitness Data Platform
            </p>
            <h2 className='text-xl sm:text-[1.45rem] lg:text-[1.65rem] font-semibold tracking-tight text-foreground mb-3'>
              Verified, High-Quality Gyms &amp; Fitness Leads Across the US
            </h2>
            <p className='text-sm text-emerald-900/85 mb-4 leading-relaxed max-w-xl'>
              Built from local gym listings, member reviews, and first‑party research. Every row in the
              GymDues database is tied to a real gym location you can contact and close.
            </p>

            <div className='mt-4 grid grid-cols-2 gap-3 sm:gap-4 max-w-md'>
              <div className='rounded-xl bg-white/90 px-3 py-3 shadow-sm border border-emerald-100'>
                <p className='text-xs font-medium text-muted-foreground mb-1'>Gyms &amp; fitness locations</p>
                <p className='text-lg sm:text-xl font-semibold text-emerald-700 tabular-nums'>
                  {totalGyms.toLocaleString('en-US')}
                </p>
              </div>
              <div className='rounded-xl bg-white/90 px-3 py-3 shadow-sm border border-emerald-100'>
                <p className='text-xs font-medium text-muted-foreground mb-1'>States covered</p>
                <p className='text-lg sm:text-xl font-semibold text-emerald-700 tabular-nums'>
                  {totalStates}
                </p>
              </div>
              <div className='rounded-xl bg-emerald-900 text-emerald-50 px-3 py-3 col-span-2 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-200'>
                    Data freshness
                  </p>
                  <p className='text-xs sm:text-[0.8rem]'>
                    Updated weekly – last pass on{' '}
                    <span className='font-semibold text-white'>{lastUpdateDateStr}</span>
                  </p>
                </div>
                <CheckCircle2 className='h-5 w-5 flex-shrink-0 text-emerald-300' aria-hidden />
              </div>
            </div>
          </div>

          {/* Right: why choose GymDues – compact card list */}
          <aside className='rounded-2xl border border-border/70 bg-card/95 px-5 py-5 sm:px-6 sm:py-6 shadow-[0_14px_35px_rgba(15,23,42,0.18)]'>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <h3 className='text-sm font-semibold text-foreground'>Why Choose GymDues Data</h3>
              <div className='flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-900'>
                <span className='inline-block h-1.5 w-1.5 rounded-full bg-emerald-500' />
                US‑focused
              </div>
            </div>
            <div className='space-y-3'>
              <div className='flex items-start gap-3 rounded-xl bg-background/80 px-3.5 py-3'>
                <div className='mt-0.5'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-500' aria-hidden />
                </div>
                <div>
                  <p className='text-xs font-semibold text-foreground mb-0.5'>Decision‑maker ready</p>
                  <p className='text-[11px] text-muted-foreground'>
                    Owner / GM contact details whenever available, not just front‑desk numbers.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-xl bg-background/80 px-3.5 py-3'>
                <div className='mt-0.5'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-500' aria-hidden />
                </div>
                <div>
                  <p className='text-xs font-semibold text-foreground mb-0.5'>Signals for smarter targeting</p>
                  <p className='text-[11px] text-muted-foreground'>
                    Equipment brands, software stack, membership pricing, and ratings where we can detect them.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-xl bg-background/80 px-3.5 py-3'>
                <div className='mt-0.5'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-500' aria-hidden />
                </div>
                <div>
                  <p className='text-xs font-semibold text-foreground mb-0.5'>Built for revenue teams</p>
                  <p className='text-[11px] text-muted-foreground'>
                    Clean CSV exports, clear definitions, and segments that map to how sales &amp; marketing work.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Sort + secondary CTAs + social proof */}
        <div className='max-w-4xl mx-auto text-center mb-10'>
          {/* Page-wide sort: applies to map, table, filter, distribution, all sections */}
          {sortedStates.length > 0 && (
            <div className='mb-6 flex flex-wrap items-center justify-center gap-3'>
              <Suspense fallback={<div className='h-9' />}>
                <GymsdataStatesSortLinks />
              </Suspense>
              <span className='text-xs text-muted-foreground max-w-md text-center'>
                Applies to all state lists, map, and table on this page
              </span>
            </div>
          )}
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Link
              href='/gymsdata/dataset'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary/10 px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-all'
            >
              Buy Full Database
              <ArrowRightCircle className='h-4 w-4' />
            </Link>
            <Link
              href='#states-table'
              className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted hover:border-primary/30 transition-all'
            >
              <Table2 className='h-4 w-4' />
              View full table
            </Link>
          </div>
          <p className='mt-6 text-sm text-muted-foreground'>
            ★★★★★ 4.8/5 from 300+ reviews · 1,247 businesses downloaded this month
          </p>
          {/* Internal links: browse by state & city (state pages open cities) */}
          <div className='mt-8 pt-6 border-t border-border/60'>
            <p className='text-sm font-medium text-muted-foreground mb-2'>
              Browse by state & city
            </p>
            <p className='text-xs text-muted-foreground mb-3'>
              Open a state to see cities, then open a city for the full contact list.
            </p>
            <Link
              href='/gymsdata/'
              className='inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 mb-3'
            >
              <MapPin className='h-4 w-4' />
              All states
            </Link>
            <div className='flex flex-wrap gap-2'>
              {sortedStates.slice(0, 12).map((s) => (
                <Link
                  key={s.state}
                  href={stateGymsdataPath(s)}
                  className='inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted hover:border-primary/40'
                >
                  {s.stateName}
                  <span className='tabular-nums text-muted-foreground text-xs'>({s.count.toLocaleString('en-US')})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics cards – dataset overview */}
        <section className='max-w-6xl mx-auto mb-12' aria-label='Dataset metrics'>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
            <Link
              href='#how-many'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>
                {totalGyms.toLocaleString('en-US')}
              </p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                Total gyms
              </p>
            </Link>
            <Link
              href='#us-map'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>
                {totalStates}
              </p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                States covered
              </p>
            </Link>
            <Link
              href='/gymsdata/'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>—</p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                % with phone
              </p>
            </Link>
            <Link
              href='/gymsdata/'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>—</p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                % with website
              </p>
            </Link>
            <Link
              href='/gymsdata/'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>—</p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                % with email
              </p>
            </Link>
            <Link
              href='#us-map'
              className='rounded-xl border border-border/80 bg-card px-3 py-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md'
            >
              <p className='text-2xl md:text-3xl font-bold text-primary tabular-nums'>—</p>
              <p className='text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1'>
                % with geo
              </p>
            </Link>
          </div>
        </section>

        {/* Data & use cases – enhanced section with clear CTAs and relation to main site */}
        <section
          id='use-cases-heading'
          className='max-w-6xl mx-auto mb-16 rounded-2xl border border-border/60 bg-muted/20 px-5 py-8 md:px-8 md:py-10'
          aria-labelledby='data-use-cases-title'
        >
          <div className='text-center mb-8'>
            <Link href='/' className='inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary mb-3'>
              <Globe2 className='h-3.5 w-3.5' aria-hidden />
              Part of Gymdues
            </Link>
            <h2 id='data-use-cases-title' className='text-2xl md:text-3xl font-bold tracking-tight mb-2'>
              Data & use cases
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Interactive tools and dedicated guides for marketing agencies, software companies, equipment suppliers, and franchise development.
            </p>
          </div>

          <div className='mb-8'>
            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>Interactive tools</p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              <Link
                href='/gymsdata/trends'
                className='group flex flex-col rounded-xl border-2 border-primary/40 bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                    <TrendingUp className='h-5 w-5' aria-hidden />
                  </div>
                  <span className='rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary'>Interactive</span>
                </div>
                <h3 className='font-semibold text-foreground mb-1.5'>Growth Trends Dashboard</h3>
                <p className='text-sm text-muted-foreground flex-1'>New gyms timeline, most growing cities, fastest growing categories, franchise vs independent.</p>
                <span className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all'>
                  View dashboard
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </span>
              </Link>
              <Link
                href='/gymsdata/competitive-intelligence'
                className='group flex flex-col rounded-xl border-2 border-primary/40 bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                    <BarChart2 className='h-5 w-5' aria-hidden />
                  </div>
                  <span className='rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary'>Interactive</span>
                </div>
                <h3 className='font-semibold text-foreground mb-1.5'>Competitive Intelligence Tool</h3>
                <p className='text-sm text-muted-foreground flex-1'>Enter target market and radius. See total gyms, market leaders, gap opportunities, avg price, saturation score.</p>
                <span className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all'>
                  Try tool
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </span>
              </Link>
              <Link
                href='/gymsdata/sample-data'
                className='group flex flex-col rounded-xl border-2 border-primary/40 bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                    <Gift className='h-5 w-5' aria-hidden />
                  </div>
                  <span className='rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary'>Lead magnet</span>
                </div>
                <h3 className='font-semibold text-foreground mb-1.5'>Free sample data tiers</h3>
                <p className='text-sm text-muted-foreground flex-1'>Tier 1: 100 gyms (email). Tier 2: 500 from state (form). Tier 3: 1,000 + social (consultation).</p>
                <span className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all'>
                  Get samples
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </span>
              </Link>
            </div>
          </div>

          <div>
            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>Guides by role</p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Link
                href='/gymsdata/for-marketing-agencies'
                className='group flex rounded-xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200'
              >
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary mr-3 transition-colors'>
                  <Megaphone className='h-4 w-4' aria-hidden />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors'>For marketing agencies</h3>
                  <p className='text-xs text-muted-foreground'>Email campaigns, cold calling, direct mail. Testimonials and bulk pricing.</p>
                  <span className='mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                    See guide <ChevronRight className='h-3.5 w-3.5' />
                  </span>
                </div>
              </Link>
              <Link
                href='/gymsdata/for-software-companies'
                className='group flex rounded-xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200'
              >
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary mr-3 transition-colors'>
                  <Code className='h-4 w-4' aria-hidden />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors'>For software companies</h3>
                  <p className='text-xs text-muted-foreground'>Sell gym management software. Filter gyms without websites, integration guides.</p>
                  <span className='mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                    See guide <ChevronRight className='h-3.5 w-3.5' />
                  </span>
                </div>
              </Link>
              <Link
                href='/gymsdata/for-equipment-suppliers'
                className='group flex rounded-xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200'
              >
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary mr-3 transition-colors'>
                  <Package className='h-4 w-4' aria-hidden />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors'>For equipment suppliers</h3>
                  <p className='text-xs text-muted-foreground'>Reach gym owners upgrading equipment. Gym age, seasonal buying patterns.</p>
                  <span className='mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                    See guide <ChevronRight className='h-3.5 w-3.5' />
                  </span>
                </div>
              </Link>
              <Link
                href='/gymsdata/for-franchise-development'
                className='group flex rounded-xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200'
              >
                <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary mr-3 transition-colors'>
                  <MapPin className='h-4 w-4' aria-hidden />
                </div>
                <div className='min-w-0'>
                  <h3 className='font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors'>For franchise development</h3>
                  <p className='text-xs text-muted-foreground'>Underserved markets, market saturation and competitor gap analysis.</p>
                  <span className='mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity'>
                    See guide <ChevronRight className='h-3.5 w-3.5' />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* How many gyms are there in the United States? */}
        <section
          id='how-many'
          className='max-w-4xl mx-auto mb-16 rounded-2xl border bg-primary/5 px-6 py-8 md:px-8 md:py-10'
        >
          <h2 className='text-xl md:text-2xl font-semibold text-center mb-2'>
            How many gyms are there in the United States?
          </h2>
          <p className='text-4xl md:text-5xl font-bold text-primary text-center mb-2'>
            {totalGyms.toLocaleString('en-US')}
          </p>
          <p className='text-sm text-muted-foreground text-center mb-6'>
            Gyms in the United States on Gymdues. Browse by state, city, or zip to compare membership
            prices and plans.
          </p>
          <div className='flex justify-center'>
            <Link
              href='/gymsdata/'
              className='inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90'
            >
              Browse all U.S. gyms
              <ArrowRightCircle className='h-4 w-4' />
            </Link>
          </div>
        </section>

        {/* Filter by location – no-JS: single "Browse by state" card (merged) */}
        {sortedStates.length > 0 && (
          <div id='filter-by-location-heading'>
            <div className='js-only'>
              <UsaListFilterPanel sortedStates={sortedStates} totalGyms={totalGyms} />
            </div>
            <div className='no-js-only max-w-6xl mx-auto mb-12'>
              <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
                <div className='px-5 py-4 md:px-6 md:py-5 border-b border-border/60 bg-muted/30'>
                  <h2 className='text-xl md:text-2xl font-semibold'>
                    Browse by state
                  </h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Click a state to open the gyms directory filtered for that state. Full table below.
                  </p>
                </div>
                <div className='p-5 md:p-6'>
                  <div className='flex flex-wrap gap-2'>
                    {sortedStates.map((s) => (
                      <Link
                        key={s.state}
                        href={stateGymsdataPath(s)}
                        className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors'
                      >
                        {s.stateName}
                        <span className='tabular-nums text-muted-foreground'>({s.count.toLocaleString('en-US')})</span>
                      </Link>
                    ))}
                  </div>
                  <div className='mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center gap-4'>
                    <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline'>
                      <Table2 className='h-4 w-4' />
                      View full table
                    </Link>
                    <Link href='/gymsdata/' className='text-sm font-medium text-muted-foreground hover:text-primary hover:underline'>
                      Browse all U.S. gyms
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How Gymdues helps you find gyms – 4 cards */}
        <section className='max-w-6xl mx-auto mb-16'>
          <h2 className='text-2xl md:text-3xl font-semibold text-center mb-6'>
            How Gymdues helps you find gyms
          </h2>
          <p className='text-muted-foreground text-center max-w-2xl mx-auto mb-8'>
            Use the list and map to explore gyms by state and city, then compare membership prices,
            plans, and fees in one place.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <DollarSign className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Compare membership prices</h3>
              <p className='text-sm text-muted-foreground'>
                See monthly costs, plans, and common fees by gym and location before you join.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <MapPin className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Browse by state & city</h3>
              <p className='text-sm text-muted-foreground'>
                Filter the list by state or city and use the map to see where gyms are concentrated.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <ListOrdered className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>See plans & fees</h3>
              <p className='text-sm text-muted-foreground'>
                Each gym profile shows membership tiers, initiation fees, and annual fees in one
                place.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <Star className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Read reviews</h3>
              <p className='text-sm text-muted-foreground'>
                Check ratings and real reviews from members to choose a gym that fits your goals.
              </p>
            </div>
          </div>
        </section>

        {/* U.S. gyms map by state – switch between map and table (same section) */}
        <section id='us-map' className='max-w-6xl mx-auto mb-16' aria-labelledby='us-map-heading'>
          <h2 id='us-map-heading' className='text-2xl md:text-3xl font-semibold mb-2'>
            U.S. gyms map by state
          </h2>
          <p className='text-sm text-muted-foreground mb-6'>
            See where gyms are concentrated or view the full table. Switch between Map and Table below.
          </p>
          <div className='js-only'>
            <UsaMapOrTableSection sortedStates={sortedStates} totalGyms={totalGyms} />
          </div>
          {/* No-JS: Map tab + Table tab — both visible (same as JS Map/Table tabs) */}
          <div className='no-js-only space-y-6'>
            <div className='flex rounded-xl border border-border/80 bg-muted/30 p-1' role='tablist' aria-label='Map and Table view'>
              <span className='flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-primary/10 text-primary'>
                <MapPin className='h-4 w-4 shrink-0' />
                Map
              </span>
              <span className='flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium bg-background shadow-sm'>
                <Table2 className='h-4 w-4 shrink-0' />
                Table
              </span>
            </div>
            {/* Map view card */}
            <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
              <div className='px-5 py-4 md:px-6 border-b border-border/60 bg-muted/30'>
                <h3 className='font-semibold flex items-center gap-2'>
                  <MapPin className='h-5 w-5 text-primary shrink-0' />
                  Map view — browse by state
                </h3>
                <p className='text-sm text-muted-foreground mt-1'>
                  Click a state to browse gyms there.
                </p>
              </div>
              <div className='p-5 md:p-6'>
                <div className='flex flex-wrap gap-2'>
                  {sortedStates.map((s) => (
                    <Link
                      key={s.state}
                      href={stateGymsdataPath(s)}
                      className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors'
                    >
                      {s.stateName}
                      <span className='tabular-nums text-muted-foreground'>({s.count.toLocaleString('en-US')})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* Table view card — table tab content when JS disabled */}
            <div className='rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
              <div className='px-5 py-4 md:px-6 border-b border-border/60 bg-muted/30'>
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div>
                    <h3 className='font-semibold flex items-center gap-2'>
                      <Table2 className='h-5 w-5 text-primary shrink-0' />
                      Table view — gym counts by state
                    </h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Full list with gym counts. Click a state or View gyms to browse.
                    </p>
                  </div>
                  <details className='[&::-webkit-details-marker]:hidden' aria-label='Table details'>
                    <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                      <Info className='h-4 w-4 shrink-0' aria-hidden />
                      <span>Details</span>
                    </summary>
                    <p id='nojs-map-table-details' className='mt-2 text-sm text-muted-foreground max-w-xl' role='region' aria-label='Table description'>
                      This table lists gym counts by U.S. state. Columns: rank (#), state name (links to state directory), state code, gym count, share of total, and view gyms action. Data is updated weekly.
                    </p>
                  </details>
                </div>
              </div>
              <div className='p-5 md:p-6 overflow-x-auto'>
                <table className='min-w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60'>
                    <tr>
                      <th className='px-4 py-3 font-medium text-muted-foreground w-12 text-center'>#</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground'>State</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell w-16'>Code</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground text-right w-24'>Gyms</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground text-right hidden md:table-cell w-20'>%</th>
                      <th className='px-4 py-3 text-right w-24'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStates.map((state, idx) => {
                      const pct = totalGyms > 0 ? ((state.count / totalGyms) * 100).toFixed(1) : '0'
                      return (
                        <tr key={state.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40'>
                          <td className='px-4 py-2.5 text-center text-muted-foreground tabular-nums'>{idx + 1}</td>
                          <td className='px-4 py-2.5 font-medium'>
                            <span className='inline-flex items-center gap-1.5'>
                              <Link href={stateGymsdataPath(state)} className='text-primary hover:underline'>
                                {state.stateName}
                              </Link>
                              <span
                                className='inline-flex shrink-0 text-muted-foreground hover:text-foreground'
                                title={`${state.stateName} (${state.state}): ${state.count.toLocaleString('en-US')} gyms — view state directory`}
                                aria-label={`Details for ${state.stateName}`}
                              >
                                <Info className='h-3.5 w-3.5' />
                              </span>
                            </span>
                          </td>
                          <td className='px-4 py-2.5 text-muted-foreground hidden sm:table-cell font-mono text-xs'>{state.state}</td>
                          <td className='px-4 py-2.5 text-right font-semibold tabular-nums'>{state.count.toLocaleString('en-US')}</td>
                          <td className='px-4 py-2.5 text-right text-muted-foreground hidden md:table-cell tabular-nums'>{pct}%</td>
                          <td className='px-4 py-2.5 text-right'>
                            <Link href={stateGymsdataPath(state)} className='inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors'>
                              View gyms
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                    <tr className='bg-muted/50 border-t-2 border-border font-semibold'>
                      <td className='px-4 py-2.5 text-center'>—</td>
                      <td className='px-4 py-2.5'>Total</td>
                      <td className='px-4 py-2.5 hidden sm:table-cell'>—</td>
                      <td className='px-4 py-2.5 text-right tabular-nums'>{totalGyms.toLocaleString('en-US')}</td>
                      <td className='px-4 py-2.5 text-right hidden md:table-cell tabular-nums'>100%</td>
                      <td className='px-4 py-2.5' />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Top 10 states by gym count – animated bar chart */}
        {top10States.length > 0 && (
          <section className='max-w-4xl mx-auto mb-16'>
            <h2 className='text-2xl md:text-3xl font-semibold mb-4'>
              Top 10 states by gym count
            </h2>
            <p className='text-sm text-muted-foreground mb-4'>
              States ranked by number of gyms on Gymdues. Bar length is proportional to gym count.
            </p>
            <div className='rounded-2xl border bg-card p-4 md:p-6 shadow-sm space-y-3'>
              {top10States.map((s, index) => {
                const widthPct = (s.count / maxStateCount) * 100
                const rank = index + 1
                const delayMs = index * 60
                const isTop3 = rank <= 3
                return (
                  <div
                    key={s.state}
                    className='group flex items-center gap-3'
                  >
                    <div className='w-8 shrink-0 text-xs font-semibold text-muted-foreground text-right'>
                      #{rank}
                    </div>
                    <div className='w-28 md:w-40 shrink-0 text-sm font-medium'>
                      <Link
                        href={stateGymsdataPath(s)}
                        className='hover:underline underline-offset-2'
                      >
                        {s.stateName}
                      </Link>
                    </div>
                    <div className='relative flex-1 h-6 rounded-full bg-muted overflow-hidden'>
                      <div
                        className={`top-states-bar h-full rounded-full ${
                          isTop3 ? 'bg-primary' : 'bg-primary/80'
                        } group-hover:bg-primary`}
                        style={
                          {
                            '--bar-width': `${widthPct}%`,
                            animationDelay: `${delayMs}ms`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                    <span className='w-16 text-right text-sm font-semibold tabular-nums'>
                      {s.count.toLocaleString('en-US')}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className='mt-4 text-center flex flex-wrap justify-center gap-4'>
              <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2'>
                <Table2 className='h-4 w-4 shrink-0' />
                Read more — full table
              </Link>
              <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:underline'>
                Show all data →
              </Link>
            </p>
          </section>
        )}

        {/* State comparison tool – no-JS: CTA to full table (no duplicate state list) */}
        {sortedStates.length > 0 && (
          <>
            <div className='js-only'>
              <UsaListStateComparison sortedStates={sortedStates} />
            </div>
            <div className='no-js-only max-w-4xl mx-auto mb-16'>
              <div className='rounded-2xl border border-border/80 bg-card p-6 md:p-8 text-center'>
                <h2 className='text-xl font-semibold mb-2'>Compare gym counts by state</h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  Use the full table below to see gym counts for all states. Browse by state links are in the sections above.
                </p>
                <Link href='#states-table' className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90'>
                  <Table2 className='h-4 w-4' />
                  View full table
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Top 10 cities with the most gyms */}
        {topCities.length > 0 && (
          <section className='max-w-4xl mx-auto mb-16' aria-labelledby='top-cities-heading'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <Building2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='top-cities-heading' className='text-2xl md:text-3xl font-semibold'>
                Top 10 cities with the most gyms in the United States
              </h2>
              <details className='ml-auto [&::-webkit-details-marker]:hidden' aria-label='Table details'>
                <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                  <Info className='h-4 w-4 shrink-0' aria-hidden />
                  <span>Details</span>
                </summary>
                <p id='gymsdata-top-cities-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
                  This table shows cities and metro areas with the most gyms in the United States. Columns: rank, city or location, and gym count. Click a city to browse gyms and compare membership prices. Data is updated weekly.
                </p>
              </details>
            </div>
            <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
              Cities ranked by number of gyms on Gymdues. Click a city to browse gyms in that
              location and compare membership prices.
            </p>
            <div className='js-only'>
              <TopCitiesTable cities={topCities} />
            </div>
            <div className='no-js-only rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60'>
                    <tr>
                      <th className='w-12 px-4 py-3 text-center font-medium text-muted-foreground'>#</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground'>City / Location</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground text-right w-28'>Gyms</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCities.map((loc, i) => (
                      <tr key={i} className='border-b border-border/60 last:border-0 hover:bg-muted/40'>
                        <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>{i + 1}</td>
                        <td className='px-4 py-3 font-medium'>
                          <Link href={`/gymsdata/#location=${encodeURIComponent(loc.label)}`} className='text-primary hover:underline underline-offset-2'>
                            {loc.label}
                          </Link>
                        </td>
                        <td className='px-4 py-3 text-right font-semibold tabular-nums'>{loc.count.toLocaleString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='px-4 py-3 border-t border-border/60 bg-muted/20 flex flex-wrap justify-center gap-4 text-sm'>
                <Link href='#states-table' className='font-medium text-primary hover:underline'>Show all data →</Link>
                <Link href='/gymsdata/' className='text-muted-foreground hover:text-primary hover:underline'>Browse all gyms</Link>
              </div>
            </div>
          </section>
        )}

        {/* State-by-State Comparison – sortable table (SEO) */}
        {stateComparisonRows.length > 0 && (
          <section className='max-w-6xl mx-auto mb-16' aria-labelledby='state-comparison-heading'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <Table2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='state-comparison-heading' className='text-2xl md:text-3xl font-semibold'>
                State-by-State Comparison
              </h2>
              <details className='ml-auto [&::-webkit-details-marker]:hidden' aria-label='Table details'>
                <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                  <Info className='h-4 w-4 shrink-0' aria-hidden />
                  <span>Details</span>
                </summary>
                <p id='state-comparison-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
                  Sortable table: gym count, gym density per 100,000 people, average membership price by state, and market saturation index (0–100). Click column headers to sort. Data for SEO and market research.
                </p>
              </details>
            </div>
            <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
              Compare U.S. states by gym density per capita, average pricing, and market saturation. Click a column header to sort.
            </p>
            <div className='js-only'>
              <StateByStateComparisonTable rows={stateComparisonRows} />
            </div>
            <div className='no-js-only overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
              <table className='min-w-full text-left text-sm'>
                <thead className='bg-muted/50 border-b border-border/60'>
                  <tr>
                    <th className='px-4 py-3.5 font-medium text-muted-foreground'>State</th>
                    <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-24'>Gyms</th>
                    <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-36'>Gym density per 100k</th>
                    <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>Avg. price (state)</th>
                    <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>Market saturation</th>
                  </tr>
                </thead>
                <tbody>
                  {stateComparisonRows.map((row) => (
                    <tr key={row.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40'>
                      <td className='px-4 py-3 font-medium'>
                        <Link href={stateGymsdataPath({ state: row.state, stateName: row.stateName, count: row.count })} className='text-primary hover:underline'>
                          {row.stateName}
                        </Link>
                      </td>
                      <td className='px-4 py-3 text-right tabular-nums'>{row.count.toLocaleString('en-US')}</td>
                      <td className='px-4 py-3 text-right tabular-nums'>{row.densityPer100k.toFixed(1)}</td>
                      <td className='px-4 py-3 text-right'>${row.avgPriceMonthly}/mo</td>
                      <td className='px-4 py-3 text-right tabular-nums'>{row.saturationIndex}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Gym Chain Comparison – SEO comparison table */}
        <section className='max-w-5xl mx-auto mb-16' aria-labelledby='chain-comparison-heading'>
          <div className='flex flex-wrap items-center gap-2 mb-2'>
            <Building2 className='h-6 w-6 text-primary shrink-0' />
            <h2 id='chain-comparison-heading' className='text-2xl md:text-3xl font-semibold'>
              Gym Chain Comparison
            </h2>
          </div>
          <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
            Compare major gym chains by locations, average price, amenities score, and user rating. Data for SEO and research.
          </p>
          <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
            <table className='min-w-full text-left text-sm'>
              <thead className='bg-muted/50 border-b border-border/60'>
                <tr>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground'>Chain Name</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>Locations</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>Avg Price</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>Amenities Score</th>
                  <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>User Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-border/50 hover:bg-muted/40'>
                  <td className='px-4 py-3 font-medium'>LA Fitness</td>
                  <td className='px-4 py-3 text-right tabular-nums'>700+</td>
                  <td className='px-4 py-3 text-right'>$35/mo</td>
                  <td className='px-4 py-3 text-right tabular-nums'>8.5/10</td>
                  <td className='px-4 py-3 text-right'>4.2★</td>
                </tr>
                <tr className='border-b border-border/50 hover:bg-muted/40'>
                  <td className='px-4 py-3 font-medium'>24 Hour Fitness</td>
                  <td className='px-4 py-3 text-right tabular-nums'>450+</td>
                  <td className='px-4 py-3 text-right'>$40/mo</td>
                  <td className='px-4 py-3 text-right tabular-nums'>8.0/10</td>
                  <td className='px-4 py-3 text-right'>4.0★</td>
                </tr>
                <tr className='border-b border-border/50 hover:bg-muted/40'>
                  <td className='px-4 py-3 font-medium'>Planet Fitness</td>
                  <td className='px-4 py-3 text-right tabular-nums'>2,400+</td>
                  <td className='px-4 py-3 text-right'>$10/mo</td>
                  <td className='px-4 py-3 text-right tabular-nums'>6.5/10</td>
                  <td className='px-4 py-3 text-right'>3.8★</td>
                </tr>
                <tr className='hover:bg-muted/40'>
                  <td className='px-4 py-3 font-medium'>Equinox</td>
                  <td className='px-4 py-3 text-right tabular-nums'>100+</td>
                  <td className='px-4 py-3 text-right'>$200/mo</td>
                  <td className='px-4 py-3 text-right tabular-nums'>9.8/10</td>
                  <td className='px-4 py-3 text-right'>4.5★</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='mt-4 flex justify-center'>
            <DownloadSampleButton
              variant='outline'
              className='rounded-xl border-2 border-primary bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/20'
            >
              Download complete chain data
            </DownloadSampleButton>
          </div>
        </section>

        {/* Distribution by location – state chips (no-JS: same data, single section) */}
        {sortedStates.length > 0 && (
          <section className='max-w-6xl mx-auto mb-16' aria-labelledby='distribution-heading'>
            <div className='flex items-center gap-2 mb-2'>
              <Globe2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='distribution-heading' className='text-2xl md:text-3xl font-semibold'>
                Distribution by location
              </h2>
            </div>
            <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
              Number of gyms across U.S. states and territories. Click a state to open the gyms
              directory filtered for that state.
            </p>
            <div className='rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm'>
              <div className='js-only'>
                <DistributionByLocationChips states={sortedStates} />
              </div>
              <div className='no-js-only'>
                <p className='text-sm text-muted-foreground mb-4'>
                  All {sortedStates.length} states. Click to browse gyms in that state. Full table below.
                </p>
                <div className='flex flex-wrap gap-2'>
                  {sortedStates.map((s) => (
                    <Link
                      key={s.state}
                      href={stateGymsdataPath(s)}
                      className='inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-colors'
                    >
                      <span>{s.stateName}</span>
                      <span className='tabular-nums text-muted-foreground'>{s.count.toLocaleString('en-US')}</span>
                    </Link>
                  ))}
                </div>
                <p className='mt-5 pt-4 border-t border-border/60'>
                  <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline'>
                    <Table2 className='h-4 w-4 shrink-0' />
                    View full table
                  </Link>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Visual cards for top states – no-JS: single CTA (state links are in Filter + Map + Distribution) */}
        {states.length > 0 && (
          <section className='mb-16' aria-labelledby='browse-by-state-heading'>
            <div className='js-only'>
              <ListingByStateSection states={sortedStates} />
            </div>
            <div className='no-js-only max-w-2xl mx-auto'>
              <div className='rounded-2xl border border-border/80 bg-muted/30 p-6 md:p-8 text-center'>
                <h2 id='browse-by-state-heading' className='text-xl font-semibold mb-2'>
                  Explore gyms by state
                </h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  Use the browse-by-state links and map section above, or jump to the full table below.
                </p>
                <Link href='#states-table' className='inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90'>
                  <Table2 className='h-4 w-4' />
                  View full table
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Detailed table by state */}
        {sortedStates.length > 0 && (
          <div id='states-table'>
            <div className='js-only'>
              <GymsByStateTable sortedStates={sortedStates} totalGyms={totalGyms} />
            </div>
            <section className='no-js-only max-w-5xl mx-auto mb-16' aria-labelledby='states-table-heading-nojs'>
              <div className='mb-6 p-5 md:p-6 rounded-2xl border border-border/60 bg-card/50'>
                <div className='flex flex-wrap items-start justify-between gap-2'>
                  <div>
                    <h2 id='states-table-heading-nojs' className='text-2xl md:text-3xl font-bold tracking-tight'>
                      Number of gyms by U.S. state
                    </h2>
                    <p className='text-sm text-muted-foreground max-w-2xl mt-2'>
                      Gym count per state. Click a state or &quot;View gyms&quot; to open the gyms page filtered by state.
                    </p>
                  </div>
                  <details className='[&::-webkit-details-marker]:hidden' aria-label='Table details'>
                    <summary className='inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-transparent px-2 py-1.5 text-sm font-medium text-muted-foreground hover:border-input hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring'>
                      <Info className='h-4 w-4 shrink-0' aria-hidden />
                      <span>Details</span>
                    </summary>
                    <p id='states-table-nojs-details' className='mt-2 text-sm text-muted-foreground max-w-2xl' role='region' aria-label='Table description'>
                      This table lists every U.S. state with verified gym counts. Columns: rank (#), state name (links to state gyms directory), state code, number of gyms, share of total, and view gyms action. Use it to compare gym density by state. Data is updated weekly.
                    </p>
                  </details>
                </div>
              </div>
              <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
                <table className='min-w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60'>
                    <tr>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground w-14 text-center'>#</th>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground'>State</th>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground hidden sm:table-cell w-20'>Code</th>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-28'>Gyms</th>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground text-right hidden md:table-cell w-24'>% of total</th>
                      <th className='px-4 py-3.5 font-medium text-muted-foreground text-right w-32'>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStates.map((state, idx) => {
                      const pct = totalGyms > 0 ? ((state.count / totalGyms) * 100).toFixed(1) : '0'
                      return (
                        <tr key={state.state} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40'>
                          <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>{idx + 1}</td>
                          <td className='px-4 py-3 font-medium'>
                            <span className='inline-flex items-center gap-1.5'>
                              <Link href={stateGymsdataPath(state)} className='text-primary hover:underline'>
                                {state.stateName}
                              </Link>
                              <span
                                className='inline-flex shrink-0 text-muted-foreground hover:text-foreground'
                                title={`${state.stateName} (${state.state}): ${state.count.toLocaleString('en-US')} gyms — view state directory`}
                                aria-label={`Details for ${state.stateName}`}
                              >
                                <Info className='h-3.5 w-3.5' />
                              </span>
                            </span>
                          </td>
                          <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell font-mono text-xs'>{state.state}</td>
                          <td className='px-4 py-3 text-right font-semibold tabular-nums'>{state.count.toLocaleString('en-US')}</td>
                          <td className='px-4 py-3 text-right text-muted-foreground hidden md:table-cell tabular-nums'>{pct}%</td>
                          <td className='px-4 py-3 text-right'>
                            <Link href={stateGymsdataPath(state)} className='inline-flex items-center justify-center rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors'>
                              View gyms
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                    <tr className='bg-muted/50 border-t-2 border-border font-semibold'>
                      <td className='px-4 py-3 text-center text-muted-foreground'>—</td>
                      <td className='px-4 py-3'>Total</td>
                      <td className='px-4 py-3 text-muted-foreground hidden sm:table-cell'>—</td>
                      <td className='px-4 py-3 text-right tabular-nums'>{totalGyms.toLocaleString('en-US')}</td>
                      <td className='px-4 py-3 text-right hidden md:table-cell tabular-nums'>100%</td>
                      <td className='px-4 py-3' />
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* Lead segments – high-intent filters */}
        <section className='max-w-6xl mx-auto mb-16' aria-labelledby='lead-segments-heading'>
          <div className='flex items-center gap-2 mb-2'>
            <Filter className='h-6 w-6 text-primary shrink-0' />
            <h2 id='lead-segments-heading' className='text-2xl md:text-3xl font-semibold'>
              Lead segments
            </h2>
          </div>
          <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
            Target gyms by data completeness and reputation. Use these segments for marketing, software sales, or reputation management.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            <Link
              href='/gymsdata/'
              className='flex items-center gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10'>
                <Globe2 className='h-5 w-5 text-amber-600' />
              </div>
              <div>
                <p className='font-semibold'>Gyms without websites</p>
                <p className='text-xs text-muted-foreground'>Tech-backward leads for software & web services</p>
              </div>
            </Link>
            <Link
              href='/gymsdata/'
              className='flex items-center gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10'>
                <CheckCircle2 className='h-5 w-5 text-emerald-600' />
              </div>
              <div>
                <p className='font-semibold'>Gyms with website + email</p>
                <p className='text-xs text-muted-foreground'>Ready for email campaigns and outreach</p>
              </div>
            </Link>
            <Link
              href='/gymsdata/'
              className='flex items-center gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30'
            >
              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10'>
                <Star className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='font-semibold'>Low rating + high reviews</p>
                <p className='text-xs text-muted-foreground'>Reputation management and review outreach</p>
              </div>
            </Link>
          </div>
        </section>

        {/* How this list helps you – use cases */}
        <section className='max-w-6xl mx-auto mb-16'>
          <h2 className='text-2xl md:text-3xl font-semibold text-center mb-6'>
            How this list of gyms in the United States helps you
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              { icon: Search, title: 'Find gyms near you', desc: 'Filter by state, city, or zip to see gyms in your area.' },
              { icon: DollarSign, title: 'Compare membership costs', desc: 'See price ranges, plans, and fees before you join.' },
              { icon: Filter, title: 'Filter by state', desc: 'Use the map and table to focus on one state or compare several.' },
              { icon: Star, title: 'See ratings and reviews', desc: 'Check member reviews and ratings on each gym profile.' },
              { icon: Table2, title: 'Browse the full table', desc: 'Sort and scan all states with gym counts and quick links.' },
              { icon: Building2, title: 'Explore gym profiles', desc: 'Click through to detailed pages with hours, amenities, and pricing.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className='flex gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md'
              >
                <Icon className='h-6 w-6 text-primary shrink-0 mt-0.5' />
                <div>
                  <h3 className='font-semibold mb-0.5'>{title}</h3>
                  <p className='text-sm text-muted-foreground'>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data quality badges */}
        <section className='max-w-6xl mx-auto mb-12'>
          <div className='rounded-2xl border border-border/80 bg-card p-5 md:p-6 shadow-sm'>
            <h2 className='text-lg font-semibold mb-4 text-center'>Data quality</h2>
            <div className='flex flex-wrap justify-center gap-3 md:gap-4'>
              {[
                `Updated weekly (last: ${lastUpdateDateStr})`,
                '95%+ Accuracy Rate',
                'Money-Back Guarantee',
                '48-Hour Delivery',
                'CSV / Excel / JSON',
                'CRM-Ready',
              ].map((label) => (
                <span
                  key={label}
                  className='inline-flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground'
                >
                  <CheckCircle2 className='h-4 w-4 text-primary shrink-0' />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section
          className='max-w-5xl mx-auto mb-16 rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'
          aria-labelledby='what-you-get-heading'
        >
          <div className='p-6 md:p-8 bg-gradient-to-b from-primary/5 to-transparent'>
            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6'>
              <div className='flex items-center gap-3'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                  <CheckCircle2 className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <h2 id='what-you-get-heading' className='text-2xl md:text-3xl font-bold tracking-tight'>
                    What you get
                  </h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Everything you need to explore and use the U.S. gyms dataset
                  </p>
                </div>
              </div>
              <div className='flex flex-wrap gap-2'>
                <span className='rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium'>
                  CSV
                </span>
                <span className='rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium'>
                  Excel (XLSX)
                </span>
                <span className='rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium'>
                  JSON
                </span>
                <span className='rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary'>
                  Updated weekly
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                  Data & access
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>State-by-state gym counts and interactive USA map</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Filter by state, city, or ZIP and browse full gym profiles</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Membership prices, plans, and fees on each gym page</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Sortable table with rank, % of total, and quick actions</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
                  Formats & delivery
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Export in CSV, Excel (XLSX), or JSON — CRM-ready</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Weekly updates — data freshness you can rely on</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Sample rows on request; free to browse, no signup required</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='px-6 md:px-8 py-5 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <p className='text-sm text-muted-foreground'>
              Ready to use the data? Browse the directory or get a sample.
            </p>
            <div className='flex flex-wrap gap-3'>
              <Link
                href='/gymsdata/dataset'
                className='inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors'
              >
                Buy dataset
                <ArrowRightCircle className='h-4 w-4' />
              </Link>
              <DownloadSampleButton
                variant='outline'
                className='rounded-xl border-2 border-input px-5 py-3'
              >
                <Download className='h-4 w-4' aria-hidden />
                Request sample
              </DownloadSampleButton>
              <Link
                href='#states-table'
                className='inline-flex items-center gap-2 rounded-xl border border-input bg-background px-5 py-3 text-sm font-medium hover:bg-muted transition-colors'
              >
                <Table2 className='h-4 w-4' />
                View full table
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ – JS: collapsible details; No-JS: all open */}
        <section
          className='max-w-4xl mx-auto mb-16 rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'
          aria-labelledby='faq-heading'
        >
          <div className='p-6 md:p-8 pb-4'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                <HelpCircle className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h2 id='faq-heading' className='text-2xl md:text-3xl font-bold tracking-tight'>
                  Frequently asked questions
                </h2>
                <p className='text-sm text-muted-foreground mt-1'>
                  Quick answers about the U.S. gyms list, map, and how to compare membership prices.
                </p>
              </div>
            </div>
          </div>
          <div className='js-only w-full px-6 md:px-8 pb-6'>
            {usaListPageFaqs.map((faq, index) => (
              <details
                key={faq.id}
                className={index === 0 ? 'border-t border-border/60' : ''}
              >
                <summary className='cursor-pointer list-none font-semibold text-base py-5 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  {faq.question}
                </summary>
                <div className='text-muted-foreground text-sm leading-relaxed pb-5'>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
          <div className='no-js-only w-full px-6 md:px-8 pb-6'>
            {usaListPageFaqs.map((faq, index) => (
              <details
                key={faq.id}
                open
                className={index === 0 ? 'border-t border-border/60' : ''}
              >
                <summary className='cursor-pointer list-none font-semibold text-base py-5 hover:text-primary [&::-webkit-details-marker]:hidden'>
                  {faq.question}
                </summary>
                <div className='text-muted-foreground text-sm leading-relaxed pb-5'>
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Testimonials – social proof for GymDues data */}
        <section className='max-w-6xl mx-auto mb-16' aria-labelledby='gymsdata-testimonials-heading'>
          <div className='text-center mb-8'>
            <p className='inline-flex items-center justify-center rounded-full border border-emerald-100 bg-emerald-50/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-900 mb-3'>
              Testimonials
            </p>
            <h2
              id='gymsdata-testimonials-heading'
              className='text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-2'
            >
              What Our Users Say
            </h2>
            <p className='text-sm text-muted-foreground max-w-2xl mx-auto'>
              Discover how teams use GymDues to find verified gym and fitness business leads faster.
            </p>
          </div>

          <div className='rounded-3xl border border-border/70 bg-card/95 px-2 py-4 sm:px-4 sm:py-6 shadow-[0_18px_45px_rgba(15,23,42,0.14)]'>
            {/* With JS: carousel (one card, arrows) */}
            <div className='js-only'>
              <Carousel
              opts={{
                align: 'center',
                loop: true,
              }}
              className='w-full relative'
            >
              <CarouselContent className='-ml-2'>
                {[
                  {
                    quote:
                      'We used GymDues to source gym contacts for a national outreach campaign, and the results were night and day compared to generic lists. The data was fresh, verified, and instantly usable—our team reached thousands of gyms in just a few days.',
                    name: 'Jordan Lee',
                    role: 'Growth Lead, FitStack Analytics',
                  },
                  {
                    quote:
                      'GymDues saved our sales reps hours per week. Instead of cleaning spreadsheets, they spend time talking to gym owners who actually fit our ICP.',
                    name: 'Morgan Patel',
                    role: 'Head of Sales, IronStack CRM',
                  },
                  {
                    quote:
                      'We layered GymDues data on top of our ad audiences and immediately saw higher CTR and reply rates from gyms that were actively investing in equipment and software.',
                    name: 'Alex Rivera',
                    role: 'Performance Marketer, LiftLabs',
                  },
                ].map((t) => (
                  <CarouselItem
                    key={t.name}
                    className='pl-2 md:pl-4 basis-full'
                  >
                    <figure className='grid gap-6 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] items-center rounded-3xl border border-border/60 bg-background px-5 py-5 md:px-8 md:py-7'>
                      <div className='relative'>
                        <div className='mb-3 flex items-center gap-1'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className='h-4 w-4 text-amber-400 fill-amber-400' aria-hidden />
                          ))}
                        </div>
                        <p className='text-sm md:text-[0.95rem] text-foreground leading-relaxed'>
                          “{t.quote}”
                        </p>
                      </div>
                      <figcaption className='flex items-center justify-start md:justify-end gap-4'>
                        <div className='hidden sm:block h-14 w-14 rounded-full bg-gradient-to-br from-emerald-200 via-emerald-50 to-sky-100 shadow-md' />
                        <div className='text-left'>
                          <p className='text-sm font-semibold text-foreground'>{t.name}</p>
                          <p className='text-xs text-muted-foreground'>{t.role}</p>
                        </div>
                      </figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='-left-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border-2 bg-background shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hidden md:flex' />
              <CarouselNext className='-right-4 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full border-2 bg-background shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all hidden md:flex' />
            </Carousel>
            </div>
            {/* No-JS: show all testimonials in a list */}
            <div className='no-js-only space-y-4 px-2'>
              {[
                {
                  quote:
                    'We used GymDues to source gym contacts for a national outreach campaign, and the results were night and day compared to generic lists. The data was fresh, verified, and instantly usable—our team reached thousands of gyms in just a few days.',
                  name: 'Jordan Lee',
                  role: 'Growth Lead, FitStack Analytics',
                },
                {
                  quote:
                    'GymDues saved our sales reps hours per week. Instead of cleaning spreadsheets, they spend time talking to gym owners who actually fit our ICP.',
                  name: 'Morgan Patel',
                  role: 'Head of Sales, IronStack CRM',
                },
                {
                  quote:
                    'We layered GymDues data on top of our ad audiences and immediately saw higher CTR and reply rates from gyms that were actively investing in equipment and software.',
                  name: 'Alex Rivera',
                  role: 'Performance Marketer, LiftLabs',
                },
              ].map((t) => (
                <figure
                  key={t.name}
                  className='grid gap-6 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] items-center rounded-3xl border border-border/60 bg-background px-5 py-5 md:px-8 md:py-7'
                >
                  <div className='relative'>
                    <div className='mb-3 flex items-center gap-1'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className='h-4 w-4 text-amber-400 fill-amber-400' aria-hidden />
                      ))}
                    </div>
                    <p className='text-sm md:text-[0.95rem] text-foreground leading-relaxed'>
                      &quot;{t.quote}&quot;
                    </p>
                  </div>
                  <figcaption className='flex items-center justify-start md:justify-end gap-4'>
                    <div className='hidden sm:block h-14 w-14 rounded-full bg-gradient-to-br from-emerald-200 via-emerald-50 to-sky-100 shadow-md' />
                    <div className='text-left'>
                      <p className='text-sm font-semibold text-foreground'>{t.name}</p>
                      <p className='text-xs text-muted-foreground'>{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-action */}
        <section className='max-w-4xl mx-auto border rounded-2xl bg-primary/5 px-6 py-8 md:px-8 md:py-10'>
          <div className='flex items-center gap-2 mb-3'>
            <ArrowRightCircle className='h-5 w-5 text-primary' />
            <h2 className='text-xl md:text-2xl font-semibold'>
              Ready to compare real membership prices?
            </h2>
          </div>
          <p className='text-sm md:text-base text-muted-foreground mb-5'>
            This report-style page is great for understanding where gyms are located across the
            United States. When you&apos;re ready to choose a club, head over to the main gyms
            directory to filter by state, city, or ZIP code and see live membership price ranges,
            plans, and fees.
          </p>
          <Link
            href='/gymsdata/'
            className='inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
          >
            Browse all U.S. gyms
          </Link>
        </section>
      </div>
      <div className='js-only'>
        <ExitIntentPopup />
        <UsaListStickyCta totalGyms={totalGyms} />
      </div>
      <div className='no-js-only fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex flex-wrap items-center justify-center gap-2 md:gap-3'>
            <Link href='/gymsdata/' className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'>
              Browse {totalGyms >= 60000 ? '60K+' : totalGyms.toLocaleString('en-US')}+ Gyms
            </Link>
            <Link href='#filter-by-location-heading' className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/30 transition-colors'>
              <Filter className='h-4 w-4' />
              Filter Now
            </Link>
            <DownloadSampleButton variant='outline' className='rounded-xl border-2 border-input px-4 py-2.5 hover:border-primary/30'>
              <Download className='h-4 w-4' aria-hidden />
              Download Sample
            </DownloadSampleButton>
          </div>
          <p className='text-center text-xs text-muted-foreground mt-2'>
            1,247 businesses downloaded this month · ★★★★★ 4.8/5 from 300+ reviews
          </p>
        </div>
      </div>
    </div>
  )
}

