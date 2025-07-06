import Fotter from './homepage/component/Fotter/Fotter';
import Header from './homepage/component/Header/DesktopHeader';
import MobileBottomNav from './homepage/component/Header/MobileBottomNav';
import MobileHeader from './homepage/component/Header/MobileHeader';
// app/(ecommerce)/layout.tsx
import { WishlistProvider } from '@/providers/wishlist-provider';
import { fetchEcommLayoutData } from './helpers/layoutData';

// Server component: fetch all layout data via helper
export default async function EcommerceLayout({ children }: { children: React.ReactNode }) {
  try {
    // Use helper to fetch and prepare all layout data
    const {
      companyData,
      session,
      user,
      userSummary,
      notificationCount,
      wishlistIds,
      alerts,
      fullUser,
    } = await fetchEcommLayoutData();

    return (
      <WishlistProvider initialIds={wishlistIds}>
        <div className="flex flex-col min-h-screen">
          {/* Desktop Header */}
          <div className="hidden md:block">
            <Header
              user={userSummary}
              userId={user?.id}
              unreadCount={notificationCount}
              defaultAlerts={alerts}
              logo={companyData?.logo || ''}
              logoAlt={companyData?.fullName || 'Dream to app'}
            />
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <MobileHeader
              user={userSummary}
              logo={companyData?.logo || ''}
              logoAlt={companyData?.fullName || 'Dream to app'}
              isLoggedIn={!!session}
              alerts={alerts}
              unreadCount={notificationCount}
            />
          </div>
          <MobileBottomNav
            isLoggedIn={!!session}
            userImage={fullUser?.image}
            userName={fullUser?.name}
            whatsappNumber={companyData?.whatsappNumber}
            userId={user?.id}
          />

          {/* Mobile-First Main Content */}
          <main className='flex-grow'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
              {children}
            </div>
          </main>
          <Fotter
            companyName={companyData?.fullName}
            aboutus={companyData?.bio}
            email={companyData?.email}
            phone={companyData?.phoneNumber}
            address={companyData?.address}
            facebook={companyData?.facebook}
            instagram={companyData?.instagram}
            twitter={companyData?.twitter}
            linkedin={companyData?.linkedin}
          />
        </div>
      </WishlistProvider>
    );
  } catch (e) {
    // Show fallback UI on error
    return <div>حدث خطأ أثناء تحميل الصفحة. الرجاء المحاولة لاحقًا.</div>;
  }
}
