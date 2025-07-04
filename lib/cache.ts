import { cache as reactCache } from 'react';
import { unstable_cache as nextCache } from 'next/cache';

// We're using generics now, so explicit 'any' is less of an issue here.
// The original eslint-disable might have been for the 'any' in the old Callback.
// Consider if it's still needed or can be refined.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback<Args extends unknown[], Return> = (...args: Args) => Promise<Return>;

export function cacheData<
  Args extends unknown[],
  Return,
  T extends Callback<Args, Return>
>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] },
) {
  return nextCache(reactCache(cb), keyParts, options);
}



// ------------------

// 'use server';

// import { cacheEntity } from '@/lib/cache';
// import db from '@/lib/prisma';
// import { revalidateTag } from 'next/cache';

// // ==========================================
// // PRODUCT ENTITY
// // ==========================================

// /**
//  * Fetch a product by ID
//  */
// export const fetchProductAction = cacheEntity<
//   [{ id: string; includeReviews?: boolean }],
//   any,
//   (params: { id: string; includeReviews?: boolean }) => Promise<any>
// >(
//   'product', // Entity type
//   async ({ id, includeReviews = false }) => {
//     try {
//       return await db.product.findUnique({
//         where: { id },
//         include: {
//           reviews: includeReviews ? { include: { user: true } } : false,
//           category: true
//         }
//       });
//     } catch (error) {
//       console.error(`Error fetching product ${id}:`, error);
//       throw new Error('Failed to fetch product');
//     }
//   },
//   {
//     // Dynamic tags by ID allows targeted invalidation
//     tags: (params) => ['products', `product-${params.id}`]
//   }
// );

// // ==========================================
// // SUPPLIER ENTITY
// // ==========================================

// /**
//  * Fetch a supplier by ID
//  */
// export const fetchSupplierAction = cacheEntity<
//   [{ id: string; includeProducts?: boolean }],
//   any,
//   (params: { id: string; includeProducts?: boolean }) => Promise<any>
// >(
//   'supplier', // Entity type
//   async ({ id, includeProducts = false }) => {
//     try {
//       return await db.supplier.findUnique({
//         where: { id },
//         include: {
//           products: includeProducts,
//           address: true
//         }
//       });
//     } catch (error) {
//       console.error(`Error fetching supplier ${id}:`, error);
//       throw new Error('Failed to fetch supplier');
//     }
//   },
//   {
//     tags: (params) => ['suppliers', `supplier-${params.id}`]
//   }
// );

// // ==========================================
// // CATEGORY ENTITY
// // ==========================================

// /**
//  * Fetch a category by ID or slug
//  */
// export const fetchCategoryAction = cacheEntity<
//   [{ id?: string; slug?: string; includeProducts?: boolean }],
//   any,
//   (params: { id?: string; slug?: string; includeProducts?: boolean }) => Promise<any>
// >(
//   'category', // Entity type
//   async ({ id, slug, includeProducts = false }) => {
//     if (!id && !slug) {
//       throw new Error('Either id or slug must be provided');
//     }

//     try {
//       // Build where clause based on available parameters
//       const where = id ? { id } : { slug };

//       return await db.category.findUnique({
//         where,
//         include: {
//           products: includeProducts ? {
//             take: 10, // Limit number of products
//             orderBy: { createdAt: 'desc' }
//           } : false,
//           parentCategory: true,
//           childCategories: true
//         }
//       });
//     } catch (error) {
//       console.error(`Error fetching category ${id || slug}:`, error);
//       throw new Error('Failed to fetch category');
//     }
//   },
//   {
//     tags: (params) => {
//       const tags = ['categories'];
//       if (params.id) tags.push(`category-${params.id}`);
//       if (params.slug) tags.push(`category-slug-${params.slug}`);
//       return tags;
//     }
//   }
// );

// // ==========================================
// // ORDER ENTITY
// // ==========================================

// /**
//  * Fetch an order by ID or number
//  */
// export const fetchOrderAction = cacheEntity<
//   [{ id?: string; orderNumber?: string; includeItems?: boolean }],
//   any,
//   (params: { id?: string; orderNumber?: string; includeItems?: boolean }) => Promise<any>
// >(
//   'order', // Entity type
//   async ({ id, orderNumber, includeItems = true }) => {
//     if (!id && !orderNumber) {
//       throw new Error('Either id or orderNumber must be provided');
//     }

//     try {
//       // Build where clause based on available parameters
//       const where = id ? { id } : { orderNumber };

//       return await db.order.findUnique({
//         where,
//         include: {
//           items: includeItems ? {
//             include: { product: true }
//           } : false,
//           customer: true,
//           driver: true,
//           shift: true
//         }
//       });
//     } catch (error) {
//       console.error(`Error fetching order ${id || orderNumber}:`, error);
//       throw new Error('Failed to fetch order');
//     }
//   },
//   {
//     tags: (params) => {
//       const tags = ['orders'];
//       if (params.id) tags.push(`order-${params.id}`);
//       if (params.orderNumber) tags.push(`order-number-${params.orderNumber}`);
//       return tags;
//     },
//     // Orders might need more frequent revalidation
//     revalidate: 60 * 15 // 15 minutes
//   }
// );

// // ==========================================
// // CACHE INVALIDATION HELPERS
// // ==========================================

// /**
//  * Invalidate specific entity cache
//  */
// export async function invalidateEntity(
//   entityType: 'product' | 'supplier' | 'category' | 'order',
//   id?: string
// ) {
//   // Always invalidate the entity type collection
//   revalidateTag(`${entityType}s`);

//   // If ID is provided, invalidate specific entity
//   if (id) {
//     revalidateTag(`${entityType}-${id}`);
//   }
// }

// /**
//  * Example usage in a Server Action:
//  * 
//  * export async function updateProductAction(formData: FormData) {
//  *   const id = formData.get('id') as string;
//  *   
//  *   // Update product in database
//  *   await db.product.update({
//  *     where: { id },
//  *     data: {
//  *       // form data
//  *     }
//  *   });
//  *   
//  *   // Invalidate cache
//  *   await invalidateEntity('product', id);
//  * }
//  */

