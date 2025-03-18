'use client';

import { Car as CarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSession } from '@/lib/auth-client';
import { Car } from '@/modules/cars/types';

type CarCardProps = {
  car: Car;
  dateRange?: DateRange;
};

export function CarCard({ car, dateRange }: CarCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const price =
    typeof car.pricePerDay === 'string'
      ? Number.parseFloat(car.pricePerDay)
      : car.pricePerDay;

  const handleBookClick = () => {
    if (session) {
      // usse dateRange prop directly
      if (dateRange?.from && dateRange?.to) {
        const startDate = dateRange.from.toISOString();
        const endDate = dateRange.to.toISOString();
        router.push(
          `/booking/${car.id}?startDate=${startDate}&endDate=${endDate}`,
        );
      } else {
        toast.error('Please select rental dates first');
        router.push('/cars');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {imageError ? (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <CarIcon className="text-muted-foreground h-12 w-12" />
          </div>
        ) : (
          <Image
            src={car.imageUrl || '/images/defaultcar.jpg'}
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        )}
        {car.available ? (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <Button
              onClick={handleBookClick}
              className="relative z-10 scale-0 transform cursor-pointer transition-transform duration-300 group-hover:scale-100"
              size="lg"
            >
              Book Now
            </Button>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <Badge variant="destructive" className="text-lg font-semibold">
              Not Available
            </Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle className="line-clamp-1">{car.name}</CardTitle>
            {car.category && (
              <Badge variant="outline" className="w-fit">
                {car.category.name}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">${price.toFixed(2)}</div>
            <div className="text-muted-foreground text-sm">per day</div>
          </div>
        </div>
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
      <CardFooter className="grid grid-cols-2 gap-4 border-t pt-4">
        <div className="text-muted-foreground text-sm">
          <div>Transmission:</div>
          <div className="text-foreground font-medium">
            {car.transmissionType?.name || 'N/A'}
          </div>
        </div>
        <div className="text-muted-foreground text-sm">
          <div>Fuel Type:</div>
          <div className="text-foreground font-medium">
            {car.fuelType?.name || 'N/A'}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
