import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { cars, categories } from '@/db/schema';
import { adminProcedure, baseProcedure, createTRPCRouter } from '@/trpc/init';

export const categoriesRouter = createTRPCRouter({
  // get all categories
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(categories);
    return data;
  }),

  // Create a nw category
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await db.insert(categories).values(input);
    }),

  // kModify a category
  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.update(categories).set(data).where(eq(categories.id, id));
    }),

  // Delete a category
  delete: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      // Update the related cars
      await db
        .update(cars)
        .set({
          available: false,
          categoryId: null,
        })
        .where(eq(cars.categoryId, input.id));

      // Delete the category (//TODO: make sure it is safe to delete)
      return await db.delete(categories).where(eq(categories.id, input.id));
    }),
});
