'use server';

import { revalidatePath } from 'next/cache';
import db from '@/lib/prisma';

export async function toggleOfferStatus(offerId: string) {
  try {
    // First get the current status
    const offer = await db.offer.findUnique({
      where: { id: offerId },
      select: { isActive: true }
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Toggle the status
    await db.offer.update({
      where: { id: offerId },
      data: {
        isActive: !offer.isActive,
      },
    });

    // Revalidate relevant paths
    revalidatePath('/dashboard/management-offer');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error toggling offer status:', error);
    throw new Error('Failed to toggle offer status.');
  }
} 