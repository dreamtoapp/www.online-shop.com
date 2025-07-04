// utils/orderNumber.ts
'use server';

import db from '../../../../lib/prisma';

export async function generateOrderNumber(): Promise<string> {
  // Use Prisma's `upsert` to atomically update the global counter
  const counter = await db.counter.upsert({
    where: { key: 'order_counter' }, // Unique key for the global counter
    update: { counter: { increment: 1 } }, // Increment the counter
    create: { key: 'order_counter', counter: 1 }, // Initialize if it doesn't exist
  });

  // Format the sequential number
  const sequentialNumber = String(counter.counter).padStart(6, '0'); // 6 digits for scalability

  // Return the new short order number format
  return `ORD-${sequentialNumber}`;
}
