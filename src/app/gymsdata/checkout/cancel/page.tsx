import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { buildWebPageSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'
import { getGymsdataBasePath } from '../../_lib/get-gymsdata-base-path'

export const metadata: Metadata = {
  title: 'Checkout Cancelled | Gymdues',
  description: 'Your checkout was cancelled. Return to the gym database to try again.',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

export default async function CheckoutCancelPage() {
  const base = await getGymsdataBasePath()
  const homeHref = base === '' ? '/' : `${base}/`
  const checkoutHref = base ? `${base}/checkout` : '/checkout'
  const cancelSchema = buildWebPageSchema({
    baseUrl: siteUrl,
    name: 'Checkout Cancelled | Gymdues',
    description: 'Your checkout was cancelled. Return to the gym database to try again.',
    path: '/gymsdata/checkout/cancel',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Gym database', url: '/gymsdata' },
      { name: 'Checkout', url: '/gymsdata/checkout' },
      { name: 'Cancelled', url: '/gymsdata/checkout/cancel' },
    ],
  })

  return (
    <>
      <JsonLdSchema data={cancelSchema} />
      <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Checkout cancelled
          </h1>
          <p className="text-muted-foreground mb-8">
            You left the payment page. Your card has not been charged. You can return to the gym database
            and complete your purchase whenever you&apos;re ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={checkoutHref}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Try checkout again
            </Link>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
