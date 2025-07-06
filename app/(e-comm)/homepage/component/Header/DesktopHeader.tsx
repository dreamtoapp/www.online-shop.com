// import NavLinks from './NavLinks'; 
// Header.tsx (Server Component)
import Logo from './Logo';
import SearchBar from './SearchBar';
import UserMenuTrigger from './UserMenuTrigger';
import { NotificationDropdown } from '@/app/(e-comm)/homepage/component/Header/NotificationDropdown';
import NotificationBell from '@/components/ui/NotificationBell';
import CartIconClient from '../../../(cart-flow)/cart/cart-controller/CartButtonWithBadge';
import WishlistIconClient from './WishlistIconClient';

interface HeaderProps {
  logo: string;
  logoAlt: string;
  user: any;
  userId?: string;
  unreadCount?: number;
  defaultAlerts?: any[];
}

// Lazy load the debug ClearCartButton only in development
// const ClearCartButton = process.env.NODE_ENV !== 'production'
//   ? dynamic(() => import('./ClearCartButton'))
//   : () => null;

export default function Header({ user, logo, logoAlt, userId, unreadCount = 0, defaultAlerts = [] }: HeaderProps) {
  const totalCount = (unreadCount ?? 0) + (defaultAlerts?.length ?? 0);

  return (
    <header data-dev-header="desktop" className='sticky top-0 z-50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/90 border-b border-border/50 shadow-lg shadow-black/5 dark:shadow-black/20 relative'>
      {process.env.NODE_ENV !== 'production' && (
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 text-orange-50 text-[10px] px-2 py-0.5 rounded-t-md shadow-md select-none">
          DESKTOP HEADER
        </span>
      )}
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />

      {/* Main Header Bar */}
      <div className='relative'>
        <nav
          className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'
          aria-label='Main header'
        >
          {/* Logo with enhanced styling */}
          <div className='flex flex-shrink-0 items-center ml-2 md:ml-0 group'>
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-colors duration-300">
              <Logo logo={logo} logoAlt={logoAlt} />
            </div>
          </div>

          {/* Search Bar - enhanced with better container */}
          <div className='flex flex-1 items-center justify-center px-2 md:px-6'>
            <div className='w-full max-w-xl relative'>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <SearchBar />
            </div>
          </div>

          {/* Actions: Wishlist, Cart, Notification bell, user menu */}
          <div className='flex items-center gap-4 md:gap-6'>
            {/* Wishlist icon */}
            <WishlistIconClient />

            {/* Cart icon */}
            <CartIconClient />

            {/* TEMP: Clear cart button (dev only) */}
            {/* {process.env.NODE_ENV !== 'production' && <ClearCartButton />} */}

            {/* Notification bell */}
            {userId && (
              <NotificationDropdown
                userId={userId}
                defaultAlerts={defaultAlerts}
              >
                <NotificationBell count={totalCount} showNumber />
              </NotificationDropdown>
            )}

            {/* User menu */}
            <div className="relative">
              <UserMenuTrigger user={user} />
              <div className="absolute inset-0 bg-feature-users/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-sm" />
            </div>
          </div>
        </nav>
      </div>


      {/* Subtle bottom border with gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
