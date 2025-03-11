import { Suspense } from 'react';

import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import { AdminSidebar } from '../components/admin-sidebar';
import { BreadcrumbSkeleton } from '../components/breadcrumb-skeleton';
import { DynamicBreadcrumbs } from '../components/dynamic-breadcrumbs';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-background md:peer-data-[variant=inset]:rounded-xl">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center border-b backdrop-blur md:rounded-t-xl">
          <div className="flex w-full items-center px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground rounded-md" />
              <Separator orientation="vertical" className="h-6" />
              <Breadcrumb>
                <BreadcrumbList>
                  <Suspense fallback={<BreadcrumbSkeleton />}>
                    <DynamicBreadcrumbs />
                  </Suspense>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};
