import { Suspense } from 'react';
import { getAllGyms } from '@/lib/gyms-api';
import { GymCard } from '@/components/gym-card';
import { GymSearchInput } from '@/components/gym-search-input';
import { Gym } from '@/types/gym';

interface GymsPageProps {
  searchParams: Promise<{
    search?: string;
    state?: string;
    city?: string;
    trending?: string;
  }>;
}

export default async function GymsPage({ searchParams }: GymsPageProps) {
  const params = await searchParams;
  const searchTerm = params.search || '';
  const state = params.state || '';
  const city = params.city || '';
  const trending = params.trending === 'true' ? true : params.trending === 'false' ? false : undefined;

  let gyms: Gym[] = [];
  try {
    gyms = await getAllGyms(searchTerm, state, city, trending);
  } catch (error) {
    console.error('Failed to load gyms:', error);
    // You could show an error message to the user here
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <GymCard key={gym.id} gym={gym} />
          ))}
        </div>

        {gyms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No gyms found matching "${searchTerm}". Try adjusting your search.`
                : 'No gyms found. Try adjusting your search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

