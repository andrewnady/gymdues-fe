/**
 * Gymsdata API – second database (PostgreSQL) for gymsdata site.
 * All endpoints under GET /api/v1/gymsdata/ per GYMSDATA_API.md.
 */

import { getApiBaseUrl } from './api-config'
import type { StateWithCount, LocationWithCount } from '@/types/gym'
const API_BASE_URL = getApiBaseUrl()
const GYMSDATA_BASE = `${API_BASE_URL}/api/v1/gymsdata`

const LIST_PAGE_FETCH_TIMEOUT_MS = 18_000


export interface GymsdataStateItem {
  state: string
  stateName: string
  stateSlug?: string
  count: number
  pct?: number
  imageUrl?: string
  price?: number
  formattedPrice?: string
}

export interface GymsdataLocationItem {
  label: string
  city: string
  state: string
  stateName?: string
  postal_code?: string
  count: number
}

export interface GymsdataTypeItem {
  type: string
  typeSlug: string
  count: number
  pct?: number
  price?: number
  formattedPrice?: string
}

export interface GymsdataListPageResponse {
  totalGyms: number
  statesCovered: number
  states: GymsdataStateItem[]
  typesCovered?: number
  types?: GymsdataTypeItem[]
  /** Full-dataset price from row count (when backend provides it). */
  price?: number
  formattedPrice?: string
  withEmail?: number
  withPhone?: number
  withPhoneAndEmail?: number
  withWebsite?: number
  withFacebook?: number
  withInstagram?: number
  withTwitter?: number
  withLinkedin?: number
  withYoutube?: number
  ratedCount?: number
  sample?: Array<Record<string, unknown>>
}

export interface GymsdataStatePageResponse {
  state: string
  stateName: string
  stateSlug?: string
  totalGyms: number
  citiesCount: number
  pctWithEmail?: number
  pctWithPhone?: number
  pctWithSocial?: number
  avgRating?: number
  /** State-level price from row count. */
  price?: number
  formattedPrice?: string
  topCities: Array<{ city: string; count: number; label?: string; price?: number; formattedPrice?: string }>
  imageUrl?: string
  cities?: Array<{ label: string; city: string; state: string; stateName?: string; postal_code?: string; count: number; price?: number; formattedPrice?: string }>
  nearbyCities?: Array<{ label: string; city: string; count: number }>
}

export interface GymsdataCityPageResponse {
  state: string
  stateName: string
  stateSlug?: string
  city: string
  totalGyms: number
  pctWithEmail?: number
  pctWithPhone?: number
  pctWithSocial?: number
  avgRating?: number
  /** City-level price from row count. */
  price?: number
  formattedPrice?: string
  topAreas?: Array<{ area: string; count: number; label: string }>
  nearbyCities?: Array<{ city: string; count: number; label: string; price?: number; formattedPrice?: string }>
  imageUrl?: string
}

export interface GymsdataTopCitiesResponse {
  cities: Array<{
    rank?: number
    city: string
    state: string
    stateName?: string
    postal_code?: string
    label: string
    count: number
  }>
}

export interface GymsdataChainComparisonResponse {
  chains: Array<{
    chainName: string
    locations: number
    locationsLabel: string
    avgPrice: number
    avgPriceLabel: string
    amenitiesScore: number
    amenitiesScoreLabel: string
    userRating: number
    /** Slug for link to /gyms/{path} (e.g. "la-fitness"). */
    path?: string
  }>
}

export interface GymsdataTestimonialsResponse {
  testimonials: Array<{
    quote: string
    rating: number
    authorName: string
    authorTitle: string
    initials: string
  }>
}

export interface GymsdataIndustryTrendsResponse {
  newGymsByMonth: Array<{ month: string; monthKey: string; count: number }>
  mostGrowingCities: Array<{
    rank: number
    city: string
    state: string
    stateName: string
    label: string
    growth: number
    count: number
    period: string | null
  }>
  categories: Array<{ category: string; count: number; percentage: number }>
  franchiseVsIndependent: Array<{
    quarter: string
    quarterKey: string
    franchise: number
    independent: number
  }>
}

export interface GymsdataStateComparisonItem {
  state: string
  stateName: string
  stateSlug?: string
  totalGyms: number
  withEmail: number
  withPhone: number
  avgRating: number
  densityPer100k: number
  imageUrl?: string
}

