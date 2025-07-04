'use server';

import db from '@/lib/prisma';
import { Product } from '@/types/databaseTypes';;
import { Prisma } from '@prisma/client'; // Import Prisma

/**
 * Server action to fetch additional products for infinite scrolling
 * This is called from the client component when more products need to be loaded
 */
export async function fetchMoreProducts(slug: string, page: number): Promise<Product[]> {
  const pageSize = 8;
  const skip = page * pageSize;

  try {
    // Find supplier if slug is provided
    const whereClause: Prisma.ProductWhereInput = { published: true }; // Use const as it's not reassigned

    if (slug && slug.trim() !== '') {
      const supplier = await db.supplier.findFirst({
        where: { slug },
        select: { id: true },
      });

      if (supplier) {
        whereClause.supplierId = supplier.id;
      }
    }

    // Fetch paginated products with a smaller page size to avoid cache issues
    const products = await db.product.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      select: { // Select all fields needed for Product type
        id: true,
        name: true,
        slug: true,
        price: true,
        details: true,
        size: true,
        published: true,
        outOfStock: true,
        imageUrl: true,
        images: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
        updatedAt: true,
        supplierId: true,
        brand: true, // Select the brand property
        description: true,
        compareAtPrice: true,
        costPrice: true,
        productCode: true,
        gtin: true,
        material: true,
        color: true,
        dimensions: true,
        weight: true,
        features: true,
        type: true,
        requiresShipping: true,
        shippingDays: true,
        returnPeriodDays: true,
        hasQualityGuarantee: true,
        careInstructions: true,
        manageInventory: true,
        stockQuantity: true,
        wishlistedBy: true,
        orderItems: true,
        categoryAssignments: true,
        tags: true,
        translations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add default image if needed, ensure price is a valid number
    return products.map((product) => {
      // Always provide a valid string for imageUrl
      const fallbackImage = '/fallback/fallback.avif';

      // Check if the image URL exists and is valid
      const hasValidImageUrl =
        product.imageUrl !== null &&
        product.imageUrl &&
        typeof product.imageUrl === 'string' &&
        (product.imageUrl.startsWith('/') || // Local images
          product.imageUrl.startsWith('http')); // Remote images

      // Create a product object that matches the Product type
      const processedProduct: Product = {
        id: product.id,
        name: product.name,
        description: product.description,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        costPrice: product.costPrice,
        size: product.size,
        details: product.details,
        published: product.published,
        outOfStock: product.outOfStock,
        imageUrl: hasValidImageUrl ? product.imageUrl ?? null : fallbackImage,
        images: product.images,
        rating: product.rating,
        reviewCount: product.reviewCount,
        brand: product.brand,
        productCode: product.productCode,
        gtin: product.gtin,
        material: product.material,
        color: product.color,
        dimensions: product.dimensions,
        weight: product.weight,
        features: product.features,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        supplierId: product.supplierId,
        type: product.type,
        requiresShipping: product.requiresShipping,
        shippingDays: product.shippingDays,
        returnPeriodDays: product.returnPeriodDays,
        hasQualityGuarantee: product.hasQualityGuarantee,
        careInstructions: product.careInstructions,
        manageInventory: product.manageInventory,
        stockQuantity: product.stockQuantity,
        // wishlistedBy: product.wishlistedBy,
        // orderItems: product.orderItems,
        // categoryAssignments: product.categoryAssignments,
        tags: product.tags,
        // translations: product.translations,
      };
      return processedProduct;
    });
  } catch (error) {
    console.error('Error fetching more products:', error);
    return [];
  }
}
