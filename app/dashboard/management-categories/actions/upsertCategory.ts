'use server';

import db from '@/lib/prisma';

import {
  CategoryFormData,
  CategorySchema,
} from '../helper/categoryZodAndInputs';

// -------------------- ✅ Type-safe validation --------------------
type ValidationResult =
  | { ok: false; msg: string; errors: Record<string, string[]> }
  | { ok: true; data: CategoryFormData };

function validateFormData(formData: CategoryFormData): ValidationResult {
  const parsed = CategorySchema.safeParse(formData);

  if (!parsed.success) {
    return {
      ok: false,
      msg: 'يرجى تصحيح الأخطاء في النموذج',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    ok: true,
    data: parsed.data,
  };
}

// -------------------- ✅ Slug uniqueness check --------------------
async function isDuplicateSlug(slug: string, id?: string) {
  const existingCategory = await db.category.findFirst({
    where: {
      slug,
      ...(id ? { NOT: { id } } : {}),
    },
  });

  return !!existingCategory;
}

// -------------------- ✅ Create category --------------------
async function createCategory(data: CategoryFormData) {
  const duplicate = await isDuplicateSlug(data.slug);
  if (duplicate) {
    return {
      ok: false,
      msg: 'المعرف (slug) مستخدم مسبقًا',
      errors: {
        slug: ['المعرف (slug) مستخدم مسبقًا'],
      },
    };
  }

  await db.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  });

  return {
    ok: true,
    msg: 'تم إضافة التصنيف بنجاح',
  };
}

// -------------------- ✅ Update category --------------------
async function updateCategory(data: CategoryFormData) {
  const category = await db.category.findUnique({
    where: { id: data.id },
  });

  if (!category) {
    return {
      ok: false,
      msg: 'التصنيف غير موجود',
      errors: { slug: ['لا يمكن العثور على التصنيف المحدد'] },
    };
  }

  const duplicate = await isDuplicateSlug(data.slug, data.id);
  if (duplicate) {
    return {
      ok: false,
      msg: 'المعرف (slug) مستخدم مسبقًا',
      errors: {
        slug: ['المعرف (slug) مستخدم مسبقًا'],
      },
    };
  }

  await db.category.update({
    where: { id: data.id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
    },
  });

  return {
    ok: true,
    msg: 'تم تعديل بيانات التصنيف بنجاح',
  };
}

// -------------------- ✅ Main action --------------------
export async function upsertCategory(
  formData: CategoryFormData,
  mode: 'new' | 'update'
) {
  try {
    const validation = validateFormData(formData);
    if (!validation.ok) return validation;

    const data = validation.data;

    if (mode === 'new') {
      return await createCategory(data);
    }

    if (mode === 'update') {
      return await updateCategory(data);
    }

    return {
      ok: false,
      msg: 'وضع غير مدعوم',
      errors: {},
    };
  } catch (error) {
    console.error('upsertCategory error:', error);
    return {
      ok: false,
      msg: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
      errors: {},
    };
  }
}
