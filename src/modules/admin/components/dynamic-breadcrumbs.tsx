'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';

// Navigation structure matching the sidebar
const navigationStructure = {
  Overview: [{ title: 'Dashboard', url: '/admin' }],
  Management: [
    { title: 'Users', url: '/admin/users' },
    { title: 'Cars', url: '/admin/cars' },
    { title: 'Bookings', url: '/admin/bookings' },
  ],
  Settings: [{ title: 'Categories', url: '/admin/categories' }],
};

// Function to find current page and section
const findCurrentPage = (pathname: string) => {
  // Check for exact matches first
  for (const [section, items] of Object.entries(navigationStructure)) {
    const currentItem = items.find(item => item.url === pathname);
    if (currentItem) {
      return { section, item: currentItem, isExactMatch: true };
    }
  }

  // Check for partial matches (for nested routes)
  for (const [section, items] of Object.entries(navigationStructure)) {
    const currentItem = items.find(item => pathname.startsWith(item.url + '/'));
    if (currentItem) {
      return { section, item: currentItem, isExactMatch: false };
    }
  }

  // Default to Dashboard if no match found
  return {
    section: 'Overview',
    item: navigationStructure.Overview[0],
    isExactMatch: pathname === '/admin',
  };
};

// Component to fetch and display car name for edit page
const CarNameBreadcrumb = ({ id }: { id: string }) => {
  const { data, isLoading, error } = trpc.cars.getById.useQuery(
    { id },
    {
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) {
    return <Skeleton className="h-5 w-24" />;
  }

  if (error || !data) {
    return <span>Unknown Car</span>;
  }

  return <span>{data.name}</span>;
};

export const DynamicBreadcrumbs = () => {
  const pathname = usePathname();
  const { section, item, isExactMatch } = findCurrentPage(pathname);

  // Parse the pathname to determine additional breadcrumb items
  const pathSegments = pathname.split('/').filter(Boolean);

  // Determine if we're on a car-specific page
  const isCarPage = pathname.startsWith('/admin/cars/');
  const isNewCarPage = pathname === '/admin/cars/new';
  const isCarEditPage = isCarPage && !isNewCarPage && pathSegments.length === 3;
  const carId = isCarEditPage ? pathSegments[2] : null;

  return (
    <>
      {/* Home Icon */}
      <BreadcrumbItem>
        <BreadcrumbLink
          href="/admin"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Home className="size-3.5" />
          <span className="sr-only">Home</span>
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbSeparator>
        <ChevronRight className="text-muted-foreground/70 size-3.5" />
      </BreadcrumbSeparator>

      {/* Section */}
      <BreadcrumbItem>
        <BreadcrumbLink
          href="/admin"
          className={cn(
            'text-sm font-medium',
            item.url === '/admin'
              ? 'text-foreground pointer-events-none'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {section}
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* Page Title (if not on dashboard) */}
      {item.url !== '/admin' && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="text-muted-foreground/70 size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            {isExactMatch ? (
              <BreadcrumbPage className="text-sm font-medium">
                {item.title}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href={item.url}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                {item.title}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </>
      )}

      {/* Additional segments for car pages */}
      {isNewCarPage && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="text-muted-foreground/70 size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">
              Add New Car
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}

      {isCarEditPage && carId && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="text-muted-foreground/70 size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">
              <Suspense
                fallback={<Skeleton className="inline-block h-5 w-24" />}
              >
                <CarNameBreadcrumb id={carId} />
              </Suspense>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  );
};
