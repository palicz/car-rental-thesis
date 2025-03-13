import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';
import { ratelimit } from '@/lib/ratelimit';

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  return { currentUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

/**
 * Protected procedure middleware that ensures the request is authenticated.
 *
 * This middleware:
 * 1. Verifies a user ID exists in the current context
 * 2. Validates that the user exists in the database
 * 3. Throws UNAUTHORIZED errors if authentication fails
 *
 * Use this for routes that require authentication.
 * @example
 * const myProtectedRoute = protectedProcedure.query(({ ctx }) => {
 *   // Access authenticated user data safely
 *   return { userId: ctx.currentUserId };
 * });
 */
export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    // Check if user ID exists in the context (from session)
    if (!ctx.currentUserId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Verify the user exists in the database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.currentUserId))
      .limit(1);

    // Handle case where user ID is valid but user record doesn't exist
    // (e.g., user was deleted but session still exists)
    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { success } = await ratelimit.limit(user.id);

    if (!success) {
      throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
    }

    // Continue to the next middleware or resolver with the same context
    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);

/**
 * Admin procedure middleware that ensures the request is authenticated and the user has admin role.
 *
 * This middleware:
 * 1. Uses the protectedProcedure to verify authentication
 * 2. Checks if the authenticated user has the 'admin' role
 * 3. Throws FORBIDDEN errors if the user is not an admin
 *
 * Use this for routes that require admin privileges.
 * @example
 * const adminOnlyRoute = adminProcedure.mutation(({ ctx }) => {
 *   // Perform admin-only operations
 *   return { success: true };
 * });
 */
export const adminProcedure = protectedProcedure.use(
  async function isAdmin(opts) {
    const { ctx } = opts;

    // Check if the user has admin role
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You must be an admin to perform this action',
      });
    }

    // Continue to the next middleware or resolver with the same context
    return opts.next({
      ctx,
    });
  },
);
