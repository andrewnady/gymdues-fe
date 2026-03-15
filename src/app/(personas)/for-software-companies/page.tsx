import type { Metadata } from 'next'
import { PersonaPageLayout } from '../_components/persona-page-layout'

const title = 'Sell Gym Management Software to Decision Makers | Gymdues'
const description =
  'Reach gym owners and managers with our verified contact database. Filter for gyms without websites, integration guides, and CRM-ready lists for software sales.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForSoftwareCompaniesPage() {
  return (
    <PersonaPageLayout
      title="Sell Gym Management Software to Decision Makers"
      subtitle="Reach gym owners and managers who are ready to upgrade. Verified contacts, tech signals, and lists built for your sales and marketing teams."
      breadcrumbLabel="For Software Companies"
      intro="Target gyms that need better management tools. Our data helps you find decision-makers and prioritize leads, including gyms with weak or no websites (high intent for tech solutions)."
      useCases={[
        {
          title: 'Filter for gyms without websites',
          description: 'Identify gyms with no website or outdated tech. These owners are often looking for management software, scheduling, or membership systems.',
        },
        {
          title: 'Decision-maker contacts',
          description: 'Direct emails and phone numbers for owners and managers. Skip gatekeepers and reach the people who sign the contract.',
        },
        {
          title: 'CRM-ready exports',
          description: 'Export lists by state or city for your CRM. Use for outbound sequences, lead scoring, and territory planning.',
        },
      ]}
      extraSection={{
        heading: 'Integration guides',
        children: (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">
              Use Gymdues data in the tools you already use. We provide structured exports (CSV) that map easily to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Sales CRMs (HubSpot, Salesforce, Pipedrive)</li>
              <li>Email platforms (Mailchimp, SendGrid, outreach tools)</li>
              <li>Lead enrichment and scoring workflows</li>
            </ul>
            <p className="text-sm">
              <a href="/" className="text-primary hover:underline">Browse the full data</a>
              {' '}to filter by state and city, then download a sample to test your pipeline.
            </p>
          </div>
        ),
      }}
      ctaPrimaryText="Download Free Sample"
      ctaSecondaryLabel="Browse full data"
    />
  )
}
