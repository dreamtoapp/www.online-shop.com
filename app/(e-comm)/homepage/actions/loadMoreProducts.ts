'use server';

import db from '@/lib/prisma';
import { Product } from '@/types/databaseTypes';;
import { Prisma } from '@prisma/client'; // Import Prisma

// Simple server action to load more products
export async function loadMoreProducts(slug: string, page: number): Promise<Product[]> {
  // Calculate how many to skip based on page number
  const skip = page * 8;

  try {
    // Find supplier if slug is provided
    const whereClause: Prisma.ProductWhereInput = { published: true }; // Use const

    if (slug && slug.trim() !== '') {
      const supplier = await db.supplier.findFirst({
        where: { slug },
        select: { id: true },
      });

      if (supplier) {
        whereClause.supplierId = supplier.id;
      }
    }

    // Fetch next page of products
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: 8,
      include: { supplier: true },
      orderBy: { createdAt: 'desc' },
    });

    // Add default image if needed and derive inStock
    return products.map((product) => {
      return {
        ...product,
        details: product.details ?? null,
        size: product.size ?? null,
        rating: product.rating === null ? null : product.rating,
        imageUrl: product.imageUrl ?? '/fallback/fallback.avif',
      };
    });
  } catch (error) {
    console.error('Error loading more products:', error);
    return [];
  }
}
