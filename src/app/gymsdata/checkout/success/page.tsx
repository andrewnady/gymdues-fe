import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Mail, FileSpreadsheet, ArrowRight } from 'lucide-react'
import { buildWebPageSchema } from '@/lib/schema-builder'
import { JsonLdSchema } from '@/components/json-ld-schema'

export const metadata: Metadata = {
  title: 'Thank You – Order Confirmed | Gymdues',
  description: 'Your gym dataset order is confirmed. Your download link will be sent by email.',
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gymdues.com'

type PageProps = { searchParams: Promise<{ session_id?: string }> }

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams
  const sessionId = typeof params.session_id === 'string' ? params.session_id.trim() || undefined : undefined

  const successSchema = buildWebPageSchema({
    baseUrl: siteUrl,
    name: 'Thank You – Order Confirmed | Gymdues',
    description: 'Your gym dataset order is confirmed. Your download link will be sent by email.',
    path: '/gymsdata/checkout/success',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Gym database', url: '/gymsdata' },
      { name: 'Checkout', url: '/gymsdata/checkout' },
      { name: 'Order confirmed', url: '/gymsdata/checkout/success' },
    ],
  })

  return (
    <>
      <JsonLdSchema data={successSchema} />
      <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6" aria-hidden>
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
            Thank you for your order
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your payment was successful. Your gym dataset purchase is confirmed.
          </p>

          <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 text-left shadow-sm mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              What happens next
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">Check your email</p>
                  <p className="text-sm text-muted-foreground">
                    We&apos;ve sent a confirmation and your download link to the email address you used at checkout.
                    If you don&apos;t see it, check your spam folder.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">Download your data</p>
                  <p className="text-sm text-muted-foreground">
                    Use the link in the email to download your dataset (CSV/XLSX). The link may take a few minutes to
                    become active while we prepare your file.
                  </p>
                </div>
              </li>
            </ul>
            {sessionId && (
              <p className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground" aria-hidden>
                Order reference: {sessionId.slice(0, 24)}…
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/gymsdata"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to gym database
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}