export interface GymsdataStateComparisonResponse {
  states: GymsdataStateComparisonItem[]
}

export interface GymsdataCitiesAndStatesResponse {
  states: GymsdataStateItem[]
  cities: Array<{ city: string; count: number }>
}

export interface ListPageData {
  states: StateWithCount[]
  locations: LocationWithCount[]
}

// --- Helpers ---

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options ?? { next: { revalidate: 300 } })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

// --- Endpoints ---

export interface SampleDownloadResult {
  blob: Blob
  filename: string
}

/**
 * Optional filters for sample-download: state (slug e.g. california), city (slug e.g. los-angeles; requires state), type (e.g. Gym).
 */
export interface SampleDownloadFilters {
  state?: string
  city?: string
  type?: string
}

/**
 * POST /api/v1/gymsdata/sample-download – submit name + email; optional state, city (with state), type; returns CSV + email copy.
 * Call from client (browser) to trigger file download. Returns blob and suggested filename; throws on error.
 */
export async function submitSampleDownload(
  name: string,
  email: string,
  filters?: SampleDownloadFilters
): Promise<SampleDownloadResult> {
  const url = `${GYMSDATA_BASE}/sample-download`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GYM_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_GYM_API_KEY}`
  }

  const body: Record<string, string> = { name: name.trim(), email: email.trim() }
  if (filters?.state) body.state = filters.state.trim()
  if (filters?.city) body.city = filters.city.trim()
  if (filters?.type) body.type = filters.type.trim()
  
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Sample download failed (${res.status})`)
  }

  let filename = 'gymdues-sample'
  if (filters?.type) filename += `-${filters.type.replace(/\s+/g, '-').toLowerCase()}`
  if (filters?.state) filename += `-${filters.state.replace(/\s+/g, '-').toLowerCase()}`
  if (filters?.city) filename += `-${filters.city.replace(/\s+/g, '-').toLowerCase()}`
  filename += '.xlsx'
  const disposition = res.headers.get('Content-Disposition')
  if (disposition) {
    const match = /filename\*?=(?:UTF-8'')?["']?([^"'\s;]+)["']?/i.exec(disposition) ?? /filename=["']?([^"'\s;]+)["']?/i.exec(disposition)
    if (match?.[1]) filename = match[1].trim()
  }

  return { blob: await res.blob(), filename }
}

/** Response from POST /api/v1/gymsdata/checkout – Stripe session URL. */
export interface GymsdataCheckoutResponse {
  url: string
}

/**
 * POST /api/v1/gymsdata/checkout – create Stripe Checkout session.
 * Body: name, email; optional state, city (with state), type. Amount from scope (row count).
 * Returns session URL to redirect the user to Stripe Checkout.
 */
export async function submitCheckout(
  name: string,
  email: string,
  filters?: SampleDownloadFilters
): Promise<GymsdataCheckoutResponse> {
  const url = `${GYMSDATA_BASE}/checkout`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_GYM_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.NEXT_PUBLIC_GYM_API_KEY}`
  }
  const body: Record<string, string> = { name: name.trim(), email: email.trim() }
  if (filters?.state) body.state = filters.state.trim()
  if (filters?.city) body.city = filters.city.trim()
  if (filters?.type) body.type = filters.type.trim()

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Checkout failed (${res.status})`)
  }
  const data = (await res.json()) as GymsdataCheckoutResponse
  if (!data?.url) throw new Error('No checkout URL returned')
  return data
}

/**
 * GET /api/v1/gymsdata/states – states with gym counts.
 */
export async function getStates(): Promise<StateWithCount[]> {
  const data = await fetchJson<GymsdataStateItem[]>(`${GYMSDATA_BASE}/states`)
  if (!Array.isArray(data)) return []
  return data.map((s) => ({
    state: s.state,
    stateName: s.stateName,
    count: s.count,
  }))
}

/**
 * GET /api/v1/gymsdata/locations – city+state+postal with counts. Optional q for filter.
 */
export async function getLocations(q?: string): Promise<LocationWithCount[]> {
  const url = new URL(`${GYMSDATA_BASE}/locations`)
  if (q?.trim()) url.searchParams.set('q', q.trim())
  const data = await fetchJson<GymsdataLocationItem[]>(url.toString())
  if (!Array.isArray(data)) return []
  return data.map((loc) => ({
    label: loc.label,
    city: loc.city ?? null,
    state: loc.state ?? null,
    postal_code: loc.postal_code ?? null,
    count: loc.count ?? 0,
  }))
}

