'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CHECKOUT_STORAGE_KEY, type BuyDatasetFormData } from '@/components/buy-dataset-modal'
import { ShoppingCart, ArrowRight } from 'lucide-react'

export default function GymsdataCheckoutPage() {
  const [order, setOrder] = useState<BuyDatasetFormData | null>(null)
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
      setOrder(null)
    }
  }, [])

  if (!mounted) {
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

  if (!order) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <nav className="max-w-4xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/gymsdata" className="hover:text-primary">Gym database</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/gymsdata/dataset" className="hover:text-primary">Dataset</Link></li>
              <li aria-hidden>/</li>
              <li className="text-foreground font-medium">Checkout</li>
            </ol>
          </nav>
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-2">No order in progress</h1>
            <p className="text-muted-foreground mb-6">
              Start from the dataset page to add your details and proceed to checkout.
            </p>
            <Link
              href="/gymsdata/dataset"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Buy dataset
            </Link>
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
            <li><Link href="/gymsdata/dataset" className="hover:text-primary">Dataset</Link></li>
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
                <dd className="font-medium">{order.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{order.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Company</dt>
                <dd className="font-medium">{order.company}</dd>
              </div>
              {order.message && (
                <div>
                  <dt className="text-muted-foreground">Message</dt>
                  <dd className="font-medium">{order.message}</dd>
                </div>
              )}
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
              href="/gymsdata/dataset"
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-muted"
            >
              Back to dataset
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We&apos;ll confirm your order and send payment instructions to <strong>{order.email}</strong>.
          </p>
        </div>
      </div>
    </main>
  )
}
