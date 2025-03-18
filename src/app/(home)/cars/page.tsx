import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Skeleton } from '@/components/ui/skeleton';
import { HydrateClient, trpc } from '@/trpc/server';

import { PageClient } from './client';

export const dynamic = 'force-dynamic';

export default async function CarsPage() {
  void trpc.categories.getMany.prefetch();
  void trpc.cars.getMany.prefetch();
  void trpc.cars.getFilterOptions.prefetch();

  return (
    <HydrateClient>
      <Suspense fallback={<PageSkeleton />}>
        <ErrorBoundary
          fallback={
            <p className="p-8 text-center text-red-500">
              Something went wrong loading the cars. Please try again later.
            </p>
          }
        >
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  );
}

const PageSkeleton = () => {
  return (
    <div className="container mx-auto py-8">
      <Skeleton className="mb-8 h-10 w-64" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filters skeleton */}
        <div className="md:col-span-1">
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>

        {/* Cars grid skeleton */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CarCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CarCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex justify-between pt-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};
