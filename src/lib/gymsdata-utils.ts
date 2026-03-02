import type { LocationWithCount, StateWithCount } from '@/types/gym'

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

/** Find state by slug (e.g. "california" or "new-york"). */
export function getStateBySlug(states: StateWithCount[], stateSlug: string): StateWithCount | null {
  const slug = stateSlug.toLowerCase()
  return states.find((s) => toSlug(s.stateName) === slug) ?? null
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

/** Find a city in state by city slug. */
export function getCityBySlug(
  locations: LocationWithCount[],
  stateCode: string,
  citySlug: string,
  stateName?: string
): LocationWithCount | null {
  const slug = citySlug.toLowerCase().trim()
  const inState = getCitiesInState(locations, stateCode, stateName)
  return inState.find((loc) => {
    const c = loc.city ?? (loc.label ? loc.label.split(',')[0]?.trim() : null)
    return c && toSlug(c) === slug
  }) ?? null
}

/** Build path for state: /gymsdata/california */
export function stateGymsdataPath(state: StateWithCount): string {
  return `/gymsdata/${toSlug(state.stateName)}`
}

/** Build path for city: /gymsdata/california/los-angeles */
export function cityGymsdataPath(stateSlug: string, cityName: string): string {
  const s = stateSlug.toLowerCase().trim()
  const c = cityName ? toSlug(cityName) : ''
  if (!s || !c) return '/gymsdata'
  return `/gymsdata/${s}/${c}`
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
