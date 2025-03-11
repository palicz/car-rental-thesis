'use client';

import {
  Calendar,
  Car,
  DollarSign,
  FolderTree,
  LayoutDashboard,
  LineChart,
  MapPin,
  Settings,
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
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: LineChart,
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
  {
    title: 'Pricing',
    url: '/admin/pricing',
    icon: DollarSign,
  },
  {
    title: 'Settings',
    url: '/admin/settings',
    icon: Settings,
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
