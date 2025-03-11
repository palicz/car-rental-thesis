import { carsRouter } from '@/modules/cars/procedures';
import { categoriesRouter } from '@/modules/categories/procedures';

import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  cars: carsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