/**
 * GET /api/v1/gymsdata/cities-and-states – one-shot states + cities.
 */
export async function getCitiesAndStates(): Promise<GymsdataCitiesAndStatesResponse | null> {
  return fetchJson<GymsdataCitiesAndStatesResponse>(`${GYMSDATA_BASE}/cities-and-states`)
}

/**
 * GET /api/v1/gymsdata/cities – cities in a state. Optional sort, group_by, limit, offset, min_count, max_count.
 */
export async function getCitiesByState(
  state: string,
  options?: { sort?: 'count' | 'name'; group_by?: 'location' | 'city'; limit?: number; offset?: number; min_count?: number; max_count?: number }
): Promise<LocationWithCount[]> {
  if (!state?.trim()) return []
  const url = new URL(`${GYMSDATA_BASE}/cities`)
  url.searchParams.set('state', state.trim())
  if (options?.sort) url.searchParams.set('sort', options.sort)
  if (options?.group_by) url.searchParams.set('group_by', options.group_by)
  if (options?.limit != null && options.limit >= 1 && options.limit <= 500) url.searchParams.set('limit', String(options.limit))
  if (options?.offset != null) url.searchParams.set('offset', String(options.offset))
  if (options?.min_count != null) url.searchParams.set('min_count', String(options.min_count))
  if (options?.max_count != null) url.searchParams.set('max_count', String(options.max_count))
  const data = await fetchJson<GymsdataLocationItem[]>(url.toString())
  if (!Array.isArray(data)) return []
  return data.map((loc) => ({
    label: loc.label,
    city: loc.city ?? null,
    state: loc.state ?? null,
    postal_code: loc.postal_code ?? null,
    count: loc.count ?? 0,
  }))
}

/**
 * GET /api/v1/gymsdata/top-cities – top N locations by gym count (limit 1–50, default 10).
 */
export async function getTopCities(limit = 10): Promise<LocationWithCount[]> {
  const url = new URL(`${GYMSDATA_BASE}/top-cities`)
  if (limit > 0 && limit <= 50) url.searchParams.set('limit', String(limit))
  const data = await fetchJson<GymsdataTopCitiesResponse>(url.toString())
  const cities = data?.cities ?? []
  return cities.map((c) => ({
    label: c.label ?? `${c.city}, ${c.state}`,
    city: c.city,
    state: c.state,
    postal_code: c.postal_code ?? null,
    count: c.count ?? 0,
  }))
}

/**
 * GET /api/v1/gymsdata/chain-comparison – static chain comparison.
 */
export async function getChainComparison(): Promise<GymsdataChainComparisonResponse | null> {
  return fetchJson<GymsdataChainComparisonResponse>(`${GYMSDATA_BASE}/chain-comparison`)
}

/**
 * GET /api/v1/gymsdata/testimonials – static testimonials.
 * Fetched with no cache so backend content changes are reflected immediately.
 */
export async function getTestimonials(): Promise<GymsdataTestimonialsResponse | null> {
  return fetchJson<GymsdataTestimonialsResponse>(`${GYMSDATA_BASE}/testimonials`)
}

/**
 * GET /api/v1/gymsdata/industry-trends – dashboard: new gyms by month, growing cities, categories, franchise vs independent.
 */
export async function getIndustryTrends(): Promise<GymsdataIndustryTrendsResponse | null> { 
  return fetchJson<GymsdataIndustryTrendsResponse>(`${GYMSDATA_BASE}/industry-trends`)
}

/**
 * GET /api/v1/gymsdata/state-comparison – state comparison data.
 * No query = returns all states. Query states=CA,TX,FL = returns those 3.
 */
export async function getStateComparison(states?: string): Promise<GymsdataStateComparisonResponse | null> {
  const url = new URL(`${GYMSDATA_BASE}/state-comparison`)
  if (states?.trim()) url.searchParams.set('states', states.trim())
  return fetchJson<GymsdataStateComparisonResponse>(url.toString())
}

/**
 * GET /api/v1/gymsdata/state-page – data for /gymsdata/[state].
 */
