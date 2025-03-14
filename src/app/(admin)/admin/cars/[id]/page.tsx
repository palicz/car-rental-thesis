import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Skeleton } from '@/components/ui/skeleton';
import { HydrateClient, trpc } from '@/trpc/server';

import { CarEditClient } from './client';

// Add dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

// Define params type as a Promise
type Params = Promise<{ id: string }>;

interface CarEditPageProps {
  params: Params;
}

// Metadata for the page
export async function generateMetadata({
  params,
}: CarEditPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Car | Admin`,
  };
}

export default async function CarEditPage({ params }: CarEditPageProps) {
  try {
    const { id } = await params;

    await trpc.cars.getById.prefetch({ id });
    await trpc.categories.getMany.prefetch();
    await trpc.cars.getFilterOptions.prefetch();

    return (
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
          <p className="text-muted-foreground mt-2">
            Update the car details and save your changes.
          </p>
        </div>

        <HydrateClient>
          <Suspense fallback={<EditFormSkeleton />}>
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
              <CarEditClient id={id} />
            </ErrorBoundary>
          </Suspense>
        </HydrateClient>
      </div>
    );
  } catch {
    notFound();
  }
}

function EditFormSkeleton() {
  return (
    <div className="space-y-8 rounded-lg border p-8">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[200px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
    </div>
  );
}
