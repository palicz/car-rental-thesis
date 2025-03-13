import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { HydrateClient, trpc } from '@/trpc/server';

import { UsersClient } from './client';
import { TableSkeleton } from './table-skeleton';

export const dynamic = 'force-dynamic';

export default async function UsersAdminPage() {
  void trpc.users.getMany.prefetch();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your users, view their details, and handle user-related
          actions.
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
                  Failed to load users data. Please try again later.
                </p>
              </div>
            }
          >
            <UsersClient />
          </ErrorBoundary>
        </Suspense>
      </HydrateClient>
    </div>
  );
}
