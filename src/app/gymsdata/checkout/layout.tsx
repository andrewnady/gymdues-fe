import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout – US Gym Dataset | Gymdues',
  description: 'Complete your gym dataset purchase. Review order and proceed to payment.',
}

export default function GymsdataCheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
