'use server';
import { revalidatePath } from 'next/cache';

import { ORDER_STATUS } from '@/constant/order-status';
import db from '@/lib/prisma';

export const approveDriverToOrder = async (orderId: string, driverId: string) => {
  // Check if the order exists
  const existingOrder = await db.order.findUnique({
    where: { orderNumber: orderId },
    select: { driverId: true, id: true },
  });

  if (existingOrder?.driverId) {
    return { success: false, message: 'الطلبية تحت مسئولية سائق اخر' }; //
  }

  await db.order.update({
    where: { id: existingOrder?.id },
    data: {
      driverId: driverId,
      status: ORDER_STATUS.IN_TRANSIT,
    },
  });

  revalidatePath('/dashboard');
  return { success: true, message: 'تم اسناد العملية بنجاح' }; // Return success response with updated data
};
