'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/utils';

interface GymHeroImageProps {
  src?: string;
  alt: string;
}

export function GymHeroImage({ src, alt }: GymHeroImageProps) {
  const [imgSrc, setImgSrc] = useState(src || getPlaceholderImage('gym'));

  useEffect(() => {
    setImgSrc(src || getPlaceholderImage('gym'));
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className='object-cover'
      priority
      onError={() => setImgSrc(getPlaceholderImage('gym'))}
    />
  );
}

