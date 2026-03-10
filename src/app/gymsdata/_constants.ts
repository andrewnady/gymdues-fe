/** Full dataset price (one-time). Shown next to all "Buy data" / checkout CTAs. */
export const FULL_DATA_PRICE = '$249'
export const FULL_DATA_PRICE_LABEL = `${FULL_DATA_PRICE}`

/** Timezone used for last-update date (data updated weekly). */
const LAST_UPDATE_TZ = 'America/New_York'

/**
 * Returns the date of the most recent weekly update (a Monday).
 * Never returns today: if today is Monday, returns the previous Monday so "last update" is always in the past.
 */
function getLastUpdateDate(): Date {
  const now = new Date()
  const daysSinceMonday = (now.getDay() + 6) % 7
  let lastMonday = new Date(now)
  lastMonday.setDate(now.getDate() - daysSinceMonday)
  lastMonday.setHours(12, 0, 0, 0)

  const todayStr = now.toLocaleDateString('en-CA', { timeZone: LAST_UPDATE_TZ }) // YYYY-MM-DD
  const lastMondayStr = lastMonday.toLocaleDateString('en-CA', { timeZone: LAST_UPDATE_TZ })
  if (todayStr === lastMondayStr) {
    lastMonday.setDate(lastMonday.getDate() - 7)
  }
  return lastMonday
}

/**
 * Returns both last-update date strings from a single computed date so they always match.
 * long: "March 9, 2026" – for "Data updated on", "as of".
 * short: "Monday, Mar 9, 2026" – for carousel, badges.
 */
export function getLastUpdateDateStrings(): { long: string; short: string } {
  const d = getLastUpdateDate()
  const long = d.toLocaleDateString('en-US', {
    timeZone: LAST_UPDATE_TZ,
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const short = d.toLocaleDateString('en-US', {
    timeZone: LAST_UPDATE_TZ,
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return { long, short }
}
