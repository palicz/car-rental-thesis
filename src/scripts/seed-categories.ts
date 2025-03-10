/* eslint-disable unicorn/prefer-top-level-await */

// TODO: Create a script to seed categories

import { db } from '@/db';
import { categories } from '@/db/schema';

const categoryNames = [
  'Pickup',
  'SUV',
  'Buggy',
  'Convertible',
  'Coupe',
  'Minivan',
  'Hatchback',
  'Sedan',
  'Sport',
  'Other',
];

async function main() {
  console.log('Seeding categories...');

  try {
    const values = categoryNames.map(name => ({
      name,
      description: `Cars related to ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);

    console.log('Categories seeded successfully');
  } catch (error) {
    console.error('Error seeding categories', error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

main();
