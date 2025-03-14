import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Skeleton } from '@/components/ui/skeleton';
import { HydrateClient, trpc } from '@/trpc/server';

import { CarsClient } from './client';

// Add dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

export default async function CarsAdminPage() {
  void trpc.cars.getMany.prefetch();
  void trpc.categories.getMany.prefetch();
  void trpc.cars.getFilterOptions.prefetch();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cars Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your fleet of cars, add new vehicles, or update existing ones.
        </p>
      </div>

      <HydrateClient>
        <Suspense fallback={<TableSkeleton />}>
          <ErrorBoundary
            fallback={
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-6 text-center">
                <h3 className="text-destructive text-lg font-semibold">
                  Something went wrong
                </h3>
                <p className="text-muted-foreground mt-2">
                  Failed to load cars data. Please try again later.
                </p>
              </div>
            }
          >
            <CarsClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="border-b px-4 py-3">
          <Skeleton className="h-8 w-full" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b px-4 py-4">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
