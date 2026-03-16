'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiMagicLogin, saveAuthToken } from '@/lib/gym-owner-auth'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage('No token found in the URL. Please use the link from your email.')
      return
    }

    async function processToken() {
      try {
        const data = await apiMagicLogin(token as string)

        if (!data.success) {
          setStatus('error')
          setErrorMessage(
            data.message || 'This link is invalid or has expired. Please request a new one.',
          )
          return
        }

        saveAuthToken(data.access_token!)
        setStatus('success')
        router.replace('/list-your-gym/set-password')
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Please try again.')
      }
    }

    processToken()
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-xl'>Verifying your link…</CardTitle>
          <CardDescription>Please wait while we sign you in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center py-8'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'error') {
    return (
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-xl text-destructive'>Link Invalid or Expired</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Button asChild className='w-full'>
            <Link href='/gyms'>Back to Gyms</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='text-xl'>Signed in!</CardTitle>
        <CardDescription>Taking you to set your password…</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-center py-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        </div>
      </CardContent>
    </Card>
  )
}

export default function ListYourGymAuthPage() {
  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
      <Suspense
        fallback={
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
        }
      >
        <AuthContent />
      </Suspense>
    </div>
  )
}
