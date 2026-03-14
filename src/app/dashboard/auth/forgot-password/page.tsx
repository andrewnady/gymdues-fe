'use client'

import { useState, FormEvent } from 'react'
import { AppLink } from '@/components/app-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { apiForgotPassword } from '@/lib/gym-owner-auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiForgotPassword(email)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                If <strong>{email}</strong> belongs to a verified gym owner account, you&apos;ll
                receive a password reset link shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <AppLink href="/dashboard/auth/login" className="w-full">Back to Login</AppLink>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Reset Your Password</CardTitle>
            <CardDescription>
              We&apos;ll email you a link valid for 1 hour.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <AppLink
                  href="/dashboard/auth/login"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Back to login
                </AppLink>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
