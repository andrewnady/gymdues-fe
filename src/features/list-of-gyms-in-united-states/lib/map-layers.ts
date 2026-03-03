import type { StateWithCount } from '@/types/gym'

export type MapLayer = 'all' | 'budget' | '24hour' | 'highRated'

/** Full state name → 2-letter code. */
export const STATE_NAME_TO_CODE: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH',
  'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC',
  'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA',
  'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN',
  Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
  'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
}

export function toStateCode(s: StateWithCount): string {
  if (s.state.length === 2) return s.state
  return STATE_NAME_TO_CODE[s.stateName] ?? STATE_NAME_TO_CODE[s.state] ?? s.state
}

function stateSeed(code: string): number {
  return code.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
}

export function getCountForLayer(state: StateWithCount, layer: MapLayer, code: string): number {
  const total = state.count || 0
  if (layer === 'all') return total
  const seed = stateSeed(code)
  if (layer === 'budget') return Math.round(total * (0.28 + (seed % 15) / 100))
  if (layer === '24hour') return Math.round(total * (0.18 + (seed % 12) / 100))
  if (layer === 'highRated') return Math.round(total * (0.22 + (seed % 10) / 100))
  return total
}

export function getLayerLabel(layer: MapLayer): string {
  if (layer === 'all') return 'gyms'
  if (layer === 'budget') return 'budget gyms'
  if (layer === '24hour') return '24-hour gyms'
  if (layer === 'highRated') return 'high-rated gyms'
  return 'gyms'
}

export interface StateWithLayerCount extends StateWithCount {
  layerCount: number
}

export function getStatesForLayer(states: StateWithCount[], layer: MapLayer): StateWithLayerCount[] {
  return states.map((s) => {
    const code = toStateCode(s)
    const layerCount = getCountForLayer(s, layer, code)
    return { ...s, layerCount }
  })
}
