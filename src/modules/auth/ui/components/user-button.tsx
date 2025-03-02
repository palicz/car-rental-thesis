'use client';

import { ClapperboardIcon, LogOut } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth-client';

type User = (typeof auth.$Infer.Session)['user'];

interface UserButtonProps {
  user: User;
}

export const UserButton = ({ user }: UserButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full p-1 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <UserAvatar
            imageUrl={user.image || ''}
            name={user.name}
            size="default"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() =>
            signOut().then(() => {
              // Force a page refresh to clear all client state
              globalThis.location.reload();
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
