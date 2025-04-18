import { bookingRouter } from '@/modules/booking/procedures';
import { carsRouter } from '@/modules/cars/procedures';
import { categoriesRouter } from '@/modules/categories/procedures';
import { usersRouter } from '@/modules/users/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  cars: carsRouter,
  users: usersRouter,
  booking: bookingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
