import { ChevronRight, Home } from 'lucide-react';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

export const BreadcrumbSkeleton = () => {
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
        <Skeleton className="h-5 w-20" />
      </BreadcrumbItem>

      <BreadcrumbSeparator>
        <ChevronRight className="text-muted-foreground/70 size-3.5" />
      </BreadcrumbSeparator>

      {/* Page */}
      <BreadcrumbItem>
        <Skeleton className="h-5 w-24" />
      </BreadcrumbItem>

      {/* Optional third level (for car edit/new) */}
      <BreadcrumbSeparator>
        <ChevronRight className="text-muted-foreground/70 size-3.5" />
      </BreadcrumbSeparator>

      <BreadcrumbItem>
        <Skeleton className="h-5 w-32" />
      </BreadcrumbItem>
    </>
  );
};
