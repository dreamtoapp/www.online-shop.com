'use server';
import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';

// Helper function to fetch active offers (replacing promotions)
async function fetchOffers() {
  try {
    const offers = await db.offer.findMany({
      where: {
        isActive: true,
      },
      include: {
        productAssignments: {
          include: {
            product: true,
          },
        },
      },
    });

    // Process offers to ensure valid image URLs
    return offers.map((offer) => {
      const fallbackImage = '/fallback/fallback.avif';

      // Check if the image URL exists and is valid
      const hasValidImageUrl =
        offer.bannerImage &&
        typeof offer.bannerImage === 'string' &&
        (offer.bannerImage.startsWith('/') || // Local images
          offer.bannerImage.startsWith('http')); // Remote images

      return {
        ...offer,
        // Always return a string for imageUrl (map bannerImage to imageUrl for compatibility)
        imageUrl: hasValidImageUrl ? offer.bannerImage : fallbackImage,
      };
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw new Error('Failed to fetch offers');
  }
}

export const getPromotions = cacheData(
  fetchOffers,
  ['getOffers'], // Cache key
  { revalidate: 3600 }, // Revalidate every hour
);
