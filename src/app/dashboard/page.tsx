'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppLink } from '@/components/app-link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiGetMe, getAuthToken, clearAuthToken } from '@/lib/gym-owner-auth'
import type { GymOwnerUser, GymInfo } from '@/lib/gym-owner-auth'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<GymOwnerUser | null>(null)
  const [gym, setGym] = useState<GymInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAuthToken()

    if (!token) {
      router.replace('/dashboard/auth/login')
      return
    }

    async function loadProfile() {
      try {
        const data = await apiGetMe(token as string)

        if (!data.success || !data.user) {
          clearAuthToken()
          router.replace('/dashboard/auth/login')
          return
        }

        setUser(data.user)
        setGym(data.gym ?? null)
      } catch {
        clearAuthToken()
        router.replace('/dashboard/auth/login')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] bg-muted/30">
      {/* Dashboard Header */}
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Gym Owner Dashboard</h1>
            {user && (
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Body */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Claimed Gym Card */}
        {gym ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription className="mb-1">Your Claimed Business</CardDescription>
                  <CardTitle className="text-2xl">{gym.name}</CardTitle>
                </div>
                <Badge className="bg-green-600 text-white hover:bg-green-700 shrink-0">
                  Verified Owner
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1">Gym ID</p>
                  <p className="font-medium">#{gym.id}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1">Claim Status</p>
                  <p className="font-medium text-green-600">Approved</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="sm">
                  <AppLink href="/dashboard/profile" className="inline-flex">
                    Manage Profile
                  </AppLink>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <AppLink href={`/gyms/${gym.slug ?? encodeURIComponent(gym.name.toLowerCase().replace(/\s+/g, '-'))}`} target="_blank" className="inline-flex">
                    View Public Listing
                  </AppLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Gym Linked</CardTitle>
              <CardDescription>
                Your account doesn&apos;t have an approved gym claim yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <AppLink href="/gyms">Find &amp; Claim Your Gym</AppLink>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Account Info Card */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <AppLink
                  href="/dashboard/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Change password
                </AppLink>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
