'use client';
import { NotificationDropdown } from '@/app/(e-comm)/homepage/component/Header/NotificationDropdown';
import NotificationBell from '@/components/ui/NotificationBell';
import { UserRole } from '@/constant/enums';
import Logo from './Logo';
import UserMenuTrigger from './UserMenuTrigger';
import CartIconClient from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';

interface UserWithRole {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
    emailVerified?: Date | null;
}

type Alert = {
    id: string;
    type: 'warning' | 'destructive';
    title: string;
    description: string;
    href: string;
};

interface MobileHeaderProps {
    user: UserWithRole | null;
    logo: string;
    logoAlt: string;
    isLoggedIn: boolean;
    alerts: Alert[];
    unreadCount?: number;
}

const MobileHeader = ({
    user,
    logo,
    logoAlt,
    isLoggedIn,
    alerts,
    unreadCount,
}: MobileHeaderProps) => {

    return (
        <>
            <header data-dev-header="mobile" className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6 relative">
                {process.env.NODE_ENV !== 'production' && (
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 text-purple-50 text-[10px] px-2 py-0.5 rounded-t-md shadow-md select-none">
                        MOBILE HEADER
                    </span>
                )}
                {/* 1. UserMenu (left) */}
                <div className="flex items-center gap-2">
                    <UserMenuTrigger
                        user={user ? {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            role: user.role as UserRole,
                        } : null}
                        alerts={alerts}
                        isMobile={true}
                        aria-label="User account menu (mobile)"
                    />
                </div>
                {/* 2. Logo (center) */}
                <div className="flex-1 flex justify-center">
                    <Logo logo={logo} logoAlt={logoAlt} />
                </div>
                {/* 3. Notification bell, wishlist and Cart */}
                <div className="flex items-center gap-4">
                    {/* Notification bell */}
                    {isLoggedIn && (
                        <NotificationDropdown
                            userId={user?.id as string}
                            defaultAlerts={alerts || []}
                        >
                            <NotificationBell count={(unreadCount ?? 0) + (alerts?.length ?? 0)} showNumber />
                        </NotificationDropdown>
                    )}
                    {/* Cart icon shared component */}
                    <CartIconClient />
                </div>
            </header>
        </>
    );
};

export default MobileHeader; 