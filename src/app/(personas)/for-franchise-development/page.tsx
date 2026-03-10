import type { Metadata } from 'next'
import Link from 'next/link'
import { PersonaPageLayout } from '../_components/persona-page-layout'

const title = 'Identify Underserved Markets for Gym Franchises | Gymdues'
const description =
  'Market saturation analysis and competitor gap analysis for gym franchise development. Use verified U.S. gym data to find the best markets for new locations.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForFranchiseDevelopmentPage() {
  return (
    <PersonaPageLayout
      title='Identify Underserved Markets for Gym Franchises'
      subtitle='Use gym count, density, and competitive data to find the best markets for new franchise locations. Data-driven site selection and gap analysis.'
      breadcrumbLabel='For Franchise Development'
      intro='Where should you open the next location? Our database powers market saturation and competitor gap analysis so you can prioritize high-opportunity markets and avoid oversaturated ones.'
      useCases={[
        {
          title: 'Market saturation analysis',
          description: 'See gym density by state and city. Identify underserved areas where demand may exceed supply—ideal for new franchise openings.',
        },
        {
          title: 'Competitor gap analysis',
          description: 'Understand where incumbents are strong or weak. Find white space by geography, segment, or chain type to position new locations.',
        },
        {
          title: 'Site selection support',
          description: 'Export lists by region for field research. Combine our counts with demographic and traffic data for full site-selection workflows.',
        },
      ]}
      extraSection={{
        heading: 'How to use the data',
        children: (
          <div className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Our <Link href='/gymsdata' className='text-primary hover:underline'>State-by-State Comparison</Link> and state/city breakdowns give you gym counts and density per capita. Use them to:
            </p>
            <ul className='list-disc list-inside space-y-2 text-sm text-muted-foreground'>
              <li>Rank markets by saturation (low density = opportunity or low demand)</li>
              <li>Compare states and metros side by side</li>
              <li>Download contact lists for specific markets to validate with local brokers</li>
            </ul>
            <p className='text-sm text-muted-foreground'>
              Data is updated weekly so your market view stays current as new gyms open and close.
            </p>
          </div>
        ),
      }}
      ctaPrimaryText='Download Free Sample'
      ctaSecondaryLabel='Browse full data'
    />
  )
}
