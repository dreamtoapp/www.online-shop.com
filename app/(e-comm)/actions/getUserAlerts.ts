"use server";

import db from '@/lib/prisma';

// -----------------------------------------------------------------------------
// getUserAlerts
// -----------------------------------------------------------------------------
// Returns the latest alerts / notifications for the given user. This is called
// from client components via the Next.js Server-Actions bridge (no REST route
// required). The query is intentionally limited to keep payloads small.
// -----------------------------------------------------------------------------

export interface UserAlert {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string | null;
}

/**
 * Fetches the most recent alerts for a user.
 *
 * @param userId  MongoDB/UUID string of the user               (required)
 * @param limit   Max number of records to return (default 20)  (optional)
 */
export async function getUserAlerts(userId: string, limit = 20): Promise<UserAlert[]> {
  if (!userId) return [];

  // NOTE: adjust the model name if your Prisma schema differs
  const alerts = await db.userNotification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      body: true,
      type: true,
      read: true,
      createdAt: true,
      actionUrl: true,
    },
  });

  return alerts as UserAlert[];
} 