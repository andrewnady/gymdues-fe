import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym Owner Dashboard - GymDues',
  description: 'Manage your claimed gym on GymDues.',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
