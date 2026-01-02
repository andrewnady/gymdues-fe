'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Gym } from '@/types/gym';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { getReviewCount, getPlaceholderImage } from '@/lib/utils';

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

interface GymCardProps {
  gym: Gym;
}

export function GymCard({ gym }: GymCardProps) {
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const imageSrc = gym.gallery?.[0]?.path && !imageError ? gym.gallery[0].path : getPlaceholderImage('gym');
  const logoSrc = gym.logo?.path && !logoError ? gym.logo.path : getPlaceholderImage('logo');

  return (
    <Link href={`/gyms/${gym.slug}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={imageSrc}
            alt={gym.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        </div>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                <Image
                  src={logoSrc}
                  alt={`${gym.name} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                  onError={() => setLogoError(true)}
                />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl mb-2">{gym.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>{gym.city}, {gym.state}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{gym.rating || 0}</span>
              <span className="text-sm text-muted-foreground">({getReviewCount(gym)})</span>
            </div>
          </div>
          {gym.tags && gym.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {gym.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-2">{stripHtmlTags(gym.description)}</CardDescription>
          {gym.amenities && gym.amenities.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-1">Amenities:</p>
              <p className="text-sm">{gym.amenities.slice(0, 3).join(' • ')}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}

