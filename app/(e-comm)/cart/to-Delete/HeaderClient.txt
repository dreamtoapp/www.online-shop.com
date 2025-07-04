// HeaderClient.tsx
'use client';

import {
  useEffect,
  useState
} from 'react';
import { usePathname } from 'next/navigation';
import BackButton from './BackButton';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useMediaQuery } from '@/hooks/use-media-query';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { Bell } from 'lucide-react';
import { getUnreadNotificationCount } from '@/app/(e-comm)/user/notifications/actions/getUnreadNotificationCount';
import { getUserNotifications } from '@/app/(e-comm)/user/notifications/actions/getUserNotifications';
import UserMenu from './UserMenu';


const CartIcon = dynamic(() => import('./CartIcon'), {
  ssr: false,
  loading: () => <Skeleton className='h-9 w-9 rounded-full' />,
});

interface HeaderClientProps {
  user: any;
  menuSheetContent: React.ReactNode;
}

export default function HeaderClient({ user, menuSheetContent }: HeaderClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [dbNotifications, setDbNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch unread notification count for the logged-in user (poll every 30s)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchUnreadCount() {
      if (user?.id) {
        try {
          const count = await getUnreadNotificationCount(user.id);
          setUnreadCount(count ?? 0);
        } catch (e) {
          setUnreadCount(0);
        }
      } else {
        setUnreadCount(0);
      }
    }
    fetchUnreadCount();
    interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Fetch notifications from DB for the logged-in user (poll every 30s)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchNotifications() {
      if (user?.id) {
        try {
          const notifications = await getUserNotifications(user.id);
          setDbNotifications(Array.isArray(notifications) ? notifications : []);
        } catch (e) {
          setDbNotifications([]);
        }
      } else {
        setDbNotifications([]);
      }
    }
    fetchNotifications();
    interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Default notifications (only show if no DB notifications)
  const defaultAlerts = [
    {
      id: 'default-profile',
      type: 'warning',
      title: 'أكمل ملفك الشخصي',
      description: 'الرجاء إضافة عنوانك لتسهيل عملية التوصيل.',
      href: '/user/profile',
    },
    {
      id: 'default-activate',
      type: 'destructive',
      title: 'تفعيل الحساب',
      description: 'الرجاء تفعيل حسابك للاستفادة من جميع الميزات.',
      href: '/user/activate',
    },
  ];

  // Map DB notifications to alert format if needed
  const dbAlerts = dbNotifications.map((n) => ({
    id: n.id,
    type: n.type || 'warning',
    title: n.title,
    description: n.body,
    href: n.href || '#',
  }));

  // Show defaults at the top, then DB notifications
  const alertsToShow = [...defaultAlerts, ...dbAlerts];

  if (!isMounted) return null;

  // Only show BackButton on sub-routes, not on homepage
  const isHomepage = pathname === '/';
  const showBackButton = !isHomepage;

  return (
    <div className='flex items-center gap-4 md:gap-6'>
      {isMobile ? (
        <UserMenu user={user}>
          {menuSheetContent}
        </UserMenu>
      ) : (
        <>
          {showBackButton && (
            <span>
              <BackButton />
            </span>
          )}
          {/* Notification Bell for logged-in users */}
          {user && (
            <NotificationDropdown alerts={alertsToShow || []}>
              <Button variant="ghost" size="icon" className="relative p-2">
                <Bell className="h-5 w-5 text-feature-analytics" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center z-10">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </NotificationDropdown>
          )}
          <CartIcon />
          {/* Main login button for guests */}
          {!user && (
            <Button asChild className="btn-professional">
              <Link href="/auth/login">تسجيل الدخول</Link>
            </Button>
          )}
          {/* UserMenu: shows welcome/register for guests, bell for logged in */}
          <UserMenu user={user}>
            {menuSheetContent}
          </UserMenu>
        </>
      )}
    </div>
  );
}
