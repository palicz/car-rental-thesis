import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { HydrateClient, trpc } from '@/trpc/server';

import ProfileClient from './client';
import { ProfileSkeleton } from './profile-skeleton';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  await trpc.booking.getUserBookings.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<ProfileSkeleton />}>
        <ErrorBoundary
          fallback={
            <div className="border-destructive/50 bg-destructive/10 rounded-md border p-6 text-center">
              <h3 className="text-destructive text-lg font-semibold">
                Something went wrong
              </h3>
              <p className="text-muted-foreground mt-2">
                Failed to load profile data. Please try again later.
              </p>
            </div>
          }
        >
          <ProfileClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}
