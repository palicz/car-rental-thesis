'use client';

import { CalendarIcon, CarFrontIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/lib/auth-client';
import { trpc } from '@/trpc/client';

// date formatter
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function ProfileClient() {
  const { data: session } = useSession();
  const [bookings] = trpc.booking.getUserBookings.useSuspenseQuery();

  const user = session?.user;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
              <AvatarFallback className="text-xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <div className="text-muted-foreground text-sm">{user?.email}</div>
            <Badge variant="outline" className="text-xs">
              Member since{' '}
              {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
            </Badge>
          </div>

          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your personal account information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Full Name</span>
                  <span className="text-sm">{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email Address</span>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">User ID</span>
                  <span
                    className="max-w-[200px] truncate text-sm"
                    title={user?.id}
                  >
                    {user?.id}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Created</span>
                  <span className="text-sm">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email Verified</span>
                  <span className="text-sm">
                    {user?.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bookings Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Your Bookings
              </CardTitle>
              <CardDescription>
                {bookings.length > 0
                  ? `You have ${bookings.length} active booking${bookings.length === 1 ? '' : 's'}`
                  : 'You have no active bookings'}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            {bookings.length > 0 && (
              <CardFooter className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/bookings">View All Bookings</Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
