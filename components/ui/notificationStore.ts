import { create } from 'zustand';
import React from 'react';
export interface NotificationItem {
  id: number;
  content: React.ReactNode;
  persistent?: boolean;
}
interface NotificationStore {
  notifications: NotificationItem[];
  add: (content: React.ReactNode, opts?: { persistent?: boolean; id?: number }) => void;
  remove: (id?: number) => void;
}
export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  add: (content: React.ReactNode, opts: { persistent?: boolean; id?: number } = {}) => set((s: NotificationStore) => ({ notifications: [...s.notifications, { id: opts.id ?? (Date.now() + Math.random()), content, ...opts }] })),
  remove: (id?: number) => set((s: NotificationStore) => ({ notifications: id ? s.notifications.filter((n: NotificationItem) => n.id !== id) : s.notifications.slice(1) })),
})); 