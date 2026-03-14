'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { AppLink } from '@/components/app-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiMagicLogin, saveAuthToken } from '@/lib/gym-owner-auth'

function MagicLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage('No login token found in the URL. Please use the link from your approval email.')
      return
    }

    async function processToken() {
      try {
        const data = await apiMagicLogin(token as string)

        if (!data.success) {
          setStatus('error')
          setErrorMessage(
            data.message ||
              'This link is invalid or has already been used. Please log in with your email and password.',
          )
          return
        }

        saveAuthToken(data.access_token!)

        if (data.must_set_password) {
          // First-time login — redirect to set-password screen
          router.replace('/dashboard/auth/set-password')
        } else {
          router.replace('/dashboard')
        }

        setStatus('success')
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again or log in with your email and password.')
      }
    }

    processToken()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Signing you in…</CardTitle>
            <CardDescription>Please wait while we verify your login link.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-destructive">Login Link Invalid</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <AppLink href="/dashboard/auth/login" className="w-full">Go to Login</AppLink>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <AppLink href="/dashboard/auth/forgot-password" className="w-full">Request a New Link</AppLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // status === 'success' — router.replace is in progress
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Logged in!</CardTitle>
          <CardDescription>Redirecting you to your dashboard…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MagicLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <MagicLoginContent />
    </Suspense>
  )
}
