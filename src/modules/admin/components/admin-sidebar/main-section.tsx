'use client';

import {
  Calendar,
  Car,
  FolderTree,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const overviewItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
];

const managementItems = [
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Cars',
    url: '/admin/cars',
    icon: Car,
  },
  {
    title: 'Bookings',
    url: '/admin/bookings',
    icon: Calendar,
  },
];

const settingsItems = [
  {
    title: 'Categories',
    url: '/admin/categories',
    icon: FolderTree,
  },
];

export const MainSection = () => {
  return (
    <div>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col">
          <SidebarMenu>
            {overviewItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url} className="flex items-center gap-4">
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="mt-4">
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col">
          <SidebarMenu>
            {managementItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url} className="flex items-center gap-4">
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="mt-4">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarGroupContent className="flex flex-col">
          <SidebarMenu>
            {settingsItems.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link href={item.url} className="flex items-center gap-4">
                    <item.icon />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
};
