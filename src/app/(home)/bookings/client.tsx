'use client';

import { differenceInDays, format } from 'date-fns';
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/trpc/client';

type Booking = {
  id: string;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  car: {
    name: string;
    imageUrl: string | null;
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': {
      return 'bg-green-50 text-green-700 border-green-100';
    }
    case 'pending': {
      return 'bg-amber-50 text-amber-700 border-amber-100';
    }
    case 'completed': {
      return 'bg-blue-50 text-blue-700 border-blue-100';
    }
    case 'cancelled': {
      return 'bg-red-50 text-red-700 border-red-100';
    }
    default: {
      return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }
};

// calc the duration
const getDuration = (start: Date, end: Date) => {
  return differenceInDays(new Date(end), new Date(start));
};

export const BookingsClient = () => {
  // Get data ?
  const [bookings] = trpc.booking.getUserBookings.useSuspenseQuery();
  // Copy to clipboard state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-8">
        <CalendarDays className="text-muted-foreground/60 h-12 w-12" />
        <div className="text-center">
          <h3 className="text-lg font-medium">No bookings found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            You haven&apos;t made any bookings yet
          </p>
        </div>
        <Button asChild size="sm" className="mt-2">
          {/* fallback link */}
          <Link href="/cars">Browse cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(bookings as Booking[]).map(booking => (
        <Card key={booking.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-1 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-medium">{booking.car.name}</h3>
                <Badge
                  className={`${getStatusColor(booking.status)} px-2.5 py-0.5 text-xs font-medium capitalize`}
                >
                  {booking.status}
                </Badge>
              </div>

              <div className="grid gap-y-5">
                <div className="text-muted-foreground flex items-center text-sm">
                  <div className="flex min-w-32 items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    <span>Rental period</span>
                  </div>
                  <div className="text-foreground">
                    {format(booking.startDate, 'MMM d')} -{' '}
                    {format(booking.endDate, 'MMM d, yyyy')}
                    <span className="text-muted-foreground ml-1">
                      ({getDuration(booking.startDate, booking.endDate)} days)
                    </span>
                  </div>
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <div className="flex min-w-32 items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Booking ID</span>
                  </div>
                  <div className="text-foreground max-w-[200px] truncate font-mono text-xs">
                    {booking.id}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-muted h-6 w-6 cursor-pointer rounded-full"
                    onClick={() => copyToClipboard(booking.id)}
                    title="Copy booking ID"
                  >
                    <Copy
                      className={`h-3.5 w-3.5 ${copiedId === booking.id ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                  </Button>
                </div>

                <div className="text-muted-foreground flex items-center text-sm">
                  <div className="flex min-w-32 items-center gap-1.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Total price</span>
                  </div>
                  <div className="text-foreground font-medium">
                    ${booking.totalPrice}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-muted/10 relative h-24 shrink-0 border-t sm:h-auto sm:w-36 sm:border-t-0 sm:border-l md:w-48">
              <Image
                src={booking.car.imageUrl || '/images/defaultcar.jpg'}
                alt={booking.car.name}
                fill
                className="object-cover opacity-90"
              />
              {booking.status === 'approved' && (
                <div className="absolute top-2 right-2 rounded-full bg-white p-1 shadow-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
