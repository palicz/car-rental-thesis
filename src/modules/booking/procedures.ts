// This file handles all the booking related operations for our car rental app
import { TRPCError } from '@trpc/server';
import { and, eq, gte, lte, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { bookings, cars, users } from '@/db/schema';
import { adminProcedure, baseProcedure, createTRPCRouter } from '@/trpc/init';

// zod schema for data validation
const bookingCreateSchema = z.object({
  carId: z.string().uuid(),
  startDate: z.date(),
  endDate: z.date(),
  isOver18: z.boolean(),
  drivingLicenseNumber: z.string().min(1),
});

export const bookingRouter = createTRPCRouter({
  create: baseProcedure
    .input(bookingCreateSchema)
    .mutation(async ({ input, ctx }) => {
      // Make sure user is logged in
      if (!ctx.currentUserId) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'You must be logged in to create a booking',
        });
      }

      // Check if user already has an active booking / 1 per USER
      const existingActiveBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.userId, ctx.currentUserId),
            or(eq(bookings.status, 'pending'), eq(bookings.status, 'approved')),
          ),
        );

      if (existingActiveBookings.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You already have an active booking.',
        });
      }

      // Get the car details for the booking
      const [car] = await db
        .select()
        .from(cars)
        .where(eq(cars.id, input.carId))
        .limit(1);

      if (!car) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Car not found',
        });
      }

      // Make sure the car is available
      if (!car.available) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Car is not available for booking',
        });
      }

      // OVERLAPPING BOOKINGS
      const overlappingBookings = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.carId, input.carId),
            eq(bookings.status, 'approved'),
            lte(bookings.startDate, input.endDate),
            gte(bookings.endDate, input.startDate),
          ),
        );

      if (overlappingBookings.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Car is already booked for these dates',
        });
      }

      // days * price per day
      const days = Math.ceil(
        (input.endDate.getTime() - input.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      const totalPrice = Number(car.pricePerDay) * days;

      const [booking] = await db
        .insert(bookings)
        .values({
          userId: ctx.currentUserId,
          carId: input.carId,
          startDate: input.startDate,
          endDate: input.endDate,
          totalPrice: totalPrice.toString(),
          isOver18: input.isOver18,
          drivingLicenseNumber: input.drivingLicenseNumber,
        })
        .returning();

      return booking;
    }),

  // All bookings for a user
  getUserBookings: baseProcedure.query(async ({ ctx }) => {
    if (!ctx.currentUserId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to view your bookings',
      });
    }

    const userBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        car: {
          name: cars.name,
          imageUrl: cars.imageUrl,
        },
      })
      .from(bookings)
      .leftJoin(cars, eq(bookings.carId, cars.id))
      .where(eq(bookings.userId, ctx.currentUserId))
      .orderBy(bookings.createdAt);

    return userBookings;
  }),

  // Admin only - gets all bookings in the system
  getAll: adminProcedure.query(async () => {
    const allBookings = await db
      .select({
        id: bookings.id,
        startDate: bookings.startDate,
        endDate: bookings.endDate,
        totalPrice: bookings.totalPrice,
        status: bookings.status,
        isOver18: bookings.isOver18,
        drivingLicenseNumber: bookings.drivingLicenseNumber,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        car: {
          id: cars.id,
          name: cars.name,
          imageUrl: cars.imageUrl,
          pricePerDay: cars.pricePerDay,
        },
      })
      .from(bookings)
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(cars, eq(bookings.carId, cars.id))
      .orderBy(bookings.createdAt);

    return allBookings;
  }),

  // Admin only - update the status of a booking
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.enum(['pending', 'approved', 'completed', 'cancelled']),
      }),
    )
    .mutation(async ({ input }) => {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .limit(1);

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        });
      }

      // same status update not allowed
      if (booking.status === input.status) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Booking is already in this status',
        });
      }

      const [updatedBooking] = await db
        .update(bookings)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(bookings.id, input.id))
        .returning();

      return updatedBooking;
    }),
});
