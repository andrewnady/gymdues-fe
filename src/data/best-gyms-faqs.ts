export interface BestGymsFAQ {
  id: string
  question: string
  answer: string
}

/**
 * FAQs for best gyms by location pages.
 * Use `{location}` as a placeholder — replace at render time with the actual city/state name.
 */
export const bestGymsFaqs: BestGymsFAQ[] = [
  {
    id: 'best-gyms-1',
    question: 'What is the average gym membership cost in {location}?',
    answer:
      'Prices in {location} vary by gym type and amenities. People often benchmark costs by checking popular searches like la fitness prices, xsport membership cost per month, and xsport fitness price per month to compare value.',
  },
  {
    id: 'best-gyms-2',
    question: 'Which gyms in {location} are best for budget memberships?',
    answer:
      'Budget gyms usually have lower monthly fees with fewer extras. If you\'re comparing chain pricing in {location}, common queries include xsport membership price and xsport fitness memberships prices.',
  },
  {
    id: 'best-gyms-3',
    question: 'Are boutique studios more expensive than regular gyms in {location}?',
    answer:
      'Often yes, because boutique studios are class-based and coached. That\'s why people compare programs using searches like fit body boot camp cost per month, how much is fit body boot camp per month, and 9 round prices.',
  },
  {
    id: 'best-gyms-4',
    question: 'How do xsport membership plans compare to other gyms in {location}?',
    answer:
      'xsport membership plans can differ by access level and perks. Compare what\'s included (classes, guest access, amenities) with the gyms listed on this page in {location}.',
  },
  {
    id: 'best-gyms-5',
    question: 'Why do some people search xsport fitness precios in {location}?',
    answer:
      'In areas with Spanish-speaking audiences, users often search xsport fitness precios when comparing membership costs. Including Spanish-friendly phrasing can match real search behavior in {location}.',
  },
  {
    id: 'best-gyms-6',
    question:
      'Why do people search princeton club membership cost and princeton club membership cost new berlin?',
    answer:
      'Pricing can vary by club, region, and amenities—even within the same brand. Searches like princeton club membership cost and princeton club membership cost new berlin reflect how users compare local pricing before choosing a gym.',
  },
  {
    id: 'best-gyms-7',
    question:
      'Why do people search newtown athletic club membership cost, newtown athletic club pricing, and newtown athletic club membership cost per month?',
    answer:
      'These terms are common when users compare premium clubs and want a monthly benchmark. Even if a specific club isn\'t in {location}, these searches represent how people evaluate value versus cost.',
  },
]
