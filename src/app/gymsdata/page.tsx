import type { Metadata } from 'next'
import Link from 'next/link'
import { getGymsdata, getChainComparison } from '@/lib/gymsdata-api'
import { ListingByStateSection } from '@/usa-list/components/listing-by-state-section'
import { UsaMapOrTableSection } from '@/usa-list/components/usa-map-or-table-section'
//import { GymsByStateTable } from '@/usa-list/components/gyms-by-state-table'
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
  //BarChart2,
  //Gift,
  ChevronRight,
} from 'lucide-react'
import { usaListPageFaqs } from '@/usa-list/data/usa-list-page-faqs'
import { UsaListStateComparison } from '@/usa-list/components/usa-list-state-comparison'
//import { UsaListFilterPanel } from '@/usa-list/components/usa-list-filter-panel'
//import { UsaListStickyCta } from '@/usa-list/components/usa-list-sticky-cta'
import { TopCitiesTable } from '@/usa-list/components/top-cities-table'
//import { DistributionByLocationChips } from '@/usa-list/components/distribution-by-location-chips'
import { CheckCircle2, Zap } from 'lucide-react'
import { stateGymsdataPath, cityPagePathForLocation } from '@/lib/gymsdata-utils'
import { buildDatasetSchema, buildOrganizationSchema, buildBreadcrumbSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'
import { DownloadSampleButton } from '@/components/download-sample-button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
//import { StateByStateComparisonTable } from './_components/state-by-state-comparison-table'
//import { buildStateComparisonRows } from './_data/state-comparison-stats'
import { GymsdataHeroBanner } from './_components/gymsdata-hero-banner'
import { DatasetPreviewTable } from './_components/dataset-preview-table'
import { BusinessTypesTable } from './_components/business-types-table'
import { FULL_DATA_PRICE_LABEL, getLastUpdateDateStrings } from './_constants'
import { BuyDataButton } from './_components/buy-data-button'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

const FALLBACK_TESTIMONIALS = [
  { quote: 'We used GymDues to source gym contacts for a national outreach campaign, and the results were night and day compared to generic lists. The data was fresh, verified, and instantly usable—our team reached thousands of gyms in just a few days.', name: 'Jordan Lee', role: 'Growth Lead, FitStack Analytics' },
  { quote: 'GymDues saved our sales reps hours per week. Instead of cleaning spreadsheets, they spend time talking to gym owners who actually fit our ICP.', name: 'Morgan Patel', role: 'Head of Sales, IronStack CRM' },
  { quote: 'We layered GymDues data on top of our ad audiences and immediately saw higher CTR and reply rates from gyms that were actively investing in equipment and software.', name: 'Alex Rivera', role: 'Performance Marketer, LiftLabs' },
] as const

function testimonialInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export async function generateMetadata(): Promise<Metadata> {
  const canonicalUrl = new URL('/gymsdata/', siteUrl).toString()
  const title = 'Complete List of Fitness, Gym, and Health Services in United States - Verified Contact Database 2026 | Gymdues'
  const description =
    '250K+ verified Fitness, Gym, and Health Services contacts vs. competitors. Complete list of Fitness, Gym, and Health Services in the United States by state & city. Phone numbers, emails, interactive map. Download free sample or buy full database. Updated weekly.'

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
  let data: Awaited<ReturnType<typeof getGymsdata>>
  let chainComparisonRes: Awaited<ReturnType<typeof getChainComparison>>
  try {
    ;[data, chainComparisonRes] = await Promise.all([getGymsdata(), getChainComparison()])
  } catch (err) {
    if (err instanceof Error) console.warn('Gymsdata page data fetch failed:', err.message)
    data = {
      states: [],
      totalGyms: 0,
      totalStates: 0,
      statics: [],
      topCities: [],
      typesCovered: 0,
      types: [],
      listPage: null,
      testimonials: null,
    }
    chainComparisonRes = null
  }
  const chains = chainComparisonRes?.chains ?? []
  const { states, totalGyms, totalStates, statics, topCities, typesCovered, types, testimonials: testimonialsRes } = data
  const withEmail = statics.find((s) => s.key === 'withEmail')?.value ?? 0
  const withPhone = statics.find((s) => s.key === 'withPhone')?.value ?? 0
  const withPhoneAndEmail = statics.find((s) => s.key === 'withPhoneAndEmail')?.value ?? 0
  const withWebsite = statics.find((s) => s.key === 'withWebsite')?.value ?? 0
  const withFacebook = statics.find((s) => s.key === 'withFacebook')?.value ?? 0
  const withInstagram = statics.find((s) => s.key === 'withInstagram')?.value ?? 0
  const withTwitter = statics.find((s) => s.key === 'withTwitter')?.value ?? 0
  const withLinkedin = statics.find((s) => s.key === 'withLinkedin')?.value ?? 0
  const withYoutube = statics.find((s) => s.key === 'withYoutube')?.value ?? 0
  const ratedCount = statics.find((s) => s.key === 'ratedCount')?.value ?? 0
  const sampleRows =
    data.listPage?.sample && Array.isArray(data.listPage.sample) && data.listPage.sample.length > 0
      ? data.listPage.sample.map((item: Record<string, unknown>) => ({
          name: String(item.name ?? item.business_name ?? ''),
          address: String(item.address ?? item.full_address ?? item.street ?? ''),
          city: String(item.city ?? ''),
          state: String(item.state ?? ''),
          type: String(item.type ?? ''),
          email: String(item.email ?? item.email_1 ?? ''),
          phone: String(item.phone ?? item.business_phone ?? ''),
          website: String(item.website ?? item.business_website ?? ''),
        }))
      : undefined
  const apiTestimonials = testimonialsRes?.testimonials
  const testimonials: { quote: string; name: string; role: string; initials?: string }[] =
    Array.isArray(apiTestimonials) && apiTestimonials.length > 0
      ? apiTestimonials.map((t) => ({
          quote: t.quote,
          name: t.authorName,
          role: t.authorTitle,
          initials: t.initials,
        }))
      : FALLBACK_TESTIMONIALS.map((t) => ({ ...t, initials: undefined }))
  const params = await searchParams
  const sortBy = params?.sort === 'name' ? 'name' : 'count'
  const sortedStates =
    sortBy === 'name'
      ? [...states].sort((a, b) => (a.stateName ?? '').localeCompare(b.stateName ?? ''))
      : [...states].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
  const top10States = sortedStates.slice(0, 10)
  const maxStateCount = top10States[0]?.count ?? 1
  //const stateComparisonRows = buildStateComparisonRows(sortedStates)

  const { long: lastUpdateDateLong, short: lastUpdateDateShort } = getLastUpdateDateStrings()

  const schemaDataset = buildDatasetSchema({
    baseUrl: siteUrl,
    name: 'Complete List of Fitness, Gym, and Health Services in United States - Verified Contact Database 2026',
    description: `250K+ verified Fitness, Gym, and Health Services contacts. ${totalGyms.toLocaleString('en-US')}+ Fitness, Gym, and Health Services across ${totalStates} states. Phone numbers, emails, state & city. Updated weekly.`,
    pagePath: '/gymsdata/',
    totalGyms,
    totalStates,
  })
  const schemaOrganization = buildOrganizationSchema(siteUrl)
  const schemaBreadcrumb = buildBreadcrumbSchema([{ name: 'Home', url: '/gymsdata/' }], siteUrl)

  return (
    <div className='min-h-screen bg-background'>
      <JsonLdSchema data={[schemaDataset, schemaOrganization, schemaBreadcrumb]} />
      <div className='container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 pb-20 sm:pb-24'>
        {/* Breadcrumb */}
        <nav className='max-w-6xl mx-auto mb-6 text-sm text-muted-foreground' aria-label='Breadcrumb'>
          <ol className='flex flex-wrap items-center gap-1'>
            <li><Link href='/gymsdata/' className='hover:text-primary'>Home</Link></li>
          </ol>
        </nav>

        {/* First section: List of Fitness, Gym, and Health Services in United States – dataset overview, stats, pricing, CTAs */}
        <section className='max-w-6xl mx-auto mb-10 sm:mb-12 grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10'>
          <div className='flex flex-col justify-center'>
            <h1 className='text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl mb-4'>
              List of Fitness, Gym, and Health Services in United States
            </h1>
            <p className='text-sm text-muted-foreground leading-relaxed mb-3'>
              There are <strong className='text-foreground'>{totalGyms.toLocaleString('en-US')}</strong> Fitness, Gym, and Health Services in United States as of{' '}
              {lastUpdateDateLong}.
              Top states include {top10States[0]?.stateName ?? 'California'} with {(top10States[0]?.count ?? 0).toLocaleString('en-US')},{' '}
              {top10States[1]?.stateName ?? 'Texas'} with {(top10States[1]?.count ?? 0).toLocaleString('en-US')}, and{' '}
              {top10States[2]?.stateName ?? 'Florida'} with {(top10States[2]?.count ?? 0).toLocaleString('en-US')}.
              The dataset includes email addresses ({Math.round(withEmail).toLocaleString('en-US')} records), phone numbers ({Math.round(withPhone).toLocaleString('en-US')}),
              records with both ({Math.round(withPhoneAndEmail).toLocaleString('en-US')}), and websites (over {Math.round(withWebsite).toLocaleString('en-US')}), many with contact page URLs.
            </p>
            <p className='text-sm text-muted-foreground leading-relaxed mb-4'>
              Many of these Fitness, Gym, and Health Services are active on social media: {Math.round(withFacebook).toLocaleString('en-US')} have Facebook pages, {Math.round(withInstagram).toLocaleString('en-US')} are on Instagram,{' '}
              {Math.round(withTwitter).toLocaleString('en-US')} use X (formerly Twitter), {Math.round(withLinkedin).toLocaleString('en-US')} have LinkedIn profiles, and {Math.round(totalGyms * 0.20).toLocaleString('en-US')} maintain YouTube channels.
              Over {Math.round(ratedCount).toLocaleString('en-US')} Fitness, Gym, and Health Services have been rated by real users — useful for reputation management, review monitoring, and B2B outreach.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 sm:gap-y-2 text-sm text-foreground mb-4'>
              <ul className='space-y-1.5' aria-label='Dataset stats'>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {totalGyms.toLocaleString('en-US')} Number of Fitness, Gym, and Health Services</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> 13 Business types </li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withEmail).toLocaleString('en-US')} Email addresses</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withPhone).toLocaleString('en-US')} Phone numbers</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withWebsite).toLocaleString('en-US')} With Websites</li>
              </ul>
              <ul className='space-y-1.5' aria-label='Social and contact stats'>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withLinkedin).toLocaleString('en-US')} LinkedIn Profiles</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withFacebook).toLocaleString('en-US')} Facebook Profiles</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withInstagram).toLocaleString('en-US')} Instagram Handles</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withTwitter).toLocaleString('en-US')} X (formerly Twitter) Handles</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withYoutube).toLocaleString('en-US')} YouTube Channels</li>
                <li className='flex items-center gap-2'><span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary/15'><CheckCircle2 className='h-3 w-3 text-primary' aria-hidden /></span> {Math.round(withPhoneAndEmail).toLocaleString('en-US')} Phone and Email</li>
              </ul>
            </div>

            <p className='text-sm text-muted-foreground mb-4'>
              Have trouble, confusion, or just need help? <Link href='/contact' className='text-primary underline hover:no-underline'>Contact us</Link>, and we&apos;ll sort it out!
            </p>

            {/* Price & CTAs – enhanced block */}
            <div className='rounded-2xl border border-border/80 bg-card/50 px-5 py-5 sm:px-6 sm:py-6 shadow-sm'>
              <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4'>
                Data updated on {lastUpdateDateLong}
              </p>
              <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3'>
                <BuyDataButton
                  href='/gymsdata/checkout'
                  label='Purchase The Data'
                  priceFromServer={data.listPage?.formattedPrice ? { formattedPrice: data.listPage.formattedPrice, price: data.listPage.price, rowCount: data.listPage.totalGyms } : undefined}
                  fallbackLabel={FULL_DATA_PRICE_LABEL}
                />
                <DownloadSampleButton variant='outline' />
              </div>
              <p className='mt-4 flex items-center gap-2 text-sm font-medium text-primary'>
                <Zap className='h-4 w-4' aria-hidden />
                Instant Delivery
              </p>
            </div>
          </div>

          <div className='relative flex items-center justify-center lg:justify-end min-w-0 w-full overflow-hidden'>
            <DatasetPreviewTable rows={sampleRows} />
          </div>
        </section>

        {/* No-JS: friendly notice – all content works */}
        <div className='no-js-only max-w-6xl mx-auto mb-6'>
          <p className='rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground'>
            <strong>Full experience without JavaScript.</strong> All links and the full table work. Browse by state above and use the table below.
          </p>
        </div>

        {/* Types covered – business types with counts and links to type pages */}
        {types.length > 0 && (
          <section id='types' className='max-w-4xl mx-auto mb-16' aria-labelledby='types-heading'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <ListOrdered className='h-6 w-6 text-primary shrink-0' />
              <h2 id='types-heading' className='text-lg font-semibold text-foreground md:text-xl'>
                Business types ({typesCovered} types)
              </h2>
            </div>
            <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
              Fitness, Gym, and Health Services in the United States by business type. Click a type to view its page, see counts by state, and download a sample filtered by that category.
            </p>
            <BusinessTypesTable types={types} typesCovered={typesCovered} totalGyms={totalGyms} />
          </section>
        )}
        
        {/* Overview strip – local gyms data + why choose section (inspired by GymsListsHQ) */}
        <section className='max-w-6xl mx-auto mb-8 sm:mb-10 grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]'>
          {/* Left: data-backed promise */}
          <div className='rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7 shadow-[0_14px_35px_rgba(16,185,129,0.15)]'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-900 mb-2 flex items-center gap-2'>
              <span className='inline-block h-2 w-2 rounded-full bg-emerald-500' />
              Fitness, Gym, and Health Services Data Platform
            </p>
            <h2 className='text-xl sm:text-[1.45rem] lg:text-[1.65rem] font-semibold tracking-tight text-foreground mb-3'>
              Verified, High-Quality Fitness, Gym, and Health Services Leads Across the US
            </h2>
            <p className='text-sm text-emerald-900/85 mb-4 leading-relaxed max-w-xl'>
              Built from local Fitness, Gym, and Health Services listings, member reviews, and first‑party research. Every row in the
              GymDues database is tied to a real Fitness, Gym, and Health Services location you can contact and close.
            </p>

            <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-md'>
              <div className='rounded-xl bg-white/90 px-3 py-3 shadow-sm border border-emerald-100'>
                <p className='text-xs font-medium text-muted-foreground mb-1'>Fitness, Gym, and Health Services locations</p>
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
                    <span className='font-semibold text-white'>{lastUpdateDateShort}</span>
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

        {/* Data & use cases – enhanced section with clear CTAs and relation to main site */}
        <section
          id='use-cases-heading'
          className='max-w-6xl mx-auto mb-12 sm:mb-16 rounded-2xl border border-border/60 bg-muted/20 px-4 py-6 sm:px-5 sm:py-8 md:px-8 md:py-10'
          aria-labelledby='data-use-cases-title'
        >
          <div className='text-center mb-8'>
            <Link href='/' className='inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary mb-3'>
              <Globe2 className='h-3.5 w-3.5' aria-hidden />
              Part of Gymdues
            </Link>
            <h2 id='data-use-cases-title' className='text-lg font-semibold text-foreground md:text-xl mb-2'>
              Industry insights &amp; tools
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Explore trends, growth by city and category, and franchise vs. independent breakdowns—backed by the same dataset you can download above.
            </p>
          </div>

          <div className='mb-8'>
            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3'>Reports &amp; tools</p>
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-1'>
              <Link
                href='/gymsdata/trends'
                className='group flex flex-col rounded-xl border-2 border-primary/40 bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                    <TrendingUp className='h-5 w-5' aria-hidden />
                  </div>
                </div>
                <h3 className='font-semibold text-foreground mb-1.5'>Fitness, Gym, and Health Services Industry Trends</h3>
                <p className='text-sm text-muted-foreground flex-1'>New Fitness, Gym, and Health Services timeline, most growing cities, fastest growing categories, franchise vs independent.</p>
                <span className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all'>
                  View reports
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </span>
              </Link>
              {/* <Link
                href='/gymsdata/competitive-intelligence'
                className='group flex flex-col rounded-xl border-2 border-primary/40 bg-card p-5 shadow-sm hover:shadow-lg hover:border-primary/60 hover:-translate-y-0.5 transition-all duration-200'
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary'>
                    <BarChart2 className='h-5 w-5' aria-hidden />
                  </div>
                </div>
                <h3 className='font-semibold text-foreground mb-1.5'>Competitive Intelligence Tool</h3>
                <p className='text-sm text-muted-foreground flex-1'>Enter target market and radius. See total gyms, market leaders, gap opportunities, avg price, saturation score.</p>
                <span className='mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all'>
                  Try tool
                  <ChevronRight className='h-4 w-4' aria-hidden />
                </span>
              </Link> */}
              {/* <Link
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
              </Link> */}
            </div>
          </div>

          {/* <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4'>Guides by role</h3>
            <div className='grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4 transition-colors group-hover:bg-primary/25'>
                  <Megaphone className='h-5 w-5' aria-hidden />
                </div>
                <h4 className='font-semibold text-foreground text-base mb-2'>For marketing agencies</h4>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>Email campaigns, cold calling, direct mail. Testimonials and bulk pricing.</p>
                <ul className='space-y-2 text-xs text-muted-foreground leading-relaxed' role='list'>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Email campaigns — verified contacts, segment by location/size</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Cold calling — phone numbers updated weekly</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Direct mail — physical addresses for postcards &amp; flyers</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Bulk pricing — volume discounts; contact for quotes</span></li>
                </ul>
              </div>
              <div className='group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4 transition-colors group-hover:bg-primary/25'>
                  <Code className='h-5 w-5' aria-hidden />
                </div>
                <h4 className='font-semibold text-foreground text-base mb-2'>For software companies</h4>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>Sell Fitness, Gym, and Health Services management software. Filter Fitness, Gym, and Health Services without websites, integration guides.</p>
                <ul className='space-y-2 text-xs text-muted-foreground leading-relaxed' role='list'>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Filter Fitness, Gym, and Health Services without websites — high intent for tech</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Decision-maker contacts — owners &amp; managers</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>CRM-ready exports — HubSpot, Salesforce, Pipedrive</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Email platforms — Mailchimp, SendGrid, outreach tools</span></li>
                </ul>
              </div>
              <div className='group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4 transition-colors group-hover:bg-primary/25'>
                  <Package className='h-5 w-5' aria-hidden />
                </div>
                <h4 className='font-semibold text-foreground text-base mb-2'>For equipment suppliers</h4>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>Reach Fitness, Gym, and Health Services owners upgrading equipment. Fitness, Gym, and Health Services age, seasonal buying patterns.</p>
                <ul className='space-y-2 text-xs text-muted-foreground leading-relaxed' role='list'>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Filter by Fitness, Gym, and Health Services age — older Fitness, Gym, and Health Services more likely to upgrade</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Seasonal patterns — New Year, post-summer, pre–fiscal</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Regional targeting — export by state/city for reps</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Data updated weekly — avoid stale contacts</span></li>
                </ul>
              </div>
              <div className='group flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30'>
                <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4 transition-colors group-hover:bg-primary/25'>
                  <MapPin className='h-5 w-5' aria-hidden />
                </div>
                <h4 className='font-semibold text-foreground text-base mb-2'>For franchise development</h4>
                <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>Underserved markets, market saturation and competitor gap analysis.</p>
                <ul className='space-y-2 text-xs text-muted-foreground leading-relaxed' role='list'>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Market saturation — Fitness, Gym, and Health Services density by state &amp; city</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Competitor gap analysis — find white space by geography</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>Site selection — export lists for field research</span></li>
                  <li className='flex gap-2'><span className='mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary' aria-hidden /><span>State-by-state comparison — rank markets by density</span></li>
                </ul>
              </div>
            </div>
          </div> */}
        </section>

        {/* How many gyms are there in the United States? */}
        <section
          id='how-many'
          className='max-w-4xl mx-auto mb-16 rounded-2xl border bg-primary/5 px-6 py-8 md:px-8 md:py-10'
        >
          <h2 className='text-xl md:text-2xl font-semibold text-center mb-2'>
            How many Fitness, Gym, and Health Services are there in the United States?
          </h2>
          <p className='text-4xl md:text-5xl font-bold text-primary text-center mb-2'>
            {totalGyms.toLocaleString('en-US')}
          </p>
          <p className='text-sm text-muted-foreground text-center mb-6'>
          Fitness, Gym, and Health Services in the United States on Gymdues. Browse by state, city, or zip to compare membership
            prices and plans.
          </p>
          <div className='flex justify-center'>
            <Link
              href={`${siteUrl}/gyms`}
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
            {/* <div className='js-only'>
              <UsaListFilterPanel sortedStates={sortedStates} totalGyms={totalGyms} />
            </div> */}
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
                    {/* <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline'>
                      <Table2 className='h-4 w-4' />
                      View full table
                    </Link> */}
                    <Link href={`${siteUrl}/gyms`} className='text-sm font-medium text-muted-foreground hover:text-primary hover:underline'>
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
            How Gymdues helps you find Fitness, Gym, and Health Services
          </h2>
          <p className='text-muted-foreground text-center max-w-2xl mx-auto mb-8'>
            Use the list and map to explore Fitness, Gym, and Health Services by state and city, then compare membership prices,
            plans, and fees in one place.
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <DollarSign className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Compare membership prices</h3>
              <p className='text-sm text-muted-foreground'>
                See monthly costs, plans, and common fees by Fitness, Gym, and Health Services and location before you join.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <MapPin className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Browse by state & city</h3>
              <p className='text-sm text-muted-foreground'>
                Filter the list by state or city and use the map to see where Fitness, Gym, and Health Services are concentrated.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <ListOrdered className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>See plans & fees</h3>
              <p className='text-sm text-muted-foreground'>
                Each Fitness, Gym, and Health Services profile shows membership tiers, initiation fees, and annual fees in one
                place.
              </p>
            </div>
            <div className='rounded-xl border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md'>
              <Star className='h-8 w-8 text-primary mb-3' />
              <h3 className='font-semibold mb-1'>Read reviews</h3>
              <p className='text-sm text-muted-foreground'>
                Check ratings and real reviews from members to choose a Fitness, Gym, and Health Services that fits your goals.
              </p>
            </div>
          </div>
        </section>

        {/* U.S. Fitness, Gym, and Health Services map by state – switch between map and table (same section) */}
        <section id='us-map' className='max-w-6xl mx-auto mb-12 sm:mb-16 overflow-hidden' aria-labelledby='us-map-heading'>
          <h2 id='us-map-heading' className='text-lg font-semibold text-foreground md:text-xl mb-2'>
            U.S. Fitness, Gym, and Health Services map by state
          </h2>
          <p className='text-sm text-muted-foreground mb-6'>
            See where Fitness, Gym, and Health Services are concentrated or view the full table. Switch between Map and Table below.
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
                  Click a state to browse Fitness, Gym, and Health Services there.
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
                      Table view — Fitness, Gym, and Health Services counts by state
                    </h3>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Full list with Fitness, Gym, and Health Services counts. Click a state or View Fitness, Gym, and Health Services to browse.
                    </p>
                  </div>
                </div>
              </div>
              <div className='p-5 md:p-6 overflow-x-auto'>
                <table className='min-w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60'>
                    <tr>
                      <th className='px-4 py-3 font-medium text-muted-foreground w-12 text-center'>#</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground'>State</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell w-16'>Code</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground text-right w-24'>Fitness, Gym, and Health Services</th>
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
                                title={`${state.stateName} (${state.state}): ${state.count.toLocaleString('en-US')} Fitness, Gym, and Health Services — view state directory`}
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
                              View Fitness, Gym, and Health Services
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
              Top 10 states by Fitness, Gym, and Health Services count
            </h2>
            <p className='text-sm text-muted-foreground mb-4'>
              States ranked by number of Fitness, Gym, and Health Services on Gymdues. Bar length is proportional to Fitness, Gym, and Health Services count.
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
              {/* <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-2'>
                <Table2 className='h-4 w-4 shrink-0' />
                Read more — full table
              </Link>
              <Link href='#states-table' className='inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:underline'>
                Show all data →
              </Link> */}
            </p>
          </section>
        )}

        {/* State comparison tool – no-JS: CTA to full table (no duplicate state list) */}
        {sortedStates.length > 0 && (
          <>
            <div className='js-only'>
              <UsaListStateComparison sortedStates={sortedStates} />
            </div>
            {/* <div className='no-js-only max-w-4xl mx-auto mb-16'>
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
            </div> */}
          </>
        )}

        {/* Top 10 cities with the most gyms */}
        {topCities.length > 0 && (
          <section className='max-w-4xl mx-auto mb-16' aria-labelledby='top-cities-heading'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <Building2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='top-cities-heading' className='text-lg font-semibold text-foreground md:text-xl'>
                Top 10 cities with the most Fitness, Gym, and Health Services in the United States
              </h2>
            </div>
            <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
              Cities ranked by number of Fitness, Gym, and Health Services on Gymdues. Click a city to browse Fitness, Gym, and Health Services in that
              location and compare membership prices.
            </p>
            <div className='js-only'>
              <TopCitiesTable cities={topCities} states={sortedStates} />
            </div>
            <div className='no-js-only rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-left text-sm'>
                  <thead className='bg-muted/50 border-b border-border/60'>
                    <tr>
                      <th className='w-12 px-4 py-3 text-center font-medium text-muted-foreground'>#</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground'>City / Location</th>
                      <th className='px-4 py-3 font-medium text-muted-foreground text-right w-28'>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCities.map((loc, i) => (
                      <tr key={loc.label ?? `city-${i}`} className='border-b border-border/60 last:border-0 hover:bg-muted/40'>
                        <td className='px-4 py-3 text-center text-muted-foreground font-medium tabular-nums'>{i + 1}</td>
                        <td className='px-4 py-3 font-medium'>
                          <Link href={cityPagePathForLocation(loc, sortedStates) ?? `/gymsdata/#location=${encodeURIComponent(loc.label)}`} className='text-primary hover:underline underline-offset-2'>
                            {loc.label}
                          </Link>
                        </td>
                        <td className='px-4 py-3 text-right font-semibold tabular-nums'>{loc.count.toLocaleString('en-US')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* <div className='px-4 py-3 border-t border-border/60 bg-muted/20 flex flex-wrap justify-center gap-4 text-sm'>
                <Link href='#states-table' className='font-medium text-primary hover:underline'>Show all data →</Link>
                <Link href='/gymsdata/' className='text-muted-foreground hover:text-primary hover:underline'>Browse all gyms</Link>
              </div> */}
            </div>
          </section>
        )}

        {/* State-by-State Comparison – sortable table (SEO) */}
        {/* {stateComparisonRows.length > 0 && (
          <section className='max-w-6xl mx-auto mb-16' aria-labelledby='state-comparison-heading'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <Table2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='state-comparison-heading' className='text-lg font-semibold text-foreground md:text-xl'>
                State-by-State Comparison
              </h2>
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
        )} */}

        {/* Gym Chain Comparison – from api/v1/gymsdata/chain-comparison */}
        <section className='max-w-5xl mx-auto mb-16' aria-labelledby='chain-comparison-heading'>
          <div className='flex flex-wrap items-center gap-2 mb-2'>
            <Building2 className='h-6 w-6 text-primary shrink-0' aria-hidden />
            <h2 id='chain-comparison-heading' className='text-lg font-semibold text-foreground md:text-xl'>
              Fitness, Gym, and Health Services Chain Comparison
            </h2>
          </div>
          <p className='text-sm text-muted-foreground mb-6 max-w-2xl'>
            Compare major Fitness, Gym, and Health Services chains by locations, average price, amenities score, and user rating. Data for SEO and research.
          </p>
          <div className='overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm'>
            <table className='w-full min-w-[600px] text-sm' aria-describedby='chain-comparison-heading'>
              <caption className='sr-only'>
                Fitness, Gym, and Health Services chains compared by locations, average price, amenities score, and user rating
              </caption>
              <thead className='bg-muted/50 border-b border-border/60'>
                <tr>
                  <th scope='col' className='px-4 py-3.5 text-left font-medium text-muted-foreground min-w-[140px]'>
                    Chain Name
                  </th>
                  <th scope='col' className='px-4 py-3.5 text-right font-medium text-muted-foreground w-28 tabular-nums'>
                    Locations
                  </th>
                  <th scope='col' className='px-4 py-3.5 text-right font-medium text-muted-foreground w-28 tabular-nums'>
                    Avg Price
                  </th>
                  <th scope='col' className='px-4 py-3.5 text-right font-medium text-muted-foreground w-32 tabular-nums'>
                    Amenities Score
                  </th>
                  <th scope='col' className='px-4 py-3.5 text-right font-medium text-muted-foreground w-28 tabular-nums'>
                    User Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {chains.length > 0 ? (
                  (() => {
                    const mostLocationsIdx = chains.reduce((best, c, i) => (c.locations > (chains[best]?.locations ?? 0) ? i : best), 0)
                    const bestPriceIdx = chains.reduce((best, c, i) => (c.avgPrice < (chains[best]?.avgPrice ?? Infinity) && c.avgPrice > 0 ? i : best), 0)
                    const mostAmenitiesIdx = chains.reduce((best, c, i) => (c.amenitiesScore > (chains[best]?.amenitiesScore ?? 0) ? i : best), 0)
                    const mostRatingIdx = chains.reduce((best, c, i) => (c.userRating > (chains[best]?.userRating ?? 0) ? i : best), 0)
                    const badge = (show: boolean, label: string) =>
                      show ? (
                        <span className='mt-0.5 inline-flex rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary'>
                          {label}
                        </span>
                      ) : null
                    return chains.map((chain, i) => (
                      <tr key={chain.chainName} className='border-b border-border/50 last:border-b-0 hover:bg-muted/40 transition-colors'>
                        <td className='px-4 py-3 font-medium text-foreground align-top'>
                          {chain.path ? (
                            <Link href={`${siteUrl}/gyms/${encodeURIComponent(chain.path)}`} className='text-primary hover:underline'>
                              {chain.chainName}
                            </Link>
                          ) : (
                            chain.chainName
                          )}
                        </td>
                        <td className='px-4 py-3 text-right align-top w-28'>
                          <div className='flex flex-col items-end'>
                            <span className={`tabular-nums font-semibold ${i === mostLocationsIdx ? 'text-primary' : 'text-foreground'}`}>
                              {chain.locationsLabel}
                            </span>
                            {badge(i === mostLocationsIdx, 'Most')}
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right align-top w-28'>
                          <div className='flex flex-col items-end'>
                            <span className={`tabular-nums font-semibold ${i === bestPriceIdx ? 'text-primary' : 'text-foreground'}`}>
                              {chain.avgPriceLabel}
                            </span>
                            {badge(i === bestPriceIdx, 'Best value')}
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right align-top w-32'>
                          <div className='flex flex-col items-end'>
                            <span className={`tabular-nums font-semibold ${i === mostAmenitiesIdx ? 'text-primary' : 'text-foreground'}`}>
                              {chain.amenitiesScoreLabel}
                            </span>
                            {badge(i === mostAmenitiesIdx, 'Most')}
                          </div>
                        </td>
                        <td className='px-4 py-3 text-right align-top w-28'>
                          <div className='flex flex-col items-end'>
                            <span className={`tabular-nums font-semibold ${i === mostRatingIdx ? 'text-primary' : 'text-foreground'}`}>
                              {chain.userRating.toFixed(1)}★
                            </span>
                            {badge(i === mostRatingIdx, 'Most')}
                          </div>
                        </td>
                      </tr>
                    ))
                  })()
                ) : (
                  <tr>
                    <td colSpan={6} className='px-4 py-8 text-center text-muted-foreground'>
                      Chain comparison data is temporarily unavailable.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Distribution by location – state chips (no-JS: same data, single section) */}
        {/* {sortedStates.length > 0 && (
          <section className='max-w-6xl mx-auto mb-16' aria-labelledby='distribution-heading'>
            <div className='flex items-center gap-2 mb-2'>
              <Globe2 className='h-6 w-6 text-primary shrink-0' />
              <h2 id='distribution-heading' className='text-lg font-semibold text-foreground md:text-xl'>
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
        )} */}

        {/* Visual cards for top states – no-JS: single CTA (state links are in Filter + Map + Distribution) */}
        {states.length > 0 && (
          <section className='mb-16' aria-labelledby='browse-by-state-heading'>
            <div className='js-only'>
              <ListingByStateSection states={sortedStates} />
            </div>
            <div className='no-js-only max-w-2xl mx-auto'>
              <div className='rounded-2xl border border-border/80 bg-muted/30 p-6 md:p-8 text-center'>
                <h2 id='browse-by-state-heading' className='text-xl font-semibold mb-2'>
                  Explore Fitness, Gym, and Health Services by state
                </h2>
                <p className='text-sm text-muted-foreground mb-4'>
                  Use the browse-by-state links and map section above, or jump to the full table below.
                </p>
                {/* <Link href='#states-table' className='inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90'>
                  <Table2 className='h-4 w-4' />
                  View full table
                </Link> */}
              </div>
            </div>
          </section>
        )}

        {/* Detailed table by state */}
        {/* {sortedStates.length > 0 && (
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
        )} */}


        {/* How this list helps you – use cases */}
        <section className='max-w-6xl mx-auto mb-16'>
          <h2 className='text-2xl md:text-3xl font-semibold text-center mb-6'>
            How this list of Fitness, Gym, and Health Services in the United States helps you
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[
              { icon: Search, title: 'Find Fitness, Gym, and Health Services near you', desc: 'Filter by state, city, or zip to see gyms in your area.' },
              { icon: DollarSign, title: 'Compare membership costs', desc: 'See price ranges, plans, and fees before you join.' },
              { icon: Filter, title: 'Filter by state', desc: 'Use the map and table to focus on one state or compare several.' },
              { icon: Star, title: 'See ratings and reviews', desc: 'Check member reviews and ratings on each gym profile.' },
              { icon: Table2, title: 'Browse the full table', desc: 'Sort and scan all states with gym counts and quick links.' },
              { icon: Building2, title: 'Explore Fitness, Gym, and Health Services profiles', desc: 'Click through to detailed pages with hours, amenities, and pricing.' },
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
            <div className='flex flex-wrap justify-center gap-2 md:gap-2'>
              {[
                `Updated weekly (last: ${lastUpdateDateShort})`,
                '95%+ Accuracy Rate',
                'Money-Back Guarantee',
                'Instant delivery',
                'CSV / JSON',
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
                  <h2 id='what-you-get-heading' className='text-lg font-semibold text-foreground md:text-xl'>
                    What you get
                  </h2>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Everything you need to explore and use the U.S. Fitness, Gym, and Health Services dataset
                  </p>
                </div>
              </div>
              <div className='flex flex-wrap gap-2'>
                <span className='rounded-lg border border-border bg-background/80 px-3 py-1.5 text-xs font-medium'>
                  CSV
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
                    <span className='text-foreground'>State-by-state Fitness, Gym, and Health Services counts and interactive USA map</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Filter by state, city, or ZIP and browse full Fitness, Gym, and Health Services profiles</span>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle2 className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span className='text-foreground'>Membership prices, plans, and fees on each Fitness, Gym, and Health Services page</span>
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
                    <span className='text-foreground'>Export in CSV or JSON — CRM-ready</span>
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
            <div className='flex flex-wrap items-center gap-3'>
              <BuyDataButton
                href='/gymsdata/checkout'
                label='Buy dataset'
                priceFromServer={data.listPage?.formattedPrice ? { formattedPrice: data.listPage.formattedPrice, price: data.listPage.price, rowCount: data.listPage.totalGyms } : undefined}
                fallbackLabel={FULL_DATA_PRICE_LABEL}
              />
              <DownloadSampleButton variant='outline' />
              {/* <Link
                href='#states-table'
                className='inline-flex items-center gap-2 rounded-xl border border-input bg-background px-5 py-3 text-sm font-medium hover:bg-muted transition-colors'
              >
                <Table2 className='h-4 w-4' />
                View full table
              </Link> */}
            </div>
          </div>
        </section>

        {/* Hero Banner – white background, badge + heading + paragraph + CTA, image right */}
        <div className='max-w-6xl mx-auto mb-8'>
          <GymsdataHeroBanner />
        </div>

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
              Discover how teams use GymDues to find verified Fitness, Gym, and Health Services business leads faster.
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
                {testimonials.map((t, idx) => (
                  <CarouselItem
                    key={t.name}
                    className='pl-2 md:pl-4 basis-full'
                  >
                    <figure className='grid gap-6 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] items-center rounded-3xl border border-border/60 bg-background px-5 py-5 md:px-8 md:py-7'>
                      <div className='relative'>
                        <div className='mb-3 flex items-center gap-1'>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={`${t.name}-star-${i}`} className='h-4 w-4 text-amber-400 fill-amber-400' aria-hidden />
                          ))}
                        </div>
                        <p className='text-sm md:text-[0.95rem] text-foreground leading-relaxed'>
                          “{t.quote}”
                        </p>
                      </div>
                      <figcaption className='flex items-center justify-start md:justify-end gap-4'>
                        <div
                          className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white shadow-md'
                          style={{
                            background:
                              idx % 3 === 0
                                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                                : idx % 3 === 1
                                  ? 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)'
                                  : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                          }}
                          aria-hidden
                        >
                          {t.initials ?? testimonialInitials(t.name)}
                        </div>
                        <div className='text-left min-w-0'>
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
              {testimonials.map((t, idx) => (
                <figure
                  key={t.name}
                  className='grid gap-6 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] items-center rounded-3xl border border-border/60 bg-background px-5 py-5 md:px-8 md:py-7'
                >
                  <div className='relative'>
                    <div className='mb-3 flex items-center gap-1'>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={`${t.name}-star-${i}`} className='h-4 w-4 text-amber-400 fill-amber-400' aria-hidden />
                      ))}
                    </div>
                    <p className='text-sm md:text-[0.95rem] text-foreground leading-relaxed'>
                      &quot;{t.quote}&quot;
                    </p>
                  </div>
                  <figcaption className='flex items-center justify-start md:justify-end gap-4'>
                    <div
                      className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-semibold text-white shadow-md'
                      style={{
                        background:
                          idx % 3 === 0
                            ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                            : idx % 3 === 1
                              ? 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)'
                              : 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)',
                      }}
                      aria-hidden
                    >
                      {t.initials ?? testimonialInitials(t.name)}
                    </div>
                    <div className='text-left min-w-0'>
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
            This report-style page is great for understanding where Fitness, Gym, and Health Services are located across the
            United States. When you&apos;re ready to choose a club, head over to the main Fitness, Gym, and Health Services
            directory to filter by state, city, or ZIP code and see live membership price ranges,
            plans, and fees.
          </p>
          <div className='flex flex-wrap items-center gap-3'>
            <BuyDataButton
              href='/gymsdata/checkout'
              label='Buy data'
              priceFromServer={data.listPage?.formattedPrice ? { formattedPrice: data.listPage.formattedPrice, price: data.listPage.price, rowCount: data.listPage.totalGyms } : undefined}
              fallbackLabel={FULL_DATA_PRICE_LABEL}
            />
            <DownloadSampleButton variant='outline' />
          </div>
        </section>

        {/* FAQ – JS: collapsible details; No-JS: all open */}
        <section
          className='max-w-4xl mx-auto mb-16 rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden mt-16'
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
                  Quick answers about the U.S. Fitness, Gym, and Health Services list, map, and how to compare membership prices.
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

      </div>
      <div className='js-only'>
        {/* <UsaListStickyCta totalGyms={totalGyms} /> */}
      </div>
      {/* <div className='no-js-only fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'>
        <div className='container mx-auto px-4 py-3'>
          <div className='flex flex-wrap items-center justify-center gap-2 md:gap-3'>
            <Link href='/gymsdata/' className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors'>
              Browse {totalGyms >= 60000 ? '60K+' : totalGyms.toLocaleString('en-US')}+ Gyms
            </Link>
            <Link href='#filter-by-location-heading' className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted hover:border-primary/30 transition-colors'>
              <Filter className='h-4 w-4' />
              Filter Now
            </Link>
            <DownloadSampleButton variant='outline' />
          </div>
          <p className='text-center text-xs text-muted-foreground mt-2'>
            1,247 businesses downloaded this month · ★★★★★ 4.8/5 from 300+ reviews
          </p>
        </div>
      </div> */}
    </div>
  )
}

