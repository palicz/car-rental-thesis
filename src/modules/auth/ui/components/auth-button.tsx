'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';

import { UserButton } from './user-button';

export const AuthButton = () => {
  const { data, isPending } = useSession();
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (isPending) {
    return (
      <>
        <Skeleton className="h-6 w-15.5" />
        <Skeleton className="h-10 w-24" />
      </>
    );
  }

  if (!data)
    return (
      <>
        <Link
          href="/login"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign in
        </Link>
        <Link href="/register">
          <Button variant="custom">Get started</Button>
        </Link>
      </>
    );

  return <UserButton user={data.user} />;
};
