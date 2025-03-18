'use client';

import { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  CarFilters as CarFiltersType,
  FilterOptions,
} from '@/modules/cars/types';

type FilterProps = {
  categories: FilterOptions['categories'];
  transmissionTypes: FilterOptions['transmissionTypes'];
  fuelTypes: FilterOptions['fuelTypes'];
  doorsRange: FilterOptions['doorsRange'];
  seatsRange: FilterOptions['seatsRange'];
  onFilterChange: (filters: CarFiltersType) => void;
  resetKey?: number;
  disabled?: boolean;
};

export function CarFilters({
  categories,
  transmissionTypes,
  fuelTypes,
  doorsRange,
  seatsRange,
  onFilterChange,
  resetKey = 0,
  disabled = false,
}: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    [],
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);

  // Default values if null
  const minDoors = doorsRange.min ?? 2;
  const maxDoors = doorsRange.max ?? 5;
  const minSeats = seatsRange.min ?? 2;
  const maxSeats = seatsRange.max ?? 7;

  const [doorRange, setDoorRange] = useState<[number, number]>([
    minDoors,
    maxDoors,
  ]);
  const [seatRange, setSeatRange] = useState<[number, number]>([
    minSeats,
    maxSeats,
  ]);
  const [hasAC, setHasAC] = useState<boolean | undefined>();

  // Reset all filters when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setSelectedCategories([]);
      setSelectedTransmissions([]);
      setSelectedFuelTypes([]);
      setDoorRange([minDoors, maxDoors]);
      setSeatRange([minSeats, maxSeats]);
      setHasAC(undefined);
    }
  }, [resetKey, minDoors, maxDoors, minSeats, maxSeats]);

  const handleCategoryChange = (id: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, id]
      : selectedCategories.filter(c => c !== id);

    setSelectedCategories(newCategories);
    updateFilters({ categoryIds: newCategories });
  };

  const handleTransmissionChange = (id: string, checked: boolean) => {
    const newTransmissions = checked
      ? [...selectedTransmissions, id]
      : selectedTransmissions.filter(t => t !== id);

    setSelectedTransmissions(newTransmissions);
    updateFilters({ transmissionTypeIds: newTransmissions });
  };

  const handleFuelTypeChange = (id: string, checked: boolean) => {
    const newFuelTypes = checked
      ? [...selectedFuelTypes, id]
      : selectedFuelTypes.filter(f => f !== id);

    setSelectedFuelTypes(newFuelTypes);
    updateFilters({ fuelTypeIds: newFuelTypes });
  };

  const handleDoorRangeChange = (value: number[]) => {
    setDoorRange([value[0], value[1]]);
    updateFilters({ minDoors: value[0], maxDoors: value[1] });
  };

  const handleSeatRangeChange = (value: number[]) => {
    setSeatRange([value[0], value[1]]);
    updateFilters({ minSeats: value[0], maxSeats: value[1] });
  };

  const handleACChange = (checked: boolean) => {
    const newValue = checked ? true : undefined;
    setHasAC(newValue);
    updateFilters({ hasAC: newValue });
  };

  const updateFilters = (newFilters: Partial<CarFiltersType>) => {
    onFilterChange({
      categoryIds: selectedCategories,
      transmissionTypeIds: selectedTransmissions,
      fuelTypeIds: selectedFuelTypes,
      minDoors: doorRange[0],
      maxDoors: doorRange[1],
      minSeats: seatRange[0],
      maxSeats: seatRange[1],
      hasAC,
      ...newFilters,
    });
  };

  return (
    <div
      className={`w-full max-w-xs space-y-4 ${disabled ? 'pointer-events-none opacity-70' : ''}`}
    >
      <Accordion
        type="multiple"
        defaultValue={['categories', 'transmission', 'fuel']}
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="cursor-pointer">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    className="cursor-pointer"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      handleCategoryChange(category.id, checked === true)
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className={
                      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transmission">
          <AccordionTrigger className="cursor-pointer">
            Transmission
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {transmissionTypes.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    className="cursor-pointer"
                    id={`transmission-${type.id}`}
                    checked={selectedTransmissions.includes(type.id)}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      handleTransmissionChange(type.id, checked === true)
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`transmission-${type.id}`}
                    className={
                      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }
                  >
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="fuel">
          <AccordionTrigger className="cursor-pointer">
            Fuel Type
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {fuelTypes.map(type => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    className="cursor-pointer"
                    id={`fuel-${type.id}`}
                    checked={selectedFuelTypes.includes(type.id)}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      handleFuelTypeChange(type.id, checked === true)
                    }
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`fuel-${type.id}`}
                    className={
                      disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }
                  >
                    {type.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="doors">
          <AccordionTrigger className="cursor-pointer">
            Number of Doors
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <Slider
                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                min={minDoors}
                max={maxDoors}
                step={1}
                value={doorRange}
                onValueChange={handleDoorRangeChange}
                disabled={disabled}
              />
              <div className="flex justify-between">
                <span>{doorRange[0]} doors</span>
                <span>{doorRange[1]} doors</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seats">
          <AccordionTrigger className="cursor-pointer">
            Number of Seats
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <Slider
                className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                min={minSeats}
                max={maxSeats}
                step={1}
                value={seatRange}
                onValueChange={handleSeatRangeChange}
                disabled={disabled}
              />
              <div className="flex justify-between">
                <span>{seatRange[0]} seats</span>
                <span>{seatRange[1]} seats</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          className="cursor-pointer"
          id="ac"
          checked={hasAC === true}
          onCheckedChange={handleACChange}
          disabled={disabled}
        />
        <Label
          htmlFor="ac"
          className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        >
          Has Air Conditioning
        </Label>
      </div>
    </div>
  );
}
