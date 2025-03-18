import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { HydrateClient, trpc } from '@/trpc/server';

import { PageClient } from './client';
import { BookingTableSkeleton } from './table-skeleton';

export const dynamic = 'force-dynamic';
// disable caching, fresh data on each request
export const fetchCache = 'force-no-store';

export default async function BookingsPage() {
  void trpc.booking.getAll.prefetch();

  return (
    <div className="h-full w-full">
      <HydrateClient>
        <Suspense fallback={<BookingTableSkeleton />}>
          <ErrorBoundary
            fallback={
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-6 text-center">
                <h3 className="text-destructive text-lg font-semibold">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mt-2">
                  Failed to load booking data. Please try again later.
                </p>
              </div>
            }
          >
            <PageClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}
