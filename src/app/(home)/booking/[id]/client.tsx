'use client';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { BookingForm } from '@/modules/booking/ui/booking-form';
import { trpc } from '@/trpc/client';

interface BookingClientProps {
  id: string;
}

export const BookingClient = ({ id }: BookingClientProps) => {
  const [car] = trpc.cars.getById.useSuspenseQuery({ id });

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        {/* Cars details */}
        <div className="space-y-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
            <Image
              src={car.imageUrl || '/images/defaultcar.jpg'}
              alt={car.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{car.name}</h2>
            {car.category && (
              <Badge variant="outline" className="mt-2">
                {car.category.name}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Price per day</p>
              <p className="text-2xl font-bold">${car.pricePerDay}</p>
            </div>
          </div>

          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {car.doors && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Doors</p>
                  <p className="font-medium">{car.doors}</p>
                </div>
              )}
              {car.seats && (
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm">Seats</p>
                  <p className="font-medium">{car.seats}</p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">AC</p>
                <p className="font-medium">{car.hasAC ? 'Yes' : 'No'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Transmission</p>
                <p className="font-medium">
                  {car.transmissionType?.name || 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">Fuel</p>
                <p className="font-medium">{car.fuelType?.name || 'N/A'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking */}
      <div className="mt-10">
        <BookingForm carId={id} pricePerDay={Number(car.pricePerDay)} />
      </div>
    </>
  );
};