export async function getStatePage(
  stateCodeOrName: string,
  options?: { include_cities?: boolean; cities_sort?: string; cities_limit?: number }
): Promise<GymsdataStatePageResponse | null> {
  const stateParam = (stateCodeOrName ?? '').toString().trim()
  if (!stateParam) return null
  const url = new URL(`${GYMSDATA_BASE}/state-page`)
  url.searchParams.set('state', stateParam)
  if (options?.include_cities === true) url.searchParams.set('include_cities', '1')
  if (options?.cities_sort) url.searchParams.set('cities_sort', options.cities_sort)
  if (options?.cities_limit != null) url.searchParams.set('cities_limit', String(options.cities_limit))
  
  return fetchJson<GymsdataStatePageResponse>(url.toString())
}

/**
 * GET /api/v1/gymsdata/city-page – data for /gymsdata/[state]/[city].
 */
export async function getCityPage(stateCodeOrName: string, cityNameOrSlug: string): Promise<GymsdataCityPageResponse | null> {
  const stateParam = (stateCodeOrName ?? '').toString().trim()
  const cityParam = (cityNameOrSlug ?? '').toString().trim()
  if (!stateParam || !cityParam) return null
  const url = new URL(`${GYMSDATA_BASE}/city-page`)
  url.searchParams.set('state', stateParam)
  url.searchParams.set('city', cityParam)
  return fetchJson<GymsdataCityPageResponse>(url.toString())
}

/**
 * GET /api/v1/gymsdata/list-page – one-shot data for main /gymsdata page. Optional sample_size (1–20).
 */
export async function getListPage(sampleSize?: number): Promise<GymsdataListPageResponse | null> {
  const url = new URL(`${GYMSDATA_BASE}/list-page`)
  if (sampleSize != null && sampleSize >= 1 && sampleSize <= 20) url.searchParams.set('sample_size', String(sampleSize))
  return fetchJson<GymsdataListPageResponse>(url.toString())
}

/**
 * List page data for /gymsdata: states + locations with timeout. Uses GET gymsdata/states and gymsdata/locations.
 * Fallback when getListPage() is unavailable or for slug resolution.
 */
export async function getListPageData(): Promise<ListPageData> {
  const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
    Promise.race([promise, new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))])

  try {
    const [states, locations] = await Promise.all([
      withTimeout(getStates().catch((): StateWithCount[] => []), LIST_PAGE_FETCH_TIMEOUT_MS, [] as StateWithCount[]),
      withTimeout(getLocations(undefined).catch((): LocationWithCount[] => []), LIST_PAGE_FETCH_TIMEOUT_MS, [] as LocationWithCount[]),
    ])
    return {
      states: Array.isArray(states) ? states : [],
      locations: Array.isArray(locations) ? locations : [],
    }
  } catch (error) {
    if (error instanceof Error) console.warn('getListPageData (gymsdata) failed:', error.message)
    return { states: [], locations: [] }
  }
}

/** Combined response for main /gymsdata page: list-page + fallback + top-cities + testimonials */
export interface GymsdataMainPageResult {
  states: StateWithCount[]
  totalGyms: number
  totalStates: number
  statics: Array<{ key: string; value: number }>
  topCities: LocationWithCount[]
  typesCovered: number
  types: GymsdataTypeItem[]
  listPage: GymsdataListPageResponse | null
  testimonials: GymsdataTestimonialsResponse | null
}

/**
 * Fetches all data for the main /gymsdata page in one go (list-page, listPageData fallback, top-cities, testimonials).
 * Use this to integrate all gymsdata endpoints for the main listing page.
 */
