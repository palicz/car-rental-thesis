'use client';

import {
  Calendar,
  CreditCard,
  LogOut,
  ShieldIcon,
  User,
  UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authClient } from '@/lib/auth-client';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
}

interface UserButtonProps {
  user: User;
}

export const UserButton = ({ user }: UserButtonProps) => {
  const router = useRouter();

  const onSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          className="relative flex h-10 items-center gap-2 rounded-full border pr-2 pl-2 focus-visible:ring-0 focus-visible:ring-offset-0 md:pr-4"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.image || ''} alt={user.name} />
            <AvatarFallback className="text-xs">
              {user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col items-start md:flex">
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 overflow-hidden rounded-xl p-1"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          </div>
          {user.role === 'admin' && (
            <Badge
              variant="outline"
              className="ml-2 border-red-200 bg-red-50 text-xs text-red-600"
            >
              Admin
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
            onClick={() => router.push('/profile')}
          >
            <UserIcon className="h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm"
            onClick={() => router.push('/bookings')}
          >
            <Calendar className="h-4 w-4" />
            <span>My Bookings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user.role === 'admin' && (
          <>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
              onClick={() => router.push('/admin')}
            >
              <ShieldIcon className="h-4 w-4 text-red-600" />
              <span>Admin Console</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4 text-red-600" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
