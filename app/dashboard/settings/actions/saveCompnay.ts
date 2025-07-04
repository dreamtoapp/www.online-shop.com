'use server';

import { z } from 'zod';

import db from '@/lib/prisma';

import { CompanySchema } from '../helper/companyZodAndInputs';

export async function saveCompany(rawData: unknown) {
  console.log('🔄 Saving company data:', rawData);

  try {
    // ✅ 1. Validate input using Zod
    const formData = CompanySchema.parse(rawData);

    // ❌ Remove `id` from the object passed to Prisma
    const { id, ...dataWithoutId } = formData;

    // 🔍 2. Find existing company (singleton)
    const existingCompany = await db.company.findFirst();

    let company;

    if (existingCompany) {
      // ♻️ Update existing company
      company = await db.company.update({
        where: { id: existingCompany.id },
        data: dataWithoutId,
      });

      // 🚨 Optional cleanup (dev safety)
      await db.company.deleteMany({
        where: { id: { not: existingCompany.id } },
      });

    } else {
      // 🆕 Create new singleton company
      company = await db.company.create({
        data: dataWithoutId,
      });
    }

    return { success: true, company };

  } catch (error) {
    console.error('❌ Failed to save company:', error);

    return {
      success: false,
      message:
        error instanceof z.ZodError
          ? 'بيانات غير صالحة. يرجى مراجعة الحقول.'
          : 'حدث خطأ أثناء حفظ بيانات الشركة.',
      details: error instanceof z.ZodError ? error.flatten() : null,
    };
  }
}
