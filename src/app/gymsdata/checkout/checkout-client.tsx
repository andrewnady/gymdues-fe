'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CHECKOUT_STORAGE_KEY, type BuyDatasetFormData } from '@/components/buy-dataset-modal'
import { ArrowRight } from 'lucide-react'
import { submitOrderFromForm } from './actions'

interface CheckoutClientProps {
  /** Order from cookie (server-side) for no-JS form submit */
  initialOrderFromCookie?: BuyDatasetFormData | null
}

export function CheckoutClient({ initialOrderFromCookie }: CheckoutClientProps) {
  const [order, setOrder] = useState<BuyDatasetFormData | null>(initialOrderFromCookie ?? null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as BuyDatasetFormData
        setOrder(data)
      }
    } catch {
      // ignore
    }
  }, [])

  const resolvedOrder = order ?? initialOrderFromCookie ?? null

  if (!mounted && !initialOrderFromCookie) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center text-muted-foreground">
            Loading…
          </div>
        </div>
      </main>
    )
  }

  if (!resolvedOrder) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/gymsdata" className="hover:text-primary">Gym database</Link></li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium">Checkout</li>
            </ol>
          </nav>
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-2">Buy dataset</h1>
            <p className="text-muted-foreground mb-6">
              Enter your details to proceed to checkout. Works without JavaScript.
            </p>
            <form action={submitOrderFromForm} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
              <input type="hidden" name="csrf" value="checkout" />
              <div>
                <label htmlFor="checkout-name" className="block text-sm font-medium text-muted-foreground mb-1">Name *</label>
                <input id="checkout-name" name="name" type="text" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="checkout-email" className="block text-sm font-medium text-muted-foreground mb-1">Email *</label>
                <input id="checkout-email" name="email" type="email" required className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" placeholder="you@company.com" />
              </div>
              <div className="flex gap-3 pt-2">
                <Link href="/gymsdata" className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted text-center">
                  Back to gym database
                </Link>
                <button type="submit" className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Proceed to checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/gymsdata" className="hover:text-primary">Gym database</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Checkout</li>
          </ol>
        </nav>

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Review your details and complete payment.
          </p>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Order details
            </h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium">{resolvedOrder.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{resolvedOrder.email}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Product
            </h2>
            <p className="font-semibold text-foreground">US Gym Leads Dataset</p>
            <p className="text-sm text-muted-foreground mt-1">
              Full verified contacts · CSV, XLSX · Weekly updates
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact?intent=buy"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Proceed to payment
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/gymsdata"
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Back to gym database
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We&apos;ll confirm your order and send payment instructions to <strong>{resolvedOrder.email}</strong>.
          </p>
        </div>
      </div>
    </main>
  )
}
