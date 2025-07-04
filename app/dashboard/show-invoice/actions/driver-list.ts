import db from '@/lib/prisma';
import { cacheData } from '@/lib/cache'; // Import cacheData function
import { UserRole } from '@prisma/client';

export const getDriver = cacheData(
  async () => {
    // Use User model with role: 'DRIVER' instead of Driver model
    const data = await db.user.findMany({
      where: { 
        role: UserRole.DRIVER,
        name: { not: null } // Only get drivers with non-null names
      },
      select: { id: true, name: true },
    });
    return data;
  },
  ['drivers_list'], // Cache key parts
  { revalidate: 60 }, // Cache options with revalidation every 60 seconds
);

export async function getDriversList() {
  // Use User model with role: 'DRIVER' instead of Driver model
  return db.user.findMany({
    where: { role: UserRole.DRIVER },
    select: { id: true, name: true, phone: true },
  });
}
