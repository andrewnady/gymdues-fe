export interface GymsPageFAQ {
  id: string
  question: string
  answer: string
  categoryId: string
}

export const gymsPageFaqCategories = [
  { id: 'gym_prices_fees', title: 'Gym Prices & Fees' },
  { id: 'plans_access', title: 'Plans & Access' },
  { id: 'cancellation_billing', title: 'Cancellation' },
  { id: 'guests_family_age', title: 'Guests Rules' },
  { id: 'right_gym', title: 'The Right Gym' },
] as const

export const gymsPageFaqs: GymsPageFAQ[] = [
  // Gym Prices & Fees
  {
    id: 'prices-1',
    categoryId: 'gym_prices_fees',
    question: 'How much does a gym membership cost per month?',
    answer:
      'Most gyms charge a monthly membership fee that varies by brand, location, and access level. Prices are often lower with longer commitments and higher when plans include multi-location access, premium amenities, or unlimited classes.',
  },
  {
    id: 'prices-2',
    categoryId: 'gym_prices_fees',
    question: 'What fees should I expect besides the monthly price?',
    answer:
      "Common extra fees include an enrollment/initiation fee, an annual/maintenance fee, and sometimes taxes or club \"improvement\" fees. Some gyms also charge for key fobs, towels, lockers, or premium areas.",
  },
  {
    id: 'prices-3',
    categoryId: 'gym_prices_fees',
    question: 'Do gyms charge an initiation or enrollment fee?',
    answer:
      'Many gyms do, especially during certain promotions. Some waive the fee during sales, while others reduce it if you choose a longer contract or pay upfront.',
  },
  {
    id: 'prices-4',
    categoryId: 'gym_prices_fees',
    question: 'Do gyms have an annual fee or maintenance fee?',
    answer:
      "Yes—many gyms charge an annual fee once per year (or split it monthly). It's usually separate from the monthly dues and can apply even if your monthly rate is discounted.",
  },
  {
    id: 'prices-5',
    categoryId: 'gym_prices_fees',
    question: 'Why do gym prices vary by location for the same brand?',
    answer:
      'Rent, local demand, amenities (pool/sauna/courts), and club size can all change pricing. Even within one chain, different locations may have different plan tiers and promotions.',
  },
  {
    id: 'prices-6',
    categoryId: 'gym_prices_fees',
    question: 'Is it cheaper to pay month-to-month or sign a contract?',
    answer:
      'Contracts usually reduce the monthly price but may include early-cancellation rules. Month-to-month is more flexible but typically costs more per month.',
  },
  {
    id: 'prices-7',
    categoryId: 'gym_prices_fees',
    question: 'Are family memberships cheaper than individual plans?',
    answer:
      'Often yes. Family plans can lower the cost per person, but eligibility rules vary (household members, ages, dependents) and some amenities may still cost extra.',
  },
  // Plans, Access
  {
    id: 'plans-1',
    categoryId: 'plans_access',
    question: "What's the difference between a basic and a premium gym membership?",
    answer:
      'Basic plans usually include one club and standard equipment. Premium plans often add multi-club access, guest privileges, premium areas, and more classes or amenities.',
  },
  {
    id: 'plans-2',
    categoryId: 'plans_access',
    question: 'Does my gym membership work at multiple locations?',
    answer:
      'Some memberships are "single-club," while others allow multi-location or nationwide access. Multi-location access is usually tied to a higher-tier plan.',
  },
  {
    id: 'plans-3',
    categoryId: 'plans_access',
    question: 'Are group fitness classes included in the membership?',
    answer:
      "It depends. Many gyms include some classes (like cycling or HIIT) but charge extra for specialty programs or studio-style training.",
  },
  {
    id: 'plans-4',
    categoryId: 'plans_access',
    question: 'Do gyms offer free trials or day passes?',
    answer:
      'Many gyms offer a free trial or a paid day pass. Availability can depend on the location and time of year, and some require ID or local residency.',
  },
  {
    id: 'plans-5',
    categoryId: 'plans_access',
    question: 'Do gyms offer student, senior, military, or corporate discounts?',
    answer:
      'Often yes. Discounts vary by gym and location, and typically require verification (student ID, employer email, or military ID).',
  },
  // Cancellation, Freezing & Billing Questions
  {
    id: 'cancel-1',
    categoryId: 'cancellation_billing',
    question: 'Can I cancel my gym membership online?',
    answer:
      'Some gyms allow online cancellation, but many require an in-person visit, a phone call, or a signed form. Policies vary by chain and by location.',
  },
  {
    id: 'cancel-2',
    categoryId: 'cancellation_billing',
    question: 'Do gyms require a 30-day notice to cancel?',
    answer:
      'Many contracts require 30 days\' notice, meaning you may be billed one more cycle after requesting cancellation. Month-to-month plans can still have notice rules.',
  },
  {
    id: 'cancel-3',
    categoryId: 'cancellation_billing',
    question: 'Are cancellation fees common?',
    answer:
      'They can be, especially for contract memberships. Fees depend on the agreement—some charge a flat fee, others charge remaining months, and some waive fees for qualifying reasons.',
  },
  {
    id: 'cancel-4',
    categoryId: 'cancellation_billing',
    question: 'Can I freeze or pause my membership?',
    answer:
      'Yes, many gyms offer a freeze option for travel, medical reasons, or temporary breaks. Some freezes are free; others have a small monthly hold fee.',
  },
  {
    id: 'cancel-5',
    categoryId: 'cancellation_billing',
    question: 'What happens if I miss a payment?',
    answer:
      'Most gyms will attempt to re-bill and may add a late fee. Repeated missed payments can lead to account suspension and, in some cases, collections depending on the contract.',
  },
  // Guests, Family & Age Rules
  {
    id: 'guests-1',
    categoryId: 'guests_family_age',
    question: 'Can I bring a guest to the gym?',
    answer:
      'Many gyms allow guests, but limits vary (guest passes per month, same guest restrictions, or time-of-day rules). Guest access is often a premium feature.',
  },
  {
    id: 'guests-2',
    categoryId: 'guests_family_age',
    question: 'Do gyms offer teen or youth memberships?',
    answer:
      'Some gyms allow teens with parental consent and specific age rules. Access may be limited to certain hours or areas, and minors may need an orientation.',
  },
  {
    id: 'guests-3',
    categoryId: 'guests_family_age',
    question: 'What is a family gym membership and who qualifies?',
    answer:
      'Family memberships typically cover household members under one plan. Qualification rules vary by gym (same address, dependents, spouse/partner) and may require proof.',
  },
  // The Right Gym
  {
    id: 'right-1',
    categoryId: 'right_gym',
    question: 'What should I compare when choosing a gym?',
    answer:
      'Compare total cost (monthly + fees), contract terms, location convenience, peak-hour crowding, amenities you\'ll actually use, class availability, and cancellation policy.',
  },
  {
    id: 'right-2',
    categoryId: 'right_gym',
    question: 'How can I find the best gym near me?',
    answer:
      "Start by browsing gyms in your city or zip code, then shortlist options by price range, distance, amenities, and plan flexibility. Open the gym's detail page to review membership types and fees before signing up.",
  },
]
