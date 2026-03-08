'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, AlertCircle, Shield, FileSpreadsheet, Zap, Mail } from 'lucide-react'
import { FULL_DATA_PRICE_LABEL } from '../_constants'
import { BuyDataPrice } from '../_components/buy-data-price'
import type { PriceFromServer } from '../_components/buy-data-price'
import type { CheckoutScope, CheckoutScopeDetails } from './page'

interface CheckoutClientProps {
  scope: CheckoutScope
  priceFromServer: PriceFromServer | null
  scopeDetails: CheckoutScopeDetails
}

export function CheckoutClient({ scope, priceFromServer, scopeDetails }: CheckoutClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value?.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value?.trim()
    if (!name || !email) {
      setError('Please enter your name and email.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/gymsdata/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          state: scope.state || undefined,
          city: scope.city || undefined,
          type: scope.type || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error ?? `Checkout failed (${res.status})`)
        setLoading(false)
        return
      }
      if (data?.url) {
        window.location.href = data.url
        return
      }
      setError('No checkout URL received.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed.')
    }
    setLoading(false)
  }

  const rowCount = priceFromServer?.rowCount

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <nav className="max-w-5xl mx-auto mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/gymsdata" className="hover:text-primary">List of Fitness, Gym, and Health Services in United States</Link></li>
            <li aria-hidden>/</li>
            <li className="text-foreground font-medium">Checkout</li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-1">
              Checkout — Purchase the data
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase below. You&apos;ll be redirected to secure Stripe Checkout to pay.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Order summary — left on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden sticky top-6">
                <div className="px-5 py-4 border-b border-border/60 bg-muted/30">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Order summary
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="font-semibold text-foreground">{scopeDetails.scopeLabel}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {scopeDetails.scopeDescription}
                    </p>
                  </div>
                  {typeof rowCount === 'number' && (
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileSpreadsheet className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{rowCount.toLocaleString('en-US')} verified rows</span>
                    </p>
                  )}
                  <div className="pt-3 border-t border-border/60">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <BuyDataPrice
                        priceFromServer={priceFromServer ?? undefined}
                        fallbackLabel={FULL_DATA_PRICE_LABEL}
                        className="text-lg font-bold text-foreground"
                        suffixOneTime
                        hideRowCount
                      />
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 bg-muted/20 border-t border-border/60 space-y-3">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Zap className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                    Instant delivery after payment
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileSpreadsheet className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                    CSV &amp; XLSX · Weekly updates
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                    Download link sent to your email
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">Secure payment</p>
                  <p className="text-xs text-muted-foreground">
                    Payment is processed securely by Stripe. We don&apos;t store your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Form — right on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground mb-1">Your details</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  We&apos;ll use this to create your account and send the download link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {scope.state && <input type="hidden" name="state" value={scope.state} />}
                  {scope.city && <input type="hidden" name="city" value={scope.city} />}
                  {scope.type && <input type="hidden" name="type" value={scope.type} />}
                  <div>
                    <label htmlFor="checkout-name" className="block text-sm font-medium text-foreground mb-1.5">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      required
                      disabled={loading}
                      autoComplete="name"
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkout-email" className="block text-sm font-medium text-foreground mb-1.5">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      required
                      disabled={loading}
                      autoComplete="email"
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60"
                      placeholder="you@company.com"
                    />
                  </div>
                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3" role="alert">
                      <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" aria-hidden />
                      <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                  )}
                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    <Link
                      href="/gymsdata"
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-muted text-center transition-colors"
                    >
                      Back to data in United States
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 transition-colors"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          Redirecting to payment…
                        </>
                      ) : (
                        'Proceed to payment'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
