'use client';

import { User } from 'better-auth/types';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { authClient } from '@/lib/auth-client';

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
          className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
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
