import { ExternalLink } from 'lucide-react';
import { useLocationStatus } from '@hooks/use-location-status';
import { LocationMap } from './location-map';

import type { LocationState } from '@/types';

export function LocationContent({ location }: { location: LocationState }) {
  const { label } = useLocationStatus(location);
  const coordinates = encodeURIComponent(`${location.latitude},${location.longitude}`);

  return (
    <div className='w-64 max-w-full space-y-1.5'>
      <div className='relative isolate'>
        <LocationMap point={location} />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates}`}
          target='_blank'
          rel='noopener noreferrer'
          className='absolute inset-0 z-[550] rounded-lg'
          aria-label={`${label}. Abrir en Google Maps`}
        />
      </div>
      <span className='flex items-center justify-between gap-2 text-sm font-medium text-accent'>
        {label}
        <ExternalLink size={15} aria-hidden='true' />
      </span>
      {location.expiresAt && (
        <p className='text-[11px] text-text-secondary'>
          Última posición ·{' '}
          {new Date(location.capturedAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
