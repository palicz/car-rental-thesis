'use client';

import { useMemo, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Car,
  CarFilters as CarFiltersType,
  FilterOptions,
} from '@/modules/cars/types';
import { CarCard } from '@/modules/cars/ui/car-card';
import { CarFilters } from '@/modules/cars/ui/filters';
import { trpc } from '@/trpc/client';

export const PageClient = () => {
  const [filters, setFilters] = useState<CarFiltersType>({});
  const [resetKey, setResetKey] = useState(0);

  // Fetch all data once
  const filterOptionsQuery = trpc.cars.getFilterOptions.useSuspenseQuery();
  const filterOptions = filterOptionsQuery[0] as FilterOptions;

  // Fetch all cars once
  const carsQuery = trpc.cars.getMany.useSuspenseQuery();
  const allCars = carsQuery[0] as Car[];

  // Filter cars on the client side
  const filteredCars = useMemo(() => {
    return allCars.filter(car => {
      // Category filter
      if (
        filters.categoryIds?.length &&
        car.categoryId &&
        !filters.categoryIds.includes(car.categoryId)
      ) {
        return false;
      }

      // Transmission type filter
      if (
        filters.transmissionTypeIds?.length &&
        car.transmissionTypeId &&
        !filters.transmissionTypeIds.includes(car.transmissionTypeId)
      ) {
        return false;
      }

      // Fuel type filter
      if (
        filters.fuelTypeIds?.length &&
        car.fuelTypeId &&
        !filters.fuelTypeIds.includes(car.fuelTypeId)
      ) {
        return false;
      }

      // Doors filter
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

      // Seats filter
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

      // AC filter
      if (filters.hasAC !== undefined && car.hasAC !== filters.hasAC) {
        return false;
      }

      return true;
    });
  }, [allCars, filters]);

  const handleFilterChange = (newFilters: CarFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setResetKey(prev => prev + 1); // Increment reset key to trigger UI reset
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Available Cars</h1>

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
            />
          ) : (
            <FilterSkeleton />
          )}
        </div>

        {/* Cars grid */}
        <div className="md:col-span-3">
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car: Car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-lg">
                No cars found matching your filters.
              </p>
              <button
                className="text-primary mt-4 cursor-pointer text-sm hover:underline"
                onClick={handleClearFilters}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for filters
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
