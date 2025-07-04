import db from '@/lib/prisma';
import { checkIsLogin } from '@/lib/check-is-login';

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  memberSince: string; // MM/YY
  wishlistCount: number;
  reviewsCount: number;
}

export async function getUserStats(): Promise<UserStats | null> {
  const user = await checkIsLogin();
  console.log('getUserStats: user', user);
  if (!user) {
    console.error('getUserStats: No user session found');
    return null;
  }

  try {
    const [orderAgg, wishlistCount, reviewsCount, userInfo] = await Promise.all([
      db.order.aggregate({
        where: { customerId: user.id },
        _count: { _all: true },
        _sum: { amount: true },
      }),
      db.wishlistItem.count({ where: { userId: user.id } }),
      db.review.count({ where: { userId: user.id } }),
      db.user.findUnique({ where: { id: user.id }, select: { createdAt: true } }),
    ]);
    console.log('getUserStats: orderAgg', orderAgg);
    console.log('getUserStats: wishlistCount', wishlistCount);
    console.log('getUserStats: reviewsCount', reviewsCount);
    console.log('getUserStats: userInfo', userInfo);

    // Format memberSince as MM/YY
    let memberSince = '';
    if (userInfo?.createdAt) {
      const date = new Date(userInfo.createdAt);
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yy = String(date.getFullYear()).slice(-2);
      memberSince = `${mm}/${yy}`;
    }

    const result = {
      totalOrders: orderAgg._count._all || 0,
      totalSpent: orderAgg._sum.amount || 0,
      // loyaltyPoints: userInfo?.loyaltyPoints ?? 0,
      memberSince,
      wishlistCount,
      reviewsCount,
    };
    console.log('getUserStats: result', result);
    return { ...result, loyaltyPoints: 0 };
  } catch (error) {
    console.error('getUserStats: Error fetching stats', error);
    return null;
  }
} 