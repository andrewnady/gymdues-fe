/**
 * Mock data for Growth Trends Dashboard.
 * Replace with API or real analytics when available.
 */

/** New gyms opened per month (last 12 months) */
export const NEW_GYMS_BY_MONTH = [
  { month: 'Mar', year: 2024, count: 412 },
  { month: 'Apr', year: 2024, count: 488 },
  { month: 'May', year: 2024, count: 521 },
  { month: 'Jun', year: 2024, count: 534 },
  { month: 'Jul', year: 2024, count: 498 },
  { month: 'Aug', year: 2024, count: 512 },
  { month: 'Sep', year: 2024, count: 545 },
  { month: 'Oct', year: 2024, count: 578 },
  { month: 'Nov', year: 2024, count: 562 },
  { month: 'Dec', year: 2024, count: 491 },
  { month: 'Jan', year: 2025, count: 623 },
  { month: 'Feb', year: 2025, count: 587 },
] as const

/** Most growing cities by new gym count (last 12 months) */
export const MOST_GROWING_CITIES = [
  { city: 'Houston, TX', growth: 127 },
  { city: 'Phoenix, AZ', growth: 118 },
  { city: 'Austin, TX', growth: 104 },
  { city: 'Miami, FL', growth: 98 },
  { city: 'Denver, CO', growth: 89 },
  { city: 'Nashville, TN', growth: 82 },
  { city: 'Las Vegas, NV', growth: 76 },
  { city: 'Charlotte, NC', growth: 71 },
  { city: 'San Antonio, TX', growth: 68 },
  { city: 'Atlanta, GA', growth: 64 },
] as const

/** Fastest growing categories (gym type / segment) */
export const FASTEST_GROWING_CATEGORIES = [
  { name: 'Boutique / Studio', value: 28, color: 'hsl(var(--primary))' },
  { name: 'CrossFit / Functional', value: 22, color: 'hsl(25 95% 53%)' },
  { name: 'Traditional / Full-service', value: 20, color: 'hsl(142 76% 36%)' },
  { name: '24/7 Low-cost', value: 18, color: 'hsl(262 83% 58%)' },
  { name: 'Specialty (Yoga, Pilates)', value: 12, color: 'hsl(199 89% 48%)' },
] as const

/** Franchise vs independent gym count over time (quarterly) */
export const FRANCHISE_VS_INDEPENDENT = [
  { quarter: 'Q1 2023', franchise: 12400, independent: 38200 },
  { quarter: 'Q2 2023', franchise: 12680, independent: 38450 },
  { quarter: 'Q3 2023', franchise: 12920, independent: 38680 },
  { quarter: 'Q4 2023', franchise: 13200, independent: 38920 },
  { quarter: 'Q1 2024', franchise: 13550, independent: 39180 },
  { quarter: 'Q2 2024', franchise: 13920, independent: 39420 },
  { quarter: 'Q3 2024', franchise: 14280, independent: 39650 },
  { quarter: 'Q4 2024', franchise: 14680, independent: 39890 },
  { quarter: 'Q1 2025', franchise: 15120, independent: 40120 },
] as const
