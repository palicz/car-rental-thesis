'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { deleteImage, uploadImage } from '@/app/actions/upload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Car, FilterOptions } from '@/modules/cars/types';
import { trpc } from '@/trpc/client';

// Form schema for car edit
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Car name must be at least 2 characters.',
  }),
  categoryId: z.string().uuid().nullable(),
  transmissionTypeId: z.string().uuid().nullable(),
  fuelTypeId: z.string().uuid().nullable(),
  doors: z.coerce.number().int().min(1).max(10).nullable(),
  seats: z.coerce.number().int().min(1).max(20).nullable(),
  hasAC: z.boolean().default(false),
  pricePerDay: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  available: z.boolean().default(true),
  image: z
    .instanceof(File)
    .refine(
      file => file.size <= 1024 * 1024, // 1MB limit
      'Image size must be less than 1MB',
    )
    .refine(file => file.type.startsWith('image/'), 'File must be an image')
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CarEditClientProps {
  id: string;
}

export function CarEditClient({ id }: CarEditClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const utils = trpc.useUtils();

  useEffect(() => {
    utils.cars.getById.invalidate({ id });
  }, [id, utils.cars.getById]);

  const carQuery = trpc.cars.getById.useSuspenseQuery(
    { id },
    { refetchOnMount: true },
  );
  const filterOptionsQuery = trpc.cars.getFilterOptions.useSuspenseQuery();

  const car = carQuery[0] as Car;
  const filterOptions = filterOptionsQuery[0] as FilterOptions;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: car.name,
      categoryId: car.categoryId,
      transmissionTypeId: car.transmissionTypeId,
      fuelTypeId: car.fuelTypeId,
      doors: car.doors,
      seats: car.seats,
      hasAC: car.hasAC,
      pricePerDay:
        typeof car.pricePerDay === 'string'
          ? Number.parseFloat(car.pricePerDay)
          : car.pricePerDay,
      available: car.available,
    },
  });

  useEffect(() => {
    if (car) {
      form.reset({
        name: car.name,
        categoryId: car.categoryId,
        transmissionTypeId: car.transmissionTypeId,
        fuelTypeId: car.fuelTypeId,
        doors: car.doors,
        seats: car.seats,
        hasAC: car.hasAC,
        pricePerDay:
          typeof car.pricePerDay === 'string'
            ? Number.parseFloat(car.pricePerDay)
            : car.pricePerDay,
        available: car.available,
      });
    }
  }, [car, form]);

  const updateMutation = trpc.cars.update.useMutation({
    onSuccess: () => {
      utils.cars.getById.invalidate({ id });
      utils.cars.getMany.invalidate();

      toast.success('Car updated successfully');
      router.push('/admin/cars');
      router.refresh();
    },
    onError: error => {
      toast.error(`Failed to update car: ${error.message}`);
      console.error(error);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Image size must be less than 1MB');
        e.target.value = ''; // RESET INPUT FIELD
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File must be an image');
        e.target.value = ''; // RESET INPUT FIELD
        return;
      }

      form.setValue('image', file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (car?.imageUrl) {
      setPreviewUrl(car.imageUrl);
    }
  }, [car?.imageUrl]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      let imageUrl: string | undefined = car?.imageUrl || undefined;
      if (values.image) {
        try {
          // Upload new image first
          const newImageUrl = await uploadImage(values.image);

          // If upload successful and there was an old image then delete it
          if (newImageUrl && car?.imageUrl) {
            try {
              await deleteImage(car.imageUrl);
            } catch (error) {
              console.error('Failed to delete old image:', error);
              toast.error('Failed to delete old image. Please try again.');
              return;
            }
          }

          imageUrl = newImageUrl;
        } catch {
          toast.error('Failed to upload image. Please try again.');
          return;
        }
      }

      await updateMutation.mutateAsync({
        id,
        ...values,
        imageUrl,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild className="mb-6">
          <Link href="/admin/cars">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cars
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Car Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Car Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter car name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(value || null)}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transmission Type */}
            <FormField
              control={form.control}
              name="transmissionTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(value || null)}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.transmissionTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fuel Type */}
            <FormField
              control={form.control}
              name="fuelTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(value || null)}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filterOptions.fuelTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Doors */}
            <FormField
              control={form.control}
              name="doors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doors</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of doors"
                      {...field}
                      value={field.value || ''}
                      onChange={e => {
                        const value =
                          e.target.value === ''
                            ? null
                            : Number.parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seats */}
            <FormField
              control={form.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seats</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of seats"
                      {...field}
                      value={field.value || ''}
                      onChange={e => {
                        const value =
                          e.target.value === ''
                            ? null
                            : Number.parseInt(e.target.value, 10);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Per Day */}
            <FormField
              control={form.control}
              name="pricePerDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Per Day</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price per day"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Has AC */}
            <FormField
              control={form.control}
              name="hasAC"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Air Conditioning</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Available */}
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Available for Rent</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <div>
              <h3 className="text-lg font-medium">Car Image</h3>
              <p className="text-muted-foreground text-sm">
                Upload an image of the car. MAXIMUM 1MB SUPPORTED
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="Car preview"
                    className="object-contain"
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      No image selected
                    </p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-md"
              />
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/cars')}
              disabled={isSubmitting || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
            >
              {isSubmitting || updateMutation.isPending ? (
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
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
