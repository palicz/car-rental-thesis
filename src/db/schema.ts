import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  role: text('role'),
  banned: boolean('banned'),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const userCreateSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  t => [uniqueIndex('name_idx').on(t.name)],
);

export const transmissionTypes = pgTable('transmission_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // 'manual', 'automatic'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const fuelTypes = pgTable('fuel_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(), // 'petrol', 'diesel', 'electric', 'hybrid'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cars = pgTable('cars', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  categoryId: uuid('category_id').references(() => categories.id),
  transmissionTypeId: uuid('transmission_type_id').references(
    () => transmissionTypes.id,
  ),
  fuelTypeId: uuid('fuel_type_id').references(() => fuelTypes.id),
  doors: integer('doors'),
  seats: integer('seats'),
  hasAC: boolean('has_ac').default(false),
  pricePerDay: decimal('price_per_day', { precision: 10, scale: 2 }).notNull(),
  available: boolean('available').default(true),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  carId: uuid('car_id')
    .notNull()
    .references(() => cars.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status', {
    enum: ['pending', 'approved', 'completed', 'cancelled'],
  })
    .notNull()
    .default('pending'),
  isOver18: boolean('is_over_18').notNull(),
  drivingLicenseNumber: text('driving_license_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