export async function getGymsdata(): Promise<GymsdataMainPageResult> {
  const [listPage, listPageData, topCitiesRaw, testimonialsRes] = await Promise.all([
    getListPage(),
    getListPageData(),
    getTopCities(10),
    getTestimonials(),
  ])
  const states =
    listPage && Array.isArray(listPage.states) && listPage.states.length > 0
      ? listPage.states.map((s) => ({ state: s.state, stateName: s.stateName ?? s.state, count: s.count ?? 0 }))
      : listPageData.states
  const locations = listPageData.locations
  const totalGyms = listPage?.totalGyms ?? states.reduce((sum, s) => sum + (s.count ?? 0), 0)
  const statics = [
    { key: "withEmail", value: listPage?.withEmail ?? 0 },
    { key: "withPhone", value: listPage?.withPhone ?? 0 },
    { key: "withPhoneAndEmail", value: listPage?.withPhoneAndEmail ?? 0 },
    { key: "withWebsite", value: listPage?.withWebsite ?? 0 },
    { key: "withFacebook", value: listPage?.withFacebook ?? 0 },
    { key: "withInstagram", value: listPage?.withInstagram ?? 0 },
    { key: "withTwitter", value: listPage?.withTwitter ?? 0 },
    { key: "withLinkedin", value: listPage?.withLinkedin ?? 0 },
    { key: "withYoutube", value: listPage?.withYoutube ?? 0 },
    { key: "ratedCount", value: listPage?.ratedCount ?? 0 },
  ]
  const totalStates = listPage?.statesCovered ?? states.length
  const topCities = topCitiesRaw.length > 0 ? topCitiesRaw : locations.slice(0, 10)
  const types = listPage?.types && Array.isArray(listPage.types) ? listPage.types : []
  const typesCovered = listPage?.typesCovered ?? types.length
  return {
    states,
    totalGyms,
    totalStates,
    statics,
    topCities,
    typesCovered,
    types,
    listPage: listPage ?? null,
    testimonials: testimonialsRes ?? null,
  }
}

/** Combined result for /gymsdata/[state] page */
export interface GymsdataStatePageResult {
  state: StateWithCount | null
  states: StateWithCount[]
  locations: LocationWithCount[]
  statePage: GymsdataStatePageResponse | null
  cities: Array<{ label: string; city: string | null; state: string | null; postal_code: string | null; count: number }>
  displayState: StateWithCount | null
  stateStats: { pctEmail: number; pctPhone: number; pctSocial: number; avgRating: number }
  topThreeCities: Array<{ name: string; gyms: number }>
  notFound: boolean
}

/**
 * Fetches all data for /gymsdata/[state] from api/v1/gymsdata/state-page. Returns notFound: true if state slug invalid.
 */
export async function getGymsdataForState(stateSlug: string): Promise<GymsdataStatePageResult> {
  const statePage = await getStatePage(stateSlug, { include_cities: true, cities_limit: 1000 })
  if (!statePage) {
    return {
      state: null,
      states: [],
      locations: [],
      statePage: null,
      cities: [],
      displayState: null,
      stateStats: { pctEmail: 0, pctPhone: 0, pctSocial: 0, avgRating: 0 },
      topThreeCities: [],
      notFound: true,
    }
  }
  const state: StateWithCount = {
    state: statePage.state,
    stateName: statePage.stateName ?? statePage.state,
    count: statePage.totalGyms ?? 0,
  }
  const cities = (statePage.cities ?? []).map((c) => ({
    label: c.label ?? `${c.city}, ${c.state}`,
    city: c.city,
    state: c.state,
    postal_code: c.postal_code ?? null,
    count: c.count ?? 0,
  }))
  const stateStats = {
    pctEmail: statePage.pctWithEmail ?? 0,
    pctPhone: statePage.pctWithPhone ?? 0,
    pctSocial: statePage.pctWithSocial ?? 0,
    avgRating: statePage.avgRating ?? 0,
  }
  const topThreeCities = (statePage.topCities ?? []).slice(0, 3).map((c) => ({
    name: c.city ?? c.label ?? 'City',
    gyms: c.count ?? 0,
  }))
  return {
    state,
    states: [],
    locations: [],
    statePage,
    cities,
    displayState: state,
    stateStats,
    topThreeCities,
    notFound: false,
  }
}

/** Combined result for /gymsdata/[state]/[city] page */
export interface GymsdataCityPageResult {
  state: StateWithCount | null
  loc: { label: string; city: string | null; state: string | null; postal_code: string | null; count: number } | null
  states: StateWithCount[]
  locations: LocationWithCount[]
  cityPage: GymsdataCityPageResponse | null
  cityName: string
  count: number
  stats: { pctEmail: number; pctPhone: number; pctSocial: number; avgRating: number }
  neighborhoods: Array<{ name: string; gyms: number }>
  nearbyCities: Array<{ label: string; city?: string; count: number }>
  notFound: boolean
}

/**
 * Fetches all data for /gymsdata/[state]/[city] from api/v1/gymsdata/city-page. Returns notFound: true if city-page returns null.
 */
