'use client';

import {
  ChevronDown,
  ChevronUp,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Car, FilterOptions } from '@/modules/cars/types';
import { trpc } from '@/trpc/client';

type SortField =
  | 'name'
  | 'category'
  | 'transmission'
  | 'fuel'
  | 'price'
  | 'available';
type SortDirection = 'asc' | 'desc';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.src = '/images/defaultcar.jpg';
};

export function CarsClient() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const carsQuery = trpc.cars.getMany.useSuspenseQuery();
  const filterOptionsQuery = trpc.cars.getFilterOptions.useSuspenseQuery();
  const utils = trpc.useUtils();

  const cars = carsQuery[0] as Car[];
  const filterOptions = filterOptionsQuery[0] as FilterOptions;

  const deleteMutation = trpc.cars.delete.useMutation({
    onSuccess: () => {
      toast.success('Car deleted successfully');
      utils.cars.getMany.invalidate();
      setDeleteDialogOpen(false);
      setCarToDelete(null);
      setIsDeleting(false);
    },
    onError: error => {
      toast.error(`Failed to delete car: ${error.message}`);
      setIsDeleting(false);
    },
  });

  const handleDeleteCar = useCallback((car: Car) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!carToDelete) return;

    try {
      setIsDeleting(true);
      await deleteMutation.mutateAsync({ id: carToDelete.id });
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  }, [carToDelete, deleteMutation]);

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField, sortDirection],
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredCars = useMemo(() => {
    const filtered = cars.filter(car =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      let valueA: string | number | boolean;
      let valueB: string | number | boolean;

      // If the values are equal, sort by name
      switch (sortField) {
        case 'name': {
          valueA = a.name;
          valueB = b.name;
          break;
        }
        case 'category': {
          valueA = a.category?.name || '';
          valueB = b.category?.name || '';
          break;
        }
        case 'transmission': {
          valueA =
            filterOptions.transmissionTypes.find(
              t => t.id === a.transmissionTypeId,
            )?.name || '';
          valueB =
            filterOptions.transmissionTypes.find(
              t => t.id === b.transmissionTypeId,
            )?.name || '';
          break;
        }
        case 'fuel': {
          valueA =
            filterOptions.fuelTypes.find(f => f.id === a.fuelTypeId)?.name ||
            '';
          valueB =
            filterOptions.fuelTypes.find(f => f.id === b.fuelTypeId)?.name ||
            '';
          break;
        }
        case 'price': {
          valueA =
            typeof a.pricePerDay === 'string'
              ? Number.parseFloat(a.pricePerDay)
              : a.pricePerDay;
          valueB =
            typeof b.pricePerDay === 'string'
              ? Number.parseFloat(b.pricePerDay)
              : b.pricePerDay;
          break;
        }
        case 'available': {
          valueA = a.available ? 1 : 0;
          valueB = b.available ? 1 : 0;
          break;
        }
        default: {
          valueA = a.name;
          valueB = b.name;
        }
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc'
          ? (valueA as number) - (valueB as number)
          : (valueB as number) - (valueA as number);
      }
    });
  }, [cars, searchQuery, sortField, sortDirection, filterOptions]);

  const renderSortIcon = useCallback(
    (field: SortField) => {
      if (sortField !== field) return null;
      return sortDirection === 'asc' ? (
        <ChevronUp className="ml-1 h-4 w-4" />
      ) : (
        <ChevronDown className="ml-1 h-4 w-4" />
      );
    },
    [sortField, sortDirection],
  );

  const getCategoryName = useCallback(
    (categoryId: string | null) => {
      if (!categoryId) return 'N/A';
      const category = filterOptions.categories.find(c => c.id === categoryId);
      return category?.name || 'Unknown';
    },
    [filterOptions.categories],
  );

  const getTransmissionName = useCallback(
    (transmissionTypeId: string | null) => {
      if (!transmissionTypeId) return 'N/A';
      const transmission = filterOptions.transmissionTypes.find(
        t => t.id === transmissionTypeId,
      );
      return transmission?.name || 'Unknown';
    },
    [filterOptions.transmissionTypes],
  );

  const getFuelTypeName = useCallback(
    (fuelTypeId: string | null) => {
      if (!fuelTypeId) return 'N/A';
      const fuelType = filterOptions.fuelTypes.find(f => f.id === fuelTypeId);
      return fuelType?.name || 'Unknown';
    },
    [filterOptions.fuelTypes],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search cars..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <Button className="gap-1" asChild>
          <Link href="/admin/cars/new">
            <Plus className="h-4 w-4" />
            Add New Car
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[300px] cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Car Details
                  {renderSortIcon('name')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('category')}
              >
                <div className="flex items-center">
                  Category
                  {renderSortIcon('category')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('transmission')}
              >
                <div className="flex items-center">
                  Transmission
                  {renderSortIcon('transmission')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('fuel')}
              >
                <div className="flex items-center">
                  Fuel Type
                  {renderSortIcon('fuel')}
                </div>
              </TableHead>
              <TableHead>Doors</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>AC</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price/Day
                  {renderSortIcon('price')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('available')}
              >
                <div className="flex items-center">
                  Status
                  {renderSortIcon('available')}
                </div>
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No cars found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCars.map(car => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted relative aspect-[4/3] w-20 overflow-hidden rounded-md">
                        <Image
                          src={car.imageUrl || '/images/defaultcar.jpg'}
                          alt={car.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          onError={handleImageError}
                          priority={false}
                        />
                      </div>
                      <span className="font-medium">{car.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(car.categoryId)}</TableCell>
                  <TableCell>
                    {getTransmissionName(car.transmissionTypeId)}
                  </TableCell>
                  <TableCell>{getFuelTypeName(car.fuelTypeId)}</TableCell>
                  <TableCell>{car.doors || 'N/A'}</TableCell>
                  <TableCell>{car.seats || 'N/A'}</TableCell>
                  <TableCell>{car.hasAC ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {typeof car.pricePerDay === 'string'
                      ? `$${Number.parseFloat(car.pricePerDay).toFixed(2)}`
                      : `$${car.pricePerDay.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        car.available
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {car.available ? 'Available' : 'Unavailable'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 cursor-pointer p-0"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/admin/cars/${car.id}`}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleDeleteCar(car)}
                        >
                          <Trash2 className="text-destructive mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Car</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {carToDelete?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-1"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg
                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
