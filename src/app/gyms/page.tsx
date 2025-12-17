import { Suspense } from 'react';
import Link from 'next/link';
import { getPaginatedGyms } from '@/lib/gyms-api';
import { GymCard } from '@/components/gym-card';
import { GymSearchInput } from '@/components/gym-search-input';
import { Button } from '@/components/ui/button';
import { Gym } from '@/types/gym';

interface GymsPageProps {
  searchParams: Promise<{
    search?: string;
    state?: string;
    city?: string;
    trending?: string;
    page?: string;
  }>;
}

export default async function GymsPage({ searchParams }: GymsPageProps) {
  const params = await searchParams;
  const searchTerm = params.search || '';
  const state = params.state || '';
  const city = params.city || '';
  const trending = params.trending === 'true' ? true : params.trending === 'false' ? false : undefined;
  const perPage = 12;
  const pageFromParams = params.page ? parseInt(params.page, 10) || 1 : 1;

  let gyms: Gym[] = [];
  let totalGyms = 0;
  let totalPages = 1;
  let currentPage = pageFromParams;
  let fromIndex: number | null = null;
  let toIndex: number | null = null;

  try {
    const { gyms: pageGyms, meta } = await getPaginatedGyms({
      search: searchTerm,
      state,
      city,
      trending,
      page: pageFromParams,
      perPage,
    });

    gyms = pageGyms;
    totalGyms = meta.total;
    totalPages = meta.last_page || 1;
    currentPage = meta.current_page || pageFromParams;
    fromIndex = meta.from;
    toIndex = meta.to;
  } catch (error) {
    console.error('Failed to load gyms:', error);
  }

  const buildPageUrl = (page: number) => {
    const search = new URLSearchParams();

    if (searchTerm) {
      search.set('search', searchTerm);
    }
    if (state) {
      search.set('state', state);
    }
    if (city) {
      search.set('city', city);
    }
    if (typeof trending === 'boolean') {
      search.set('trending', trending.toString());
    }
    if (page > 1) {
      search.set('page', page.toString());
    }

    const queryString = search.toString();
    return queryString ? `/gyms?${queryString}` : '/gyms';
  };

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

        {gyms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        )}

        {totalGyms === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm 
                ? `No gyms found matching "${searchTerm}". Try adjusting your search.`
                : 'No gyms found. Try adjusting your search.'}
            </p>
          </div>
        )}

        {totalGyms > 0 && totalPages > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
            <p className="text-sm text-muted-foreground">
              Showing{' '}
              <span className="font-medium">
                {fromIndex ?? ( (currentPage - 1) * perPage + 1)}
              </span>
              {'–'}
              <span className="font-medium">
                {toIndex ?? Math.min(currentPage * perPage, totalGyms)}
              </span>{' '}
              of{' '}
              <span className="font-medium">
                {totalGyms}
              </span>{' '}
              gyms
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                asChild
              >
                <Link href={buildPageUrl(currentPage - 1)}>
                  Previous
                </Link>
              </Button>

              <span className="text-sm text-muted-foreground">
                Page{' '}
                <span className="font-medium">
                  {currentPage}
                </span>{' '}
                of{' '}
                <span className="font-medium">
                  {totalPages}
                </span>
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                asChild
              >
                <Link href={buildPageUrl(currentPage + 1)}>
                  Next
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

