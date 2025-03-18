import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { HydrateClient, trpc } from '@/trpc/server';

import { BookingsClient } from './client';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  await trpc.booking.getUserBookings.prefetch();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          View and manage your car bookings.
        </p>
      </div>
      <HydrateClient>
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary
            fallback={
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-6 text-center">
                <h3 className="text-destructive text-lg font-semibold">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mt-2">
                  Failed to load bookings. Please try again later.
                </p>
              </div>
            }
          >
            <BookingsClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}
