import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { cars, categories, fuelTypes, transmissionTypes } from '@/db/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

const filterSchema = z.object({
  categoryIds: z.array(z.string().uuid()).optional(),
  transmissionTypeIds: z.array(z.string().uuid()).optional(),
  fuelTypeIds: z.array(z.string().uuid()).optional(),
  minDoors: z.number().optional(),
  maxDoors: z.number().optional(),
  minSeats: z.number().optional(),
  maxSeats: z.number().optional(),
  hasAC: z.boolean().optional(),
});

export const carsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db
      .select()
      .from(cars)
      .leftJoin(categories, eq(cars.categoryId, categories.id));

    // Transform the joined data to match the expected format
    return data.map(row => ({
      ...row.cars,
      category: row.categories,
    }));
  }),

  // Get all available filter options
  getFilterOptions: baseProcedure.query(async () => {
    const [categoriesData, transmissionTypesData, fuelTypesData] =
      await Promise.all([
        db.select().from(categories),
        db.select().from(transmissionTypes),
        db.select().from(fuelTypes),
      ]);

    // Get min/max values for numeric filters using SQL functions
    const doorsRange = await db
      .select({
        min: sql<number | null>`MIN(${cars.doors})`,
        max: sql<number | null>`MAX(${cars.doors})`,
      })
      .from(cars);

    const seatsRange = await db
      .select({
        min: sql<number | null>`MIN(${cars.seats})`,
        max: sql<number | null>`MAX(${cars.seats})`,
      })
      .from(cars);

    return {
      categories: categoriesData,
      transmissionTypes: transmissionTypesData,
      fuelTypes: fuelTypesData,
      doorsRange: doorsRange[0],
      seatsRange: seatsRange[0],
    };
  }),
});
