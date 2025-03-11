'use client';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Car } from '@/modules/cars/types';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  // Convert pricePerDay to number if it's a string
  const price =
    typeof car.pricePerDay === 'string'
      ? Number.parseFloat(car.pricePerDay)
      : car.pricePerDay;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={`/images/cars/${car.id}.jpg`}
          alt={car.name}
          fill
          className="object-cover"
          onError={e => {
            // Fallback image if the car image doesn't exist
            e.currentTarget.src = '/images/cars/default.jpg';
          }}
        />
      </div>
      <CardHeader>
        <CardTitle>{car.name}</CardTitle>
        {car.category && (
          <Badge variant="outline" className="w-fit">
            {car.category.name}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {car.doors && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Doors:</span>
              <span>{car.doors}</span>
            </div>
          )}
          {car.seats && (
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Seats:</span>
              <span>{car.seats}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">AC:</span>
            <span>{car.hasAC ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-lg font-bold">${price.toFixed(2)}</div>
        <div className="text-muted-foreground text-sm">per day</div>
      </CardFooter>
    </Card>
  );
}
