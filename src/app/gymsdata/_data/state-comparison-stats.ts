/**
 * State-level stats for comparison table: population (for gym density per capita)
 * and average monthly gym price. Used for State-by-State Comparison SEO table.
 * Approximate data; can be replaced by API later.
 */
export interface StateStats {
  population: number
  avgPriceMonthly: number
}

/** Approximate state population (2024) and avg gym monthly price ($). */
export const STATE_COMPARISON_STATS: Record<string, StateStats> = {
  CA: { population: 39_240_000, avgPriceMonthly: 52 },
  TX: { population: 31_330_000, avgPriceMonthly: 42 },
  FL: { population: 23_420_000, avgPriceMonthly: 45 },
  NY: { population: 19_950_000, avgPriceMonthly: 68 },
  IL: { population: 12_550_000, avgPriceMonthly: 48 },
  PA: { population: 13_010_000, avgPriceMonthly: 44 },
  OH: { population: 11_760_000, avgPriceMonthly: 38 },
  GA: { population: 11_080_000, avgPriceMonthly: 42 },
  NC: { population: 10_840_000, avgPriceMonthly: 40 },
  MI: { population: 10_030_000, avgPriceMonthly: 42 },
  NJ: { population: 9_290_000, avgPriceMonthly: 58 },
  VA: { population: 8_680_000, avgPriceMonthly: 48 },
  WA: { population: 7_980_000, avgPriceMonthly: 52 },
  AZ: { population: 7_430_000, avgPriceMonthly: 45 },
  MA: { population: 7_030_000, avgPriceMonthly: 62 },
  TN: { population: 7_130_000, avgPriceMonthly: 38 },
  IN: { population: 6_830_000, avgPriceMonthly: 38 },
  MO: { population: 6_180_000, avgPriceMonthly: 40 },
  MD: { population: 6_180_000, avgPriceMonthly: 55 },
  WI: { population: 5_900_000, avgPriceMonthly: 42 },
  CO: { population: 5_880_000, avgPriceMonthly: 52 },
  MN: { population: 5_740_000, avgPriceMonthly: 48 },
  SC: { population: 5_380_000, avgPriceMonthly: 38 },
  AL: { population: 5_110_000, avgPriceMonthly: 36 },
  LA: { population: 4_590_000, avgPriceMonthly: 40 },
  KY: { population: 4_530_000, avgPriceMonthly: 36 },
  OR: { population: 4_250_000, avgPriceMonthly: 48 },
  OK: { population: 4_050_000, avgPriceMonthly: 38 },
  CT: { population: 3_620_000, avgPriceMonthly: 58 },
  UT: { population: 3_420_000, avgPriceMonthly: 45 },
  IA: { population: 3_210_000, avgPriceMonthly: 38 },
  NV: { population: 3_190_000, avgPriceMonthly: 48 },
  AR: { population: 3_070_000, avgPriceMonthly: 35 },
  MS: { population: 2_940_000, avgPriceMonthly: 34 },
  KS: { population: 2_940_000, avgPriceMonthly: 38 },
  NM: { population: 2_110_000, avgPriceMonthly: 42 },
  NE: { population: 1_980_000, avgPriceMonthly: 38 },
  WV: { population: 1_770_000, avgPriceMonthly: 32 },
  ID: { population: 1_960_000, avgPriceMonthly: 42 },
  HI: { population: 1_440_000, avgPriceMonthly: 65 },
  NH: { population: 1_400_000, avgPriceMonthly: 48 },
  ME: { population: 1_400_000, avgPriceMonthly: 42 },
  RI: { population: 1_100_000, avgPriceMonthly: 52 },
  MT: { population: 1_140_000, avgPriceMonthly: 42 },
  DE: { population: 1_030_000, avgPriceMonthly: 48 },
  SD: { population: 920_000, avgPriceMonthly: 38 },
  ND: { population: 797_000, avgPriceMonthly: 38 },
  AK: { population: 733_000, avgPriceMonthly: 58 },
  VT: { population: 647_000, avgPriceMonthly: 48 },
  WY: { population: 588_000, avgPriceMonthly: 42 },
  DC: { population: 678_000, avgPriceMonthly: 85 },
}

export interface StateComparisonRow {
  state: string
  stateName: string
  count: number
  /** Gyms per 100,000 people */
  densityPer100k: number
  /** Average monthly price $ */
  avgPriceMonthly: number
  /** 0–100 market saturation index (higher = more saturated) */
  saturationIndex: number
}

/**
 * Build comparison rows from states with count and optional stats.
 * Density = (count / population) * 100000. Saturation = min(100, density * 3) so ~33 per 100k = 100.
 */
export function buildStateComparisonRows(
  states: { state: string; stateName: string; count: number }[]
): StateComparisonRow[] {
  return states.map((s) => {
    const stats = STATE_COMPARISON_STATS[s.state]
    const population = stats?.population ?? 1_000_000
    const avgPriceMonthly = stats?.avgPriceMonthly ?? 45
    const densityPer100k = population > 0 ? (s.count / population) * 100_000 : 0
    const saturationIndex = Math.round(Math.min(100, densityPer100k * 3))
    return {
      state: s.state,
      stateName: s.stateName,
      count: s.count,
      densityPer100k: Math.round(densityPer100k * 10) / 10,
      avgPriceMonthly,
      saturationIndex,
    }
  })
}
