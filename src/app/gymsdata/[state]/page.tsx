import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getListPage, getListPageData, getGymsdataForState } from '@/lib/gymsdata-api'
import { getStateBySlug, getTypeBySlug, cityGymsdataPath, stateGymsdataPath, formatDataDate, toUrlSegment } from '@/lib/gymsdata-utils'
import { MapPin } from 'lucide-react'
import { DownloadSampleButton } from '@/components/download-sample-button'
import { FULL_DATA_PRICE_LABEL } from '../_constants'
import { BuyDataButton } from '../_components/buy-data-button'
import { GymsdataMiniMap } from '../_components/gymsdata-mini-map'
import { StateCitiesFilter } from '../_components/state-cities-filter'
import { GymsdataTypePageContent } from '../_components/gymsdata-type-page-content'
import { getGymsdataBasePath, getGymsdataCanonicalUrl } from '../_lib/get-gymsdata-base-path'
import { buildBreadcrumbSchema, buildProductSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'

type Props = { params: Promise<{ state: string }> }

/** Resolve first segment: type slug (13 types) takes precedence, then state. */
async function resolveSegment(segment: string) {
  const listPage = await getListPage()
  const types = listPage?.types ?? []
  const states = listPage?.states ?? []
  const typeItem = getTypeBySlug(types, segment)
  if (typeItem) return { kind: 'type' as const, typeItem, types }
  const state = getStateBySlug(states, segment)
  if (state) return { kind: 'state' as const, state }
  return null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSegment } = await params
  const segment = (stateSegment ?? '').trim()
  const resolved = await resolveSegment(segment)
  if (!resolved) return { title: 'Not Found | Gymdues' }
  if (resolved.kind === 'type') {
    const { typeItem } = resolved
    const title = `${typeItem.type} - ${typeItem.count.toLocaleString('en-US')} Verified Contacts | Gymdues`
    const description = `List of ${typeItem.type} in the United States. ${typeItem.count.toLocaleString('en-US')}+ verified contacts. Download sample or buy full dataset.`
    const canonical = await getGymsdataCanonicalUrl(toUrlSegment(typeItem.typeSlug))
    return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
  }
  const { state } = resolved
  const title = `List of Gyms in ${state.stateName} - ${state.count.toLocaleString('en-US')} Verified Contacts | Gymdues`
  const description = `Browse gyms in ${state.stateName} by city. ${state.count.toLocaleString('en-US')}+ verified contacts. Download CSV or view by city.`
  const canonical = await getGymsdataCanonicalUrl(toUrlSegment(state.stateName))
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical } }
}

export async function generateStaticParams() {
  const listPage = await getListPage()
  const { states } = await getListPageData()
  const types = listPage?.types ?? []
  const stateParams = states.map((s) => ({ state: toUrlSegment(s.stateName) }))
  const typeParams = types.map((t) => ({ state: toUrlSegment(t.typeSlug) }))
  return [...stateParams, ...typeParams]
}

