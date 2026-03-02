import type { Metadata } from 'next'
import Link from 'next/link'
import { getListPageData, getCitiesByState } from '@/lib/gyms-api'
import {
  getStateBySlug,
  getCityBySlug,
  getCitiesInState,
  cityGymsdataPath,
  stateGymsdataPath,
  getCityDerivedStats,
  getTopNeighborhoods,
  formatDataDate,
  toSlug,
} from '@/lib/gymsdata-utils'
import { MapPin, Building2, Mail, Phone, Share2, Star } from 'lucide-react'
import { GymsdataMiniMap } from '../../_components/gymsdata-mini-map'
import { DownloadSampleButton } from '@/components/download-sample-button'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

type Props = { params: Promise<{ state: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params
  const { states, locations } = await getListPageData()
  const state = getStateBySlug(states, stateSlug)
  const stateCode = state?.state ?? null
  const citiesFromApiMeta = stateCode ? await getCitiesByState(stateCode) : []
  const citiesForState = stateCode
    ? (citiesFromApiMeta.length > 0 ? citiesFromApiMeta : getCitiesInState(locations, stateCode, state?.stateName))
    : []
  const loc = stateCode && state ? getCityBySlug(citiesForState, stateCode, citySlug, state.stateName) : null
  if (!state || !loc) return { title: 'City Not Found | Gymdues' }
  const cityName = loc.city ?? loc.label ?? 'City'
  const count = loc.count ?? 0
  const title = `List of Gyms in ${cityName}, ${state.stateName} - ${count.toLocaleString('en-US')} Verified Contacts | Gymdues`
  const description = `${count.toLocaleString('en-US')} gyms in ${cityName}, ${state.stateName}. Verified contact database with emails and phone numbers.`
  const canonical = new URL(`/gymsdata/${stateSlug}/${citySlug}`, siteUrl).toString()
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  }
}

export async function generateStaticParams() {
  const { states, locations } = await getListPageData()
  const params: { state: string; city: string }[] = []
  for (const state of states) {
    const stateSlug = toSlug(state.stateName)
    const cities = getCitiesInState(locations, state.state, state.stateName)
    for (const loc of cities) {
      const cityName = loc.city ?? loc.label
      if (cityName) params.push({ state: stateSlug, city: toSlug(cityName) })
    }
  }
  return params
}

