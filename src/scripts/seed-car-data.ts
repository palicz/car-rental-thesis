/* eslint-disable unicorn/prefer-top-level-await */

import { randomUUID } from 'node:crypto';

import { db } from '@/db';
import { cars, categories, fuelTypes, transmissionTypes } from '@/db/schema';

// Transmission types data
const transmissionTypeNames = [
  'Manual',
  'Automatic',
  'Semi-automatic',
  'CVT',
  'Dual-clutch',
];

// Fuel types data
const fuelTypeNames = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid',
  'LPG',
  'CNG',
];

// Sample car data
const carSamples = [
  {
    name: 'Toyota Corolla',
    categoryName: 'Sedan',
    transmissionTypeName: 'Automatic',
    fuelTypeName: 'Petrol',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 50,
  },
  {
    name: 'Honda Civic',
    categoryName: 'Sedan',
    transmissionTypeName: 'Manual',
    fuelTypeName: 'Petrol',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 55,
  },
  {
    name: 'Ford F-150',
    categoryName: 'Pickup',
    transmissionTypeName: 'Automatic',
    fuelTypeName: 'Diesel',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 80,
  },
  {
    name: 'Jeep Wrangler',
    categoryName: 'SUV',
    transmissionTypeName: 'Manual',
    fuelTypeName: 'Petrol',
    doors: 2,
    seats: 4,
    hasAC: true,
    pricePerDay: 75,
  },
  {
    name: 'Tesla Model 3',
    categoryName: 'Sedan',
    transmissionTypeName: 'Automatic',
    fuelTypeName: 'Electric',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 90,
  },
  {
    name: 'BMW 3 Series',
    categoryName: 'Sedan',
    transmissionTypeName: 'Automatic',
    fuelTypeName: 'Petrol',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 85,
  },
  {
    name: 'Mazda MX-5',
    categoryName: 'Convertible',
    transmissionTypeName: 'Manual',
    fuelTypeName: 'Petrol',
    doors: 2,
    seats: 2,
    hasAC: true,
    pricePerDay: 70,
  },
  {
    name: 'Toyota Prius',
    categoryName: 'Hatchback',
    transmissionTypeName: 'CVT',
    fuelTypeName: 'Hybrid',
    doors: 5,
    seats: 5,
    hasAC: true,
    pricePerDay: 60,
  },
  {
    name: 'Volkswagen Golf',
    categoryName: 'Hatchback',
    transmissionTypeName: 'Manual',
    fuelTypeName: 'Petrol',
    doors: 5,
    seats: 5,
    hasAC: true,
    pricePerDay: 55,
  },
  {
    name: 'Mercedes-Benz S-Class',
    categoryName: 'Sedan',
    transmissionTypeName: 'Automatic',
    fuelTypeName: 'Diesel',
    doors: 4,
    seats: 5,
    hasAC: true,
    pricePerDay: 120,
  },
  {
    name: 'Porsche 911',
    categoryName: 'Sport',
    transmissionTypeName: 'Dual-clutch',
    fuelTypeName: 'Petrol',
    doors: 2,
    seats: 4,
    hasAC: true,
    pricePerDay: 150,
  },
  {
    name: 'Honda CR-V',
    categoryName: 'SUV',
    transmissionTypeName: 'CVT',
    fuelTypeName: 'Petrol',
    doors: 5,
    seats: 5,
    hasAC: true,
    pricePerDay: 65,
  },
];

async function main() {
  console.log('Seeding car data...');

  try {
    // Step 1: Seed transmission types
    console.log('Seeding transmission types...');
    const transmissionValues = transmissionTypeNames.map(name => ({
      id: randomUUID(),
      name,
    }));
    await db.insert(transmissionTypes).values(transmissionValues);
    console.log('Transmission types seeded successfully');

    // Step 2: Seed fuel types
    console.log('Seeding fuel types...');
    const fuelValues = fuelTypeNames.map(name => ({
      id: randomUUID(),
      name,
    }));
    await db.insert(fuelTypes).values(fuelValues);
    console.log('Fuel types seeded successfully');

    // Step 3: Fetch the IDs of categories, transmission types, and fuel types
    const categoryRows = await db.select().from(categories);
    const transmissionRows = await db.select().from(transmissionTypes);
    const fuelRows = await db.select().from(fuelTypes);

    // Create lookup maps for easier reference
    const categoryMap = new Map(categoryRows.map(c => [c.name, c.id]));
    const transmissionMap = new Map(transmissionRows.map(t => [t.name, t.id]));
    const fuelMap = new Map(fuelRows.map(f => [f.name, f.id]));

    // Step 4: Seed cars
    console.log('Seeding cars...');
    const carValues = carSamples.map(car => ({
      id: randomUUID(),
      name: car.name,
      categoryId: categoryMap.get(car.categoryName),
      transmissionTypeId: transmissionMap.get(car.transmissionTypeName),
      fuelTypeId: fuelMap.get(car.fuelTypeName),
      doors: car.doors,
      seats: car.seats,
      hasAC: car.hasAC,
      pricePerDay: car.pricePerDay.toString(), // Convert to string for Drizzle
      available: true,
    }));
    await db.insert(cars).values(carValues);
    console.log('Cars seeded successfully');

    console.log('All car data seeded successfully');
  } catch (error) {
    console.error('Error seeding car data', error);
    console.error(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

main();
