'use client';

import { Command } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { authClient } from '@/lib/auth-client';

import { MainSection } from './main-section';
import { UserSection } from './user-section';

export const AdminSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { data: session } = authClient.useSession();

  return (
    <Sidebar
      collapsible="icon"
      variant="inset"
      className="bg-sidebar/95 supports-[backdrop-filter]:bg-sidebar/60 border-r backdrop-blur"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border/50 border-b py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href="/admin"
                className="group flex items-center group-data-[collapsible=icon]:justify-center"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-9 items-center justify-center rounded-md shadow-sm transition-all group-hover:shadow">
                  <Command className="size-5" />
                </div>
                <div className="ml-3 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold">Car Rental</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Admin Console
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <div className="flex-1">
        <SidebarContent className="py-4">
          <MainSection />
        </SidebarContent>
      </div>
      <SidebarFooter className="border-sidebar-border/50 mt-auto border-t py-4">
        <UserSection user={session?.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
