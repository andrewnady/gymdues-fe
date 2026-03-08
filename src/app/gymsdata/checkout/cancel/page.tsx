import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Checkout Cancelled | Gymdues',
  description: 'Your checkout was cancelled. Return to the gym database to try again.',
}

export default function CheckoutCancelPage() {
  return (
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
              href="/gymsdata/checkout"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Try checkout again
            </Link>
            <Link
              href="/gymsdata"
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to gym database
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
