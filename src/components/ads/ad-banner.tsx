'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useState } from 'react';

interface AdBannerProps {
  ad: {
    id: string;
    name: string;
    imageUrl: string | null;
    linkUrl: string | null;
    placement: string;
  };
}

export function AdBanner({ ad }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Track impression
    fetch(`/api/ads/${ad.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'impression' }),
    }).catch(() => {});
  }, [ad.id]);

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'click' }),
    }).catch(() => {});
  };

  if (dismissed || !ad.imageUrl) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border bg-muted">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-background transition-colors"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close ad</span>
      </button>
      <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-muted-foreground">
        Ad
      </div>
      {ad.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
          <div className="relative h-32 md:h-44">
            <Image src={ad.imageUrl} alt={ad.name} fill className="object-cover" />
          </div>
        </a>
      ) : (
        <div className="relative h-32 md:h-44">
          <Image src={ad.imageUrl} alt={ad.name} fill className="object-cover" />
        </div>
      )}
    </div>
  );
}