export async function getGymsdataForCity(stateSlug: string, citySlug: string): Promise<GymsdataCityPageResult> {
  const cityPage = await getCityPage(stateSlug, citySlug)
  if (!cityPage) {
    return {
      state: null,
      loc: null,
      states: [],
      locations: [],
      cityPage: null,
      cityName: '',
      count: 0,
      stats: { pctEmail: 0, pctPhone: 0, pctSocial: 0, avgRating: 0 },
      neighborhoods: [],
      nearbyCities: [],
      notFound: true,
    }
  }
  const statePage = await getStatePage(stateSlug, { include_cities: false })
  const stateCount = statePage?.totalGyms ?? 0
  const state: StateWithCount = {
    state: cityPage.state,
    stateName: cityPage.stateName ?? cityPage.state,
    count: stateCount,
  }
  const cityName = cityPage.city ?? citySlug
  const count = cityPage.totalGyms ?? 0
  const stats = {
    pctEmail: cityPage.pctWithEmail ?? 0,
    pctPhone: cityPage.pctWithPhone ?? 0,
    pctSocial: cityPage.pctWithSocial ?? 0,
    avgRating: cityPage.avgRating ?? 0,
  }
  const neighborhoods = (cityPage.topAreas ?? []).map((a) => ({ name: a.label, gyms: a.count }))
  const nearbyCities = (cityPage.nearbyCities ?? []).map((c) => ({
    label: c.label,
    city: c.city,
    count: c.count ?? 0,
  }))
  return {
    state,
    loc: { label: `${cityName}, ${state.stateName}`, city: cityName, state: state.state, postal_code: null, count },
    states: [],
    locations: [],
    cityPage,
    cityName,
    count,
    stats,
    neighborhoods,
    nearbyCities,
    notFound: false,
  }
}

/** toUrlSegment for sitemap path building (fallback when backend sitemap endpoint is unavailable) */
function toUrlSegment(name: string): string {
  return (name ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Fallback: build sitemap paths from list-page + state-page (used when GET /api/v1/gymsdata/sitemap is not available). */
async function getGymsdataSitemapFallback(): Promise<{ data: string[] }> {
  const paths: string[] = ['', 'gymsdata']
  try {
    const listPage = await getListPage()
    if (!listPage) return { data: paths }

    const states = listPage.states ?? []
    const types = listPage.types ?? []

    for (const s of states) {
      const stateName = s.stateName ?? s.state ?? ''
      if (!stateName) continue
      paths.push(`gymsdata/${toUrlSegment(stateName)}`)
    }
    for (const t of types) {
      const typeSlug = (t.typeSlug ?? t.type ?? '').trim().toLowerCase().replace(/\s+/g, '-')
      if (!typeSlug) continue
      paths.push(`gymsdata/types/${encodeURIComponent(typeSlug)}`)
    }

    const citiesLimit = 150
    const statePages = await Promise.all(
      states.slice(0, 51).map((s) => {
        const stateParam = toUrlSegment(s.stateName ?? s.state ?? '')
        return stateParam ? getStatePage(stateParam, { include_cities: true, cities_limit: citiesLimit }) : Promise.resolve(null)
      })
    )

    for (let i = 0; i < states.length && i < statePages.length; i++) {
      const page = statePages[i]
      const stateName = states[i]?.stateName ?? states[i]?.state ?? ''
      const stateSlug = toUrlSegment(stateName)
      if (!stateSlug || !page?.cities?.length) continue
      for (const c of page.cities) {
        const cityName = c.city ?? c.label?.split(',')[0]?.trim() ?? ''
        if (!cityName) continue
        const citySlug = toUrlSegment(cityName)
        if (citySlug) paths.push(`gymsdata/${stateSlug}/${citySlug}`)
      }
    }
    return { data: paths }
  } catch (e) {
    if (e instanceof Error) console.warn('getGymsdataSitemap fallback failed:', e.message)
    return { data: paths }
  }
}

/**
 * Collects all gymsdata URLs for sitemap. Calls GET /api/v1/gymsdata/sitemap once (cached ~1 hour).
 * Falls back to list-page + N× state-page if the endpoint is unavailable.
 */
export async function getGymsdataSitemap(): Promise<{ data: string[] }> {
  try {
    const url = `${GYMSDATA_BASE}/sitemap`
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return getGymsdataSitemapFallback()
    const raw = await res.json()
    const data = Array.isArray(raw) ? raw : raw?.data
    if (!Array.isArray(data) || data.length === 0) return getGymsdataSitemapFallback()
    return { data }
  } catch {
    return getGymsdataSitemapFallback()
  }
}
