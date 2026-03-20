import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plan subscriptions - Gym Owner Dashboard | GymDues',
  description: 'View subscription requests from your gym listing.',
  robots: { index: false, follow: false },
}

export default function SubscriptionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
