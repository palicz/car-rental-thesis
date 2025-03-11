'use client';

import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

// Navigation structure matching the sidebar
const navigationStructure = {
  Overview: [
    { title: 'Dashboard', url: '/admin' },
    { title: 'Analytics', url: '/admin/analytics' },
  ],
  Management: [
    { title: 'Users', url: '/admin/users' },
    { title: 'Cars', url: '/admin/cars' },
    { title: 'Bookings', url: '/admin/bookings' },
  ],
  Settings: [
    { title: 'Categories', url: '/admin/categories' },
    { title: 'Pricing', url: '/admin/pricing' },
    { title: 'Settings', url: '/admin/settings' },
  ],
};

// Function to find current page and section
const findCurrentPage = (pathname: string) => {
  for (const [section, items] of Object.entries(navigationStructure)) {
    const currentItem = items.find(item => item.url === pathname);
    if (currentItem) {
      return { section, item: currentItem };
    }
  }
  // Default to Dashboard if no match found
  return { section: 'Overview', item: navigationStructure.Overview[0] };
};

export const DynamicBreadcrumbs = () => {
  const pathname = usePathname();
  const { section, item } = findCurrentPage(pathname);

  return (
    <>
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
      {item.url !== '/admin' && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="text-muted-foreground/70 size-3.5" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sm font-medium">
              {item.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </>
  );
};
