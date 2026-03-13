import type { LocationWithCount, StateWithCount } from '@/types/gym'

/** Base path for all gymsdata pages. Use this prefix for any action/link from /gymsdata. */
export const GYMSDATA_BASE = '/gymsdata/'

/** Prefix for hrefs: when base is '' (subdomain) use '/', else use base or GYMSDATA_BASE. */
function gymsdataPrefix(base?: string): string {
  if (base === '') return '/'
  return base !== undefined ? (base.endsWith('/') ? base : `${base}/`) : GYMSDATA_BASE
}

/** Convert "Los Angeles" → "los-angeles", "New York" → "new-york" */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Replace spaces with hyphens and lowercase for URL segments: "North Carolina" → "north-carolina". Backend accepts this form. */
export function toUrlSegment(name: string): string {
  return (name ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Find state by URL segment (lowercase hyphenated e.g. "north-carolina", or slug/name) from a states array. */
export function getStateBySlug(states: StateWithCount[], stateSegment: string): StateWithCount | null {
  const segment = stateSegment.trim().toLowerCase()
  const segmentNorm = segment.replace(/-/g, ' ')
  return states.find((s) => {
    const name = s.stateName ?? ''
    return (
      toSlug(name) === toSlug(segment) ||
      name.trim().toLowerCase() === segment ||
      toUrlSegment(name) === segment ||
      name.trim().toLowerCase() === segmentNorm
    )
  }) ?? null
}

/** Get all cities (locations) in a state, sorted by count desc. */
export function getCitiesInState(
  locations: LocationWithCount[],
  stateCode: string,
  stateName?: string
): LocationWithCount[] {
  const codeUpper = stateCode.toUpperCase()
  const nameLower = stateName?.toLowerCase()
  return locations
    .filter((loc) => {
      const s = loc.state?.trim()
      if (!s) return false
      if (s.toUpperCase() === codeUpper) return true
      if (nameLower && s.toLowerCase() === nameLower) return true
      return false
    })
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
}

/** Find a city in state by URL segment (lowercase hyphenated e.g. "holly-springs", or slug/name). */
export function getCityBySlug(
  locations: LocationWithCount[],
  stateCode: string,
  citySlugOrName: string,
  stateName?: string
): LocationWithCount | null {
  const segment = citySlugOrName.trim().toLowerCase()
  const segmentNorm = segment.replace(/-/g, ' ')
  const inState = getCitiesInState(locations, stateCode, stateName)
  return inState.find((loc) => {
    const c = loc.city ?? (loc.label ? loc.label.split(',')[0]?.trim() : null)
    if (!c) return false
    const cLower = c.trim().toLowerCase()
    return (
      toSlug(c) === toSlug(segment) ||
      cLower === segment ||
      toUrlSegment(c) === segment ||
      cLower === segmentNorm
    )
  }) ?? null
}

/** Build path for state. Pass base '' on gymsdata subdomain for clean URLs (e.g. /california/). */
export function stateGymsdataPath(state: StateWithCount, base?: string): string {
  const name = state.stateName?.trim()
  if (!name) return gymsdataPrefix(base)
  return `${gymsdataPrefix(base)}${toUrlSegment(name)}`
}

/** Build path for city. Pass base '' on gymsdata subdomain for clean URLs. */
export function cityGymsdataPath(stateNameOrSegment: string, cityName: string, base?: string): string {
  const s = stateNameOrSegment?.trim()
  const c = cityName?.trim()
  if (!s || !c) return gymsdataPrefix(base)
  return `${gymsdataPrefix(base)}${toUrlSegment(s)}/${toUrlSegment(c)}`
}

/** Type item shape for slug lookup (from list-page types). */
export type TypeWithCount = { type: string; typeSlug: string; count: number; pct?: number; price?: number; formattedPrice?: string }

/** Find type by URL segment (e.g. "health-clubs" or "exercise-%26-physical-fitness-programs"). Normalizes so slugs with "&" match. */
export function getTypeBySlug(
  types: TypeWithCount[],
  typeSlug: string
): TypeWithCount | null {
  try {
    const segment = decodeURIComponent((typeSlug ?? '').trim()).toLowerCase()
    const segmentNorm = toSlug(segment)
    return types.find(
      (t) =>
        toSlug(t.typeSlug ?? '') === segmentNorm ||
        (t.typeSlug ?? '').toLowerCase() === segment
    ) ?? null
  } catch {
    const segment = (typeSlug ?? '').trim().toLowerCase()
    const segmentNorm = toSlug(segment)
    return types.find((t) => toSlug(t.typeSlug ?? '') === segmentNorm) ?? null
  }
}

/** Build path for type page. Pass base '' on gymsdata subdomain for clean URLs (e.g. /health-clubs/). */
export function typeGymsdataPath(typeSlug: string, base?: string): string {
  const slug = (typeSlug ?? '').trim()
  if (!slug) return gymsdataPrefix(base)
  const segment = toUrlSegment(slug)
  return `${gymsdataPrefix(base)}${encodeURIComponent(segment)}`
}

/** City page path from a location. Pass base '' on gymsdata subdomain for clean URLs. */
export function cityPagePathForLocation(
  loc: LocationWithCount,
  states: StateWithCount[],
  base?: string
): string | null {
  const stateRef = loc.state?.trim()
  const cityName = loc.city ?? (loc.label ? loc.label.split(',')[0]?.trim() : null)
  if (!stateRef || !cityName) return null
  const state =
    states.find((s) => s.state?.toUpperCase() === stateRef.toUpperCase()) ??
    states.find((s) => s.stateName && toSlug(s.stateName) === toSlug(stateRef))
  if (!state?.stateName) return null
  return cityGymsdataPath(state.stateName, cityName, base)
}

/** Derived stats for a state page (until API provides). */
export function getStateDerivedStats(stateCode: string, _totalGyms: number, _citiesCount: number) {
  const seed = stateCode.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return {
    pctEmail: Math.min(100, 58 + (seed % 18)),
    pctPhone: Math.min(100, 72 + (seed % 15)),
    pctSocial: Math.min(100, 45 + (seed % 25)),
    avgRating: Math.round((4.0 + (seed % 6) / 10) * 10) / 10,
  }
}

/** Derived stats for a city (until API provides). */
export function getCityDerivedStats(_count: number, citySlug: string) {
  const seed = citySlug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return {
    pctEmail: Math.min(100, 58 + (seed % 18)),
    pctPhone: Math.min(100, 72 + (seed % 15)),
    pctSocial: Math.min(100, 45 + (seed % 25)),
    avgRating: Math.round((4.0 + (seed % 6) / 10) * 10) / 10,
  }
}

/** Mock top 3 neighborhoods for a city (until API provides). */
export function getTopNeighborhoods(cityName: string, count: number): { name: string; gyms: number }[] {
  const total = count || 0
  const a = Math.round(total * 0.4)
  const b = Math.round(total * 0.35)
  const c = total - a - b
  return [
    { name: `Downtown ${cityName}`, gyms: a },
    { name: `Metro ${cityName}`, gyms: b },
    { name: `Greater ${cityName}`, gyms: Math.max(0, c) },
  ]
}

/** Format date for "as of [Date]" */
export function formatDataDate(): string {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
