import type { Metadata } from 'next'
import { PersonaPageLayout } from '../_components/persona-page-layout'

const title = 'Reach Gym Owners Looking to Upgrade Equipment | Gymdues'
const description =
  'Target gyms for equipment sales: filter by gym age, seasonal buying patterns, and location. Verified contacts for commercial fitness equipment suppliers.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForEquipmentSuppliersPage() {
  return (
    <PersonaPageLayout
      title="Reach Gym Owners Looking to Upgrade Equipment"
      subtitle="Connect with gym owners and managers who are ready to invest in new equipment. Use location, timing, and market signals to prioritize your best leads."
      breadcrumbLabel="For Equipment Suppliers"
      intro="Older gyms and those in growth markets are more likely to upgrade. Our database helps you find them with verified contacts and filters that match how equipment buyers actually shop."
      useCases={[
        {
          title: 'Filter by gym age',
          description: 'Older gyms are more likely to upgrade equipment. Target locations that have been in business longer for replacement and refurbishment sales.',
        },
        {
          title: 'Seasonal buying patterns',
          description: 'Reach gyms ahead of peak buying seasons—New Year, post-summer, and pre–fiscal year. Plan campaigns when owners budget for equipment.',
        },
        {
          title: 'Regional and local targeting',
          description: 'Focus on states and cities with high gym density or growth. Export lists by region for your field reps and distributors.',
        },
      ]}
      extraSection={{
        heading: 'Why equipment suppliers use Gymdues',
        children: (
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Our list is updated weekly so you are not calling disconnected numbers or outdated emails. You get gym name, location, contact details, and the ability to segment by state and city so you can align outreach with your sales territories and seasonal pushes.
            </p>
            <p>
              Combine our data with your own signals (e.g. gym age or equipment type) to build a targeted list of high-intent prospects for commercial equipment, flooring, or accessories.
            </p>
          </div>
        ),
      }}
      ctaPrimaryText="Download Free Sample"
      ctaSecondaryLabel="Browse full gym database"
    />
  )
}
