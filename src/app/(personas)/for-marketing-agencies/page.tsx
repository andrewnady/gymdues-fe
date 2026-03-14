import type { Metadata } from 'next'
import { AppLink } from '@/components/app-link'
import { PersonaPageLayout } from '../_components/persona-page-layout'

const title = 'Target 60K+ Gyms for Your Fitness Industry Clients | Gymdues'
const description =
  'Use cases for marketing agencies: email campaigns, cold calling, direct mail. Testimonials and bulk pricing for gym contact lists. Verified U.S. data.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
}

export default function ForMarketingAgenciesPage() {
  return (
    <PersonaPageLayout
      title="Target 60K+ Gyms for Your Fitness Industry Clients"
      subtitle="Reach decision-makers at every gym with verified emails, phones, and addresses. Built for agencies running email campaigns, cold calling, and direct mail."
      breadcrumbLabel="For Marketing Agencies"
      intro="Our verified data gives your fitness-industry clients a direct line to owners and managers. Filter by state, city, or chain—then export for your campaigns."
      useCases={[
        {
          title: 'Email campaigns',
          description: 'Launch targeted email campaigns with verified gym contacts. Segment by location, gym size, or chain for higher open and conversion rates.',
        },
        {
          title: 'Cold calling',
          description: 'Phone numbers verified and updated weekly. Perfect for outbound sales teams and lead qualification at scale.',
        },
        {
          title: 'Direct mail',
          description: 'Physical addresses for postcards, flyers, and local promotions. Ideal for regional fitness brands and event marketing.',
        },
      ]}
      extraSection={{
        heading: 'What agencies say',
        children: (
          <div className="space-y-6">
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
              &ldquo;We used Gymdues to run a 10K-email campaign for a fitness equipment client. List quality was strong and we saw above-average engagement.&rdquo;
              <footer className="mt-2 not-italic text-sm text-foreground">— Digital agency, East Coast</footer>
            </blockquote>
            <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground">
              &ldquo;Cold calling lists are usually stale. This one is updated regularly and we get through to real decision-makers.&rdquo;
              <footer className="mt-2 not-italic text-sm text-foreground">— B2B agency</footer>
            </blockquote>
            <div className="rounded-lg bg-muted/50 p-4">
              <h3 className="font-semibold mb-2">Bulk pricing</h3>
              <p className="text-sm text-muted-foreground">
                Volume discounts for full-database or state-level buys. Contact us for custom quotes and dedicated support for agency campaigns.
              </p>
              <AppLink href="/contact" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
                Request bulk pricing →
              </AppLink>
            </div>
          </div>
        ),
      }}
      ctaPrimaryText="Download Free Sample"
      ctaSecondaryLabel="Browse full data"
    />
  )
}
