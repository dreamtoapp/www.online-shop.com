'use server';

import db from '@/lib/prisma';

import { verifyUserPurchase } from './rating';

/**
 * Get product details by slug
 */
export async function getProductBySlug(slug: string) {
  try {
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(slug);

    // First try with the decoded slug
    let product = await db.product.findUnique({
      where: { slug: decodedSlug },
      include: {
        supplier: true,
        reviews: true,
      },
    });

    // If not found, try with the original slug
    if (!product) {
      product = await db.product.findUnique({
        where: { slug },
        include: {
          supplier: true,
          reviews: true,
        },
      });
    }

    // If still not found, try to find similar products for debugging
    if (!product) {
      await db.product.findMany({
        where: {
          OR: [
            { slug: { contains: decodedSlug.split('-')[0] } },
            { name: { contains: decodedSlug.split('-')[0] } },
          ],
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
        take: 5,
      });
    }

    // Add the derived inStock field if product is found
    return product ? { ...product, inStock: !product.outOfStock } : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

/**
 * Check if the current user has purchased this product
 */
export async function checkUserPurchase(productId: string) {
  try {
    const hasPurchased = await verifyUserPurchase(productId);
    return { hasPurchased };
  } catch (error) {
    console.error('Error checking purchase:', error);
    return { hasPurchased: false };
  }
}
