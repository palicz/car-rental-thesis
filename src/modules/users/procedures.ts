import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { users } from '@/db/schema';
import type { Context } from '@/trpc/init';
import { adminProcedure, createTRPCRouter } from '@/trpc/init';

// Schema for user updates
const userUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(['admin', 'user']).optional(),
  banned: z.boolean().optional(),
  banReason: z.string().optional().nullable(),
  banExpires: z.date().optional().nullable(),
});

export const usersRouter = createTRPCRouter({
  // Get all users - admin only
  getMany: adminProcedure.query(async () => {
    const data = await db.select().from(users);
    return data;
  }),

  // Get a user by ID - admin only
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id));

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      return user;
    }),

  // Update a user - admin only
  update: adminProcedure
    .input(userUpdateSchema)
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: z.infer<typeof userUpdateSchema>;
        ctx: Context & { user: any };
      }) => {
        const { id, ...updateData } = input;

        // Check if the user exists
        const existingUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, id));

        if (existingUser.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Log the admin action
        console.log(`Admin ${ctx.currentUserId} updated user ${id}`);

        // Update the user
        await db
          .update(users)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));

        return { success: true };
      },
    ),

  // Delete a user - admin only
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      async ({
        input,
        ctx,
      }: {
        input: { id: string };
        ctx: Context & { user: any };
      }) => {
        const { id } = input;

        // Check if the user exists
        const existingUser = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, id));

        if (existingUser.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Log the admin action
        console.log(`Admin ${ctx.currentUserId} deleted user ${id}`);

        // Delete the user
        await db.delete(users).where(eq(users.id, id));

        return { success: true };
      },
    ),
});
