import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Skeleton } from '@/components/ui/skeleton';
import { HydrateClient, trpc } from '@/trpc/server';

import { BookingClient } from './client';

export const dynamic = 'force-dynamic';

// next 15 async params need promise
// https://nextjs.org/docs/app/building-your-application/upgrading/version-15#async-request-apis-breaking-change

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;

  await trpc.cars.getById.prefetch({ id });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Book a car</h1>
        <p className="text-muted-foreground mt-2">
          Fill the details below to complete.
        </p>
      </div>
      <HydrateClient>
        <Suspense fallback={<BookingFormSkeleton />}>
          <ErrorBoundary
            fallback={
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-6 text-center">
                <h3 className="text-destructive text-lg font-semibold">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mt-2">
                  Failed to load car data. Please try again later.
                </p>
              </div>
            }
          >
            <BookingClient id={id} />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}

const BookingFormSkeleton = () => {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
