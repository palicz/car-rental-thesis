import {
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

export const BreadcrumbSkeleton = () => {
  return (
    <>
      <BreadcrumbItem>
        <Skeleton className="h-5 w-24" />
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Skeleton className="h-5 w-32" />
      </BreadcrumbItem>
    </>
  );
};
