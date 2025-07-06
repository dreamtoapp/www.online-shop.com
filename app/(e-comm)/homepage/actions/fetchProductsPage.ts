'use server';

import db from '@/lib/prisma';
import { Product } from '@/types/databaseTypes';;
import { Prisma } from '@prisma/client';

/**
 * Optimized server action to fetch a page of products with pagination
 *
 * @param slug - Category slug to filter products (optional)
 * @param page - Page number (starting from 1)
 * @param pageSize - Number of items per page
 * @returns Object containing products array and hasMore flag
 */
export async function fetchProductsPage(
  slug: string = '',
  page: number = 1,
  pageSize: number = 8,
): Promise<{ products: Product[]; hasMore: boolean }> {
  try {
    // Validate inputs
    if (page < 1) page = 1;
    if (pageSize < 1 || pageSize > 50) pageSize = 8; // Limit page size for performance

    // Calculate how many items to skip
    const skip = (page - 1) * pageSize;

    // Build optimized where clause
    const whereClause: Prisma.ProductWhereInput = { 
      published: true,
      // Only fetch products with valid images to reduce load
      imageUrl: { not: null }
    };

    // Add supplier filter if slug provided
    if (slug && slug.trim() !== '') {
      const supplier = await db.supplier.findFirst({
        where: { slug },
        select: { id: true },
      });

      if (supplier) {
        whereClause.supplierId = supplier.id;
      }
    }

    // Optimized query with reduced includes for better performance
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: pageSize + 1, // Request one extra to check if there are more
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        costPrice: true,
        details: true,
        size: true,
        published: true,
        outOfStock: true,
        imageUrl: true,
        images: true,
        type: true,
        stockQuantity: true,
        manageInventory: true,
        productCode: true,
        gtin: true,
        brand: true,
        material: true,
        color: true,
        dimensions: true,
        weight: true,
        features: true,
        requiresShipping: true,
        shippingDays: true,
        returnPeriodDays: true,
        hasQualityGuarantee: true,
        careInstructions: true,
        tags: true,
        rating: true,
        reviewCount: true,
        supplierId: true,
        // Simplified supplier data for better performance
        supplier: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        previewCount: true,
      },
      orderBy: [
        { outOfStock: 'asc' }, // Show in-stock items first
        { createdAt: 'desc' }
      ],
    });

    // Check if there are more products
    const hasMore = products.length > pageSize;

    // Remove the extra item before returning
    const paginatedProducts = hasMore ? products.slice(0, pageSize) : products;

    return {
      products: paginatedProducts as Product[],
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching products page:', error);
    
    // Return empty result instead of throwing to prevent UI crashes
    return { 
      products: [], 
      hasMore: false 
    };
  }
}
