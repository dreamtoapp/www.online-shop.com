'use server';

import { cache } from 'react';
import db from '@/lib/prisma';

export const companyInfo = cache(async () => {
  return await db.company.findFirst();
});
