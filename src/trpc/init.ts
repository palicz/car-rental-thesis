import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

import { db } from '@/db';
import { users } from '@/db/schema';
import { auth } from '@/lib/auth';

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

    // Continue to the next middleware or resolver with the same context
    return opts.next({
      ctx: {
        ...ctx,
        user,
      },
    });
  },
);