export default async function GymsdataCityPage({ params }: Props) {
  const { state: stateSlug, city: citySlug } = await params
  const { states, locations } = await getListPageData()
  const state = getStateBySlug(states, stateSlug)
  const stateCode = state?.state ?? null
  const citiesFromApi = stateCode ? await getCitiesByState(stateCode) : []
  const citiesInState = stateCode
    ? (citiesFromApi.length > 0 ? citiesFromApi : getCitiesInState(locations, stateCode, state.stateName))
    : []
  const loc = stateCode ? getCityBySlug(citiesInState, stateCode, citySlug, state.stateName) : null

  if (!state || !loc) {
    return (
      <main className='min-h-screen container mx-auto px-4 py-16'>
        <h1 className='text-2xl font-bold mb-4'>City not found</h1>
        <Link href={state ? stateGymsdataPath(state) : '/gymsdata'} className='text-primary hover:underline'>
          Back to {state?.stateName ?? 'states'}
        </Link>
      </main>
    )
  }

  const cityName = loc.city ?? loc.label ?? 'City'
  const count = loc.count ?? 0
  const stats = getCityDerivedStats(count, citySlug)
  const neighborhoods = getTopNeighborhoods(cityName, count)
  const dateStr = formatDataDate()
  const nearbyCities = citiesInState.filter((c) => (c.city ?? c.label) !== cityName).slice(0, 6)
  const statePath = stateGymsdataPath(state)

  return (
    <main className='min-h-screen'>
      {/* Above the fold */}
      <div className='border-b bg-muted/30'>
        <div className='container mx-auto px-4 py-8'>
          <nav className='text-sm text-muted-foreground mb-4' aria-label='Breadcrumb'>
            <Link href='/' className='hover:text-primary'>Home</Link>
            <span className='mx-2'>/</span>
            <Link href='/list-of-gyms-in-united-states' className='hover:text-primary'>List of Gyms in United States</Link>
            <span className='mx-2'>/</span>
            <Link href={statePath} className='hover:text-primary'>{state.stateName}</Link>
            <span className='mx-2'>/</span>
            <span className='text-foreground font-medium'>{cityName}</span>
          </nav>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
            List of Gyms in {cityName}, {state.stateName} - {count.toLocaleString('en-US')} Verified Contacts
          </h1>

          {/* Key stats widget */}
          <div className='mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{count.toLocaleString('en-US')}</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>Gyms</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{stats.pctEmail}%</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>With email</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{stats.pctPhone}%</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>With phone</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{stats.avgRating}</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>Avg rating</p>
            </div>
          </div>

          {/* Interactive mini-map */}
          <div className='mt-6'>
            <GymsdataMiniMap state={state} />
          </div>

          {/* Download CTA */}
          <div className='mt-6 flex flex-wrap gap-3'>
            <DownloadSampleButton variant='primary' />
            <Link
              href={`/gymsdata#location=${encodeURIComponent(loc.label ?? `${cityName}, ${state.state}`)}`}
              className='inline-flex items-center gap-2 rounded-xl border-2 border-input bg-background px-5 py-2.5 text-sm font-semibold hover:bg-muted'
            >
              <Building2 className='h-4 w-4' />
              View gyms & map in {cityName}
            </Link>
          </div>
        </div>
      </div>

      {/* Body: Auto-generated SEO content */}
      <div className='container mx-auto px-4 py-10 max-w-3xl'>
        <h2 className='text-2xl font-bold mb-4'>
          Gyms in {cityName} – Complete Contact Database
        </h2>
        <div className='prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground'>
          <p>
            There are <strong className='text-foreground'>{count.toLocaleString('en-US')}</strong> gyms
            in <strong className='text-foreground'>{cityName}, {state.stateName}</strong> as of {dateStr}.
          </p>
          <p>
            The top 3 areas are <strong className='text-foreground'>{neighborhoods[0].name}</strong> with{' '}
            {neighborhoods[0].gyms.toLocaleString('en-US')} gyms,{' '}
            <strong className='text-foreground'>{neighborhoods[1].name}</strong> with{' '}
            {neighborhoods[1].gyms.toLocaleString('en-US')} gyms, and{' '}
            <strong className='text-foreground'>{neighborhoods[2].name}</strong> with{' '}
            {neighborhoods[2].gyms.toLocaleString('en-US')} gyms.
          </p>
          <ul className='list-disc pl-6 space-y-1'>
            <li>{stats.pctEmail}% have email addresses</li>
            <li>{stats.pctPhone}% have verified phone numbers</li>
            <li>{stats.pctSocial}% maintain active social media</li>
            <li>Average rating: {stats.avgRating} stars</li>
          </ul>
        </div>

        {/* Internal linking: nearby cities, state page */}
        <section className='mt-10 pt-8 border-t' aria-label='Related pages'>
          <h3 className='font-semibold text-lg mb-3'>Nearby cities</h3>
          <ul className='flex flex-wrap gap-2'>
            {nearbyCities.map((c) => (
              <li key={c.label ?? c.city ?? ''}>
                <Link
                  href={cityGymsdataPath(stateSlug, c.city ?? '')}
                  className='inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted hover:border-primary/40'
                >
                  <MapPin className='h-3.5 w-3.5 text-primary' />
                  {c.city ?? c.label} ({c.count.toLocaleString('en-US')})
                </Link>
              </li>
            ))}
          </ul>
          <p className='mt-4'>
            <Link href={statePath} className='text-primary hover:underline font-medium'>
              ← Back to all cities in {state.stateName}
            </Link>
          </p>
          <p className='mt-2'>
            <Link href='/gymsdata' className='text-primary hover:underline font-medium'>
              Browse all gyms
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}
