import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export const metadata: Metadata = {
  title: 'Contact Gymdues | Questions, Feedback & Support',
  description:
    'Have a question, found outdated pricing, or want to suggest a gym we should add? Contact GymDues anytime—we\'re happy to help.',
  alternates: {
    canonical: `${siteUrl}/contact/`,
    languages: {
      'en-US': `${siteUrl}/contact/`,
      'x-default': `${siteUrl}/contact/`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Contact Gymdues | Questions, Feedback & Support',
    description:
      'Have a question, found outdated pricing, or want to suggest a gym we should add? Contact GymDues anytime—we\'re happy to help.',
    url: `${siteUrl}/contact/`,
    siteName: 'GymDues',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/bg-header.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contact GymDues - Questions, Feedback & Support',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Gymdues | Questions, Feedback & Support',
    description:
      'Have a question, found outdated pricing, or want to suggest a gym we should add? Contact GymDues anytime—we\'re happy to help.',
    images: [`${siteUrl}/images/bg-header.jpg`],
    creator: '@gymdues',
    site: '@gymdues',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