export default async function GymsdataStatePage({ params }: Props) {
  const { state: stateSegment } = await params
  const segment = (stateSegment ?? '').trim()
  const resolved = await resolveSegment(segment)
  if (!resolved) notFound()

  const base = await getGymsdataBasePath()
  const homeHref = base === '' ? '/' : `${base}/`

  if (resolved.kind === 'type') {
    return <GymsdataTypePageContent typeItem={resolved.typeItem} types={resolved.types} base={base} />
  }

  const stateParam = segment
  const data = await getGymsdataForState(stateParam)

  if (data.notFound || !data.state || !data.displayState) {
    return (
      <main className='min-h-screen container mx-auto px-4 py-16'>
        <h1 className='text-2xl font-bold mb-4'>State not found</h1>
        <Link href={homeHref} className='text-primary hover:underline'>
          View all states
        </Link>
      </main>
    )
  }
  const state = data.state
  const displayState = data.displayState
  const { stateStats, cities, topThreeCities } = data
  const dateStr = formatDataDate()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'
  const statePath = stateGymsdataPath(state, base)
  const schemaBreadcrumb = buildBreadcrumbSchema(
    [
      { name: 'Home', url: homeHref },
      { name: displayState.stateName ?? state.stateName ?? '', url: statePath },
    ],
    siteUrl.replace(/\/$/, '')
  )
  const statePrice = typeof data.statePage?.price === 'number' ? data.statePage.price : parseFloat(String(data.statePage?.price ?? 249)) || 249
  const schemaProduct = buildProductSchema({
    name: `Fitness, Gym, and Health Services Data - ${displayState.stateName ?? state.stateName}`,
    description: `${displayState.count.toLocaleString('en-US')}+ verified contacts in ${displayState.stateName}. CSV/JSON. Updated weekly.`,
    brandName: 'Gymdues',
    price: statePrice,
    seller: { name: 'Gymdues', url: siteUrl },
  })

  return (
    <main className='min-h-screen'>
      <JsonLdSchema data={[schemaBreadcrumb, schemaProduct]} />
      <div className='border-b bg-muted/30'>
        <div className='container mx-auto px-4 py-8'>
          <nav className='text-sm text-muted-foreground mb-4' aria-label='Breadcrumb'>
            <ol className='flex flex-wrap items-center gap-1'>
              <li><Link href={homeHref} className='hover:text-primary'>Home</Link></li>
              <li aria-hidden>/</li>
              <li className='text-foreground font-medium'>{displayState.stateName}</li>
            </ol>
          </nav>
          <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
            List of Gyms in {displayState.stateName} - {displayState.count.toLocaleString('en-US')} Verified Contacts
          </h1>

          {/* Key stats widget */}
          <div className='mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4'>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{displayState.count.toLocaleString('en-US')}</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>Gyms</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{cities.length.toLocaleString('en-US')}</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>Cities</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{stateStats.pctEmail}%</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>With email</p>
            </div>
            <div className='rounded-xl border border-border/80 bg-card px-4 py-3 text-center'>
              <p className='text-2xl font-bold tabular-nums'>{stateStats.pctPhone}%</p>
              <p className='text-xs text-muted-foreground uppercase tracking-wide'>With phone</p>
            </div>
          </div>

          {/* Overview left, Map right */}
          <div className='mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
            <div className='min-w-0'>
              <h2 className='text-2xl font-bold mb-4'>
                Gyms in {displayState.stateName} – Overview
              </h2>
              <div className='prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground'>
                <p>
                  There are <strong className='text-foreground'>{displayState.count.toLocaleString('en-US')}</strong> gyms
                  in <strong className='text-foreground'>{displayState.stateName}</strong> as of {dateStr}.
                </p>
                {topThreeCities.length >= 3 ? (
                  <p>
                    The top 3 cities are <strong className='text-foreground'>{topThreeCities[0].name}</strong> with{' '}
                    {topThreeCities[0].gyms.toLocaleString('en-US')} gyms,{' '}
                    <strong className='text-foreground'>{topThreeCities[1].name}</strong> with{' '}
                    {topThreeCities[1].gyms.toLocaleString('en-US')} gyms, and{' '}
                    <strong className='text-foreground'>{topThreeCities[2].name}</strong> with{' '}
                    {topThreeCities[2].gyms.toLocaleString('en-US')} gyms.
                  </p>
                ) : topThreeCities.length > 0 ? (
                  <p>
                    Top {topThreeCities.length} cit{topThreeCities.length === 1 ? 'y' : 'ies'}:{' '}
                    {topThreeCities.map((c, i) => (
                      <span key={c.name}>
                        <strong className='text-foreground'>{c.name}</strong> ({c.gyms.toLocaleString('en-US')} gyms)
                        {i < topThreeCities.length - 1 ? ', ' : ''}
                      </span>
                    ))}.
                  </p>
                ) : null}
                <ul className='list-disc pl-6 space-y-1'>
                  <li>{stateStats.pctEmail}% have email addresses</li>
                  <li>{stateStats.pctPhone}% have verified phone numbers</li>
                  <li>{stateStats.pctSocial}% maintain active social media</li>
                  <li>Average rating: {stateStats.avgRating} stars</li>
                </ul>
              </div>
            </div>
            <div className='min-w-0'>
              <GymsdataMiniMap state={displayState} />
            </div>
          </div>

          {/* Download CTA */}
          <div className='mt-6 flex flex-wrap items-center gap-3'>
            <DownloadSampleButton variant='outline' filter={{ state: stateParam }} base={base} />
            <BuyDataButton
              href={base ? `${base}/checkout?state=${encodeURIComponent(stateParam)}` : `/checkout?state=${encodeURIComponent(stateParam)}`}
              label='Buy data'
              priceFromServer={data.statePage?.formattedPrice ? { formattedPrice: data.statePage.formattedPrice, price: data.statePage.price, rowCount: data.statePage.totalGyms } : undefined}
              fallbackLabel={FULL_DATA_PRICE_LABEL}
            />
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-10'>
        <h2 className='text-xl font-semibold mb-4'>Cities in {state.stateName}</h2>
        <p className='text-muted-foreground mb-6'>
          Click a city to see the full list of gyms and verified contacts in that area.
        </p>
        {cities.length > 0 ? (
          <StateCitiesFilter cities={cities} stateSlug={state.stateName} base={base} />
        ) : (
          <p className='text-muted-foreground'>
            City-level data for {state.stateName} is being updated. You can still{' '}
            <Link href={`${base === '' ? '/' : base || '/gymsdata'}#state=${encodeURIComponent(state.state)}`} className='text-primary hover:underline'>
              browse all gyms in {state.stateName}
            </Link>.
          </p>
        )}

        {/* Internal Linking Strategy */}
        <section className='mt-12 pt-8 border-t' aria-label='Internal linking'>
          {/* <h2 className='text-xl font-semibold mb-4'>Internal Linking</h2> */}

          <div className='space-y-6'>
            {/* Link to nearby cities */}
            <div>
              <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2'>
                Nearby cities
              </h3>
              <ul className='flex flex-wrap gap-2'>
                {cities.slice(0, 10).map((loc) => (
                  <li key={loc.label ?? `${loc.city}-${loc.state}`}>
                    <Link
                      href={cityGymsdataPath(state.stateName, loc.city ?? '', base)}
                      className='inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-muted hover:border-primary/40 text-primary'
                    >
                      <MapPin className='h-3.5 w-3.5 shrink-0' aria-hidden />
                      {loc.city ?? loc.label} ({loc.count.toLocaleString('en-US')})
                    </Link>
                  </li>
                ))}
              </ul>
              {cities.length === 0 && (
                <p className='text-sm text-muted-foreground'>
                  <Link href={`${base === '' ? '/' : base || '/gymsdata'}#state=${encodeURIComponent(state.state)}`} className='text-primary hover:underline'>
                    View gyms in {state.stateName}
                  </Link>
                </p>
              )}
            </div>

            {/* Link to state page */}
            {/* <div>
              <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2'>
                State & directory
              </h3>
              <ul className='flex flex-wrap gap-2 text-sm'>
                <li>
                  <Link href={homeHref} className='text-primary hover:underline font-medium'>
                    List of Fitness, Gym, and Health Services in United States
                  </Link>
                </li>
                <li>
                  <Link href={statePath} className='text-primary hover:underline font-medium'>
                    {state.stateName} (this page)
                  </Link>
                </li>
                <li>
                  <Link href={`${base === '' ? '/' : base || '/'}#state=${encodeURIComponent(state.state)}`} className='text-primary hover:underline font-medium'>
                    View gyms in {state.stateName}
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Link to gym type pages */}
            {/* <div>
              <h3 className='font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2'>
                Gym type pages
              </h3>
              <ul className='flex flex-wrap gap-2 text-sm'>
                <li>
                  <Link href={homeHref} className='text-primary hover:underline font-medium'>
                    Browse all gyms
                  </Link>
                </li>
                <li>
                  <Link href='/best-gyms' className='text-primary hover:underline font-medium'>
                    Best Gyms
                  </Link>
                </li>
                <li>
                  <Link href={`/best-gyms/${toSlug(state.stateName)}?type=state`} className='text-primary hover:underline font-medium'>
                    Best gyms in {state.stateName}
                  </Link>
                </li>
              </ul>
            </div> */}

          </div>
        </section>
      </div>
    </main>
  )
}
