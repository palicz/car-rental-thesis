'use client';

import { Calendar, LogOut, ShieldIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { UserAvatar } from '@/components/user-avatar';
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
          className="flex items-center gap-2 p-1 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <UserAvatar
            imageUrl={user.image || ''}
            name={user.name}
            size="default"
          />
          <div className="flex flex-col items-start">
            <span className="text-muted-foreground text-xs">Logged in as:</span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            router.push('/bookings');
          }}
        >
          <Calendar className="mr-2 h-4 w-4" />
          My Bookings
        </DropdownMenuItem>
        <Separator />
        {user.role === 'admin' && (
          <>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={() => {
                router.push('/admin');
              }}
            >
              <ShieldIcon className="mr-2 h-4 w-4 text-red-600" />
              Admin Console
            </DropdownMenuItem>
            <Separator />
          </>
        )}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
