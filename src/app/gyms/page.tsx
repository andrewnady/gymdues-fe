import { Suspense } from 'react';
import type { Metadata } from 'next';
import { GymsPageClient } from '@/components/gyms-page-client';
import { GymSearchInput } from '@/components/gym-search-input';

export const metadata: Metadata = {
  title: 'Browse Gyms - GymDues',
  description: 'Discover fitness centers in your area. Compare plans, read reviews, and find the perfect gym for your fitness journey.',
  openGraph: {
    title: 'Browse Gyms - GymDues',
    description: 'Discover fitness centers in your area. Compare plans, read reviews, and find the perfect gym for your fitness journey.',
    type: 'website',
  },
};

export default function GymsPage() {

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Gyms</h1>
          <p className="text-muted-foreground mb-6">
            Discover fitness centers in your area
          </p>
          <div className="max-w-md">
            <Suspense fallback={
              <div className="relative">
                <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
              </div>
            }>
              <GymSearchInput />
            </Suspense>
          </div>
        </div>
        <GymsPageClient />
      </div>
    </div>
  );
}

