import { Icon } from '@/components/icons/Icon';
import clsx from 'clsx';

interface NotificationBellProps {
    /** total number of alerts to display; 0 hides the badge */
    count?: number;
    /** show numeric badge instead of pulsing dot */
    showNumber?: boolean;
    /** small debug label next to the bell */
    label?: string;
    className?: string;
}

/**
 * Reusable bell icon with badge used as trigger for NotificationDropdown.
 * - When showNumber=true it renders a red circle with the count number.
 * - Otherwise renders the project-wide pulsing dot indicator.
 */
export default function NotificationBell({ count = 0, showNumber = false, label, className }: NotificationBellProps) {
    const hasAlert = count > 0;
    return (
        <div className={clsx('relative cursor-pointer group', className)}>
            <Icon name="Bell" size="md" className="h-6 w-6 text-feature-analytics icon-enhanced group-hover:scale-110 transition-transform" />
            {label && <span className="ml-1 text-[10px] text-pink-400">{label}</span>}
            {hasAlert && (
                showNumber ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] leading-none text-white shadow z-10">
                        {count}
                    </span>
                ) : (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                    </span>
                )
            )}
        </div>
    );
} 