'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/trpc/client';

interface BookingFormProps {
  carId: string;
  pricePerDay: number;
}

export const BookingForm = ({ carId, pricePerDay }: BookingFormProps) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isOver18, setIsOver18] = useState(false);
  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState('');

  useEffect(() => {
    const url = new URL(globalThis.location.href);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');

    if (startDateParam && endDateParam) {
      try {
        setStartDate(new Date(startDateParam));
        setEndDate(new Date(endDateParam));
      } catch (error) {
        console.error('Invalid date parameters:', error);
        router.push('/cars');
      }
    } else {
      toast.error('Please select rental dates first');
      router.push('/cars');
    }
  }, [router]);

  const createBooking = trpc.booking.create.useMutation({
    onSuccess: () => {
      toast.success('Your booking has been submitted for review.', {});
      router.push('/bookings');
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !isOver18 || !drivingLicenseNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    createBooking.mutate({
      carId,
      startDate,
      endDate,
      isOver18,
      drivingLicenseNumber,
    });
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return days * pricePerDay;
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'MMMM dd, yyyy') : 'Not selected';
  };

  const getDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  };

  if (!startDate || !endDate) {
    return <div>Loading booking details...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-none shadow-none">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium">Rental Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Start Date</p>
              <p className="font-medium">{formatDate(startDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">End Date</p>
              <p className="font-medium">{formatDate(endDate)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">Duration</p>
              <p className="font-medium">{getDays()} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Driving License Number</Label>
        <Input
          className="cursor-pointer"
          value={drivingLicenseNumber}
          onChange={e => setDrivingLicenseNumber(e.target.value)}
          placeholder="Enter your driving license number"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          className="cursor-pointer"
          id="isOver18"
          checked={isOver18}
          onCheckedChange={checked => setIsOver18(checked as boolean)}
        />
        <Label className="cursor-pointer" htmlFor="isOver18">
          I confirm that I am over 18 years old
        </Label>
      </div>

      <div className="bg-muted rounded-lg p-4">
        <div className="flex justify-between">
          <span>Total Price:</span>
          <span className="font-bold">${calculateTotalPrice()}</span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={createBooking.isPending}
      >
        {createBooking.isPending ? 'Creating booking...' : 'Create Booking'}
      </Button>
    </form>
  );
};
