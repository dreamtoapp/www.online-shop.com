'use client';

import { Icon } from '@/components/icons/Icon';
import clsx from 'clsx';
import { useNotificationStore } from '@/components/ui/notificationStore';

interface NotificationBellProps {
    showNumber?: boolean;
    label?: string;
    className?: string;
}

export default function NotificationBell({ showNumber = false, label, className }: NotificationBellProps) {
    const count = useNotificationStore(state => state.unreadCount);
    const hasAlert = count > 0;
    return (
        <div className={clsx('relative cursor-pointer group flex items-center justify-center w-12 h-12 rounded-full bg-feature-analytics/10 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-feature-analytics/20', className)}>
            <Icon
                name="FaBell"
                size="md"
                variant="info"
                className="h-6 w-6 scale-90 text-feature-analytics icon-enhanced group-hover:scale-100 transition-transform drop-shadow-[0_2px_8px_rgba(80,120,255,0.45)]"
            />
            {label && <span className="ml-1 text-[10px] text-pink-400">{label}</span>}
            {hasAlert && showNumber && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-feature-analytics text-white text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-gray-900 border-2 border-feature-analytics animate-in fade-in zoom-in">
                    {count}
                </span>
            )}
        </div>
    );
} 