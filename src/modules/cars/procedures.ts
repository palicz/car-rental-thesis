import { TRPCError } from '@trpc/server';
import { and, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { cars, categories, fuelTypes, transmissionTypes } from '@/db/schema';
import type { Context } from '@/trpc/init';
import { adminProcedure, baseProcedure, createTRPCRouter } from '@/trpc/init';

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

// Schema for car updates
const carUpdateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  categoryId: z.string().uuid().nullable(),
  transmissionTypeId: z.string().uuid().nullable(),
  fuelTypeId: z.string().uuid().nullable(),
  doors: z.number().int().min(1).max(10).nullable(),
  seats: z.number().int().min(1).max(20).nullable(),
  hasAC: z.boolean(),
  pricePerDay: z.number().positive(),
  available: z.boolean(),
});

type CarUpdateInput = z.infer<typeof carUpdateSchema>;
type CarCreateInput = Omit<CarUpdateInput, 'id'>;

export const carsRouter = createTRPCRouter({
  // Public procedures - accessible to all users
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

  // Get a car by ID - accessible to all users
  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const data = await db
        .select()
        .from(cars)
        .leftJoin(categories, eq(cars.categoryId, categories.id))
        .where(eq(cars.id, input.id));

      if (data.length === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Car not found',
        });
      }

      // Transform the joined data to match the expected format
      return {
        ...data[0].cars,
        category: data[0].categories,
      };
    }),

  // Get all available filter options - accessible to all users
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

  // Admin-only procedures - protected with adminProcedure

  // Update a car - admin only
  update: adminProcedure
    .input(carUpdateSchema)
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: CarUpdateInput;
        ctx: Context & { user: any };
      }) => {
        const { id, ...updateData } = input;

        // Check if the car exists
        const existingCar = await db
          .select({ id: cars.id })
          .from(cars)
          .where(eq(cars.id, id));

        if (existingCar.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Car not found',
          });
        }

        // Log the admin action
        console.log(`Admin ${ctx.currentUserId} updated car ${id}`);

        // Update the car
        await db
          .update(cars)
          .set({
            ...updateData,
            // Convert pricePerDay to string to match the database schema
            pricePerDay: updateData.pricePerDay.toString(),
            updatedAt: new Date(),
          })
          .where(eq(cars.id, id));

        return { success: true };
      },
    ),

  // Create a new car - admin only
  create: adminProcedure
    .input(carUpdateSchema.omit({ id: true }))
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: CarCreateInput;
        ctx: Context & { user: any };
      }) => {
        // Log the admin action
        console.log(`Admin ${ctx.currentUserId} created a new car`);

        // Insert the new car
        const result = await db
          .insert(cars)
          .values({
            ...input,
            // Convert pricePerDay to string to match the database schema
            pricePerDay: input.pricePerDay.toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning({ id: cars.id });

        return {
          success: true,
          id: result[0].id,
        };
      },
    ),

  // Delete a car - admin only
  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: { id: string };
        ctx: Context & { user: any };
      }) => {
        const { id } = input;

        // Check if the car exists
        const existingCar = await db
          .select({ id: cars.id })
          .from(cars)
          .where(eq(cars.id, id));

        if (existingCar.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Car not found',
          });
        }

        // Log the admin action
        console.log(`Admin ${ctx.currentUserId} deleted car ${id}`);

        // Delete the car
        await db.delete(cars).where(eq(cars.id, id));

        return { success: true };
      },
    ),
});
