'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiAcceptTeamInvite } from '@/lib/gym-team-api'
import { saveAuthToken } from '@/lib/gym-owner-auth'

function AcceptInviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [gymName, setGymName] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage('No invitation token found in the URL. Please use the link from your invitation email.')
      return
    }

    async function processInvite() {
      try {
        const data = await apiAcceptTeamInvite(token as string)

        if (!data.success) {
          setStatus('error')
          setErrorMessage(
            data.message ||
              'This invitation link is invalid or has expired. Please ask the gym owner to resend the invite.',
          )
          return
        }

        saveAuthToken(data.access_token!)

        if (data.gym?.name) {
          setGymName(data.gym.name)
        }

        setStatus('success')

        if (data.must_set_password) {
          router.replace('/dashboard/auth/set-password')
        } else {
          router.replace('/dashboard')
        }
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again or contact the gym owner.')
      }
    }

    processInvite()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Accepting your invitation…</CardTitle>
            <CardDescription>Please wait while we verify your invite link.</CardDescription>
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
            <CardTitle className="text-xl text-destructive">Invitation Invalid</CardTitle>
            <CardDescription>{errorMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/auth/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // status === 'success' — redirect in progress
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Invitation Accepted!</CardTitle>
          <CardDescription>
            {gymName
              ? `Welcome to ${gymName}. Redirecting you to set your password…`
              : 'Redirecting you to set your password…'}
          </CardDescription>
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

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  )
}
