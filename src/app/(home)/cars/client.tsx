'use client';

import { AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Car,
  CarFilters as CarFiltersType,
  FilterOptions,
} from '@/modules/cars/types';
import { CarCard } from '@/modules/cars/ui/car-card';
import { DateSelector } from '@/modules/cars/ui/date-selector';
import { CarFilters } from '@/modules/cars/ui/filters';
import { trpc } from '@/trpc/client';

export const PageClient = () => {
  const [filters, setFilters] = useState<CarFiltersType>({});
  const [resetKey, setResetKey] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const url = new URL(globalThis.location.href);
    const startDateParam = url.searchParams.get('startDate');
    const endDateParam = url.searchParams.get('endDate');

    if (startDateParam && endDateParam) {
      try {
        const from = new Date(startDateParam);
        const to = new Date(endDateParam);
        setDateRange({ from, to });
        setIsSearching(true);
      } catch (error) {
        console.error('Invalid date parameters:', error);
      }
    }
  }, []);

  // filter options
  const filterOptionsQuery = trpc.cars.getFilterOptions.useSuspenseQuery();
  const filterOptions = filterOptionsQuery[0] as FilterOptions;

  const availableCarsQuery = trpc.cars.getAvailable.useQuery(
    {
      startDate: dateRange?.from as Date,
      endDate: dateRange?.to as Date,
    },
    {
      enabled: !!(dateRange?.from && dateRange?.to),
    },
  );

  // reset filters
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setFilters({});
      setResetKey(prev => prev + 1);
    }
  }, [dateRange?.from, dateRange?.to]);

  const handleFilterChange = (newFilters: CarFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setResetKey(prev => prev + 1);
  };

  // client-side filter
  const filteredCars = useMemo(() => {
    const cars = (availableCarsQuery.data || []) as unknown as Car[];

    return cars.filter(car => {
      // category
      if (
        filters.categoryIds?.length &&
        car.categoryId &&
        !filters.categoryIds.includes(car.categoryId)
      ) {
        return false;
      }

      // Transmission
      if (
        filters.transmissionTypeIds?.length &&
        car.transmissionTypeId &&
        !filters.transmissionTypeIds.includes(car.transmissionTypeId)
      ) {
        return false;
      }

      // Fuel
      if (
        filters.fuelTypeIds?.length &&
        car.fuelTypeId &&
        !filters.fuelTypeIds.includes(car.fuelTypeId)
      ) {
        return false;
      }

      // Doors
      if (
        filters.minDoors !== undefined &&
        car.doors !== null &&
        car.doors < filters.minDoors
      ) {
        return false;
      }
      if (
        filters.maxDoors !== undefined &&
        car.doors !== null &&
        car.doors > filters.maxDoors
      ) {
        return false;
      }

      // Seats
      if (
        filters.minSeats !== undefined &&
        car.seats !== null &&
        car.seats < filters.minSeats
      ) {
        return false;
      }
      if (
        filters.maxSeats !== undefined &&
        car.seats !== null &&
        car.seats > filters.maxSeats
      ) {
        return false;
      }

      // AC
      if (filters.hasAC !== undefined && car.hasAC !== filters.hasAC) {
        return false;
      }

      return true;
    });
  }, [availableCarsQuery.data, filters]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Find Available Cars</h1>

      {/* Date selector */}
      <div className="mb-8 space-y-3">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Select Your Rental Period
          </h2>
          <div className="space-y-4">
            <DateSelector
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-full"
              required={true}
            />
          </div>
        </div>
      </div>

      {availableCarsQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-full mb-6">
            <div className="bg-primary/10 text-primary animate-pulse rounded-lg p-4 text-center">
              <p>Searching for available cars...</p>
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, index) => (
            <CarCardSkeleton key={index} />
          ))}
        </div>
      ) : dateRange?.from && dateRange?.to ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Filters sidebar */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={handleClearFilters}
                className="text-primary cursor-pointer text-sm hover:underline"
              >
                Reset all
              </button>
            </div>
            {filterOptions ? (
              <CarFilters
                categories={filterOptions.categories}
                transmissionTypes={filterOptions.transmissionTypes}
                fuelTypes={filterOptions.fuelTypes}
                doorsRange={filterOptions.doorsRange}
                seatsRange={filterOptions.seatsRange}
                onFilterChange={handleFilterChange}
                resetKey={resetKey}
                disabled={availableCarsQuery.isLoading}
              />
            ) : (
              <FilterSkeleton />
            )}
          </div>

          {/* Cars grid */}
          <div className="md:col-span-3">
            {availableCarsQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load available cars. Please try again.
                </AlertDescription>
              </Alert>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCars.map((car: Car) => (
                  <CarCard key={car.id} car={car} dateRange={dateRange} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground text-lg">
                  {availableCarsQuery.data &&
                  (availableCarsQuery.data as unknown as Car[]).length > 0
                    ? 'No cars match your filter criteria.'
                    : 'No cars available for the selected dates.'}
                </p>
                {Object.keys(filters).length > 0 && (
                  <button
                    className="text-primary mt-4 cursor-pointer text-sm hover:underline"
                    onClick={handleClearFilters}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground text-lg">
            Please select your rental dates to see available cars.
          </p>
        </div>
      )}
    </div>
  );
};

const CarCardSkeleton = () => {
  return (
    <div className="bg-muted/40 overflow-hidden rounded-lg border shadow-sm">
      <div className="bg-muted aspect-[16/9] animate-pulse" />
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

const FilterSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};
