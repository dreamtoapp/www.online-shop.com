import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AddressBook from "./components/AddressBook";
import UserInfoCard from "./components/UserInfoCard";
import MiniCartSummary from "./components/MiniCartSummary";
import ShiftSelectorWrapper from "./components/ShiftSelectorWrapper";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import TermsDialog from "./components/TermsDialog";
import PlaceOrderButton from "./components/PlaceOrderButton";
import BackButton from "@/components/BackButton";
import { getUser } from "./actions/getUser";
import { getCart } from "./actions/getCart";
import { getAddresses } from "./actions/getAddresses";

export default async function CheckoutPage() {
  // Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?redirect=/checkout");
  }

  // Single parallel data fetch - NO MORE DUPLICATES
  const [user, cart, addresses] = await Promise.all([
    getUser(session.user.id),
    getCart(session.user.id),
    getAddresses(session.user.id)
  ]);

  // Improved business validation with better UX
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart?message=empty");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first responsive layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Enhanced Back Button */}
        <BackButton variant="gradient" className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main checkout form - mobile first */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pass data as props - no more API calls */}
            {user && <UserInfoCard user={user} />}
            <AddressBook addresses={addresses} />
            <ShiftSelectorWrapper />
            <PaymentMethodSelector />
            <TermsDialog />
            <PlaceOrderButton
              cart={cart}
              defaultAddress={addresses.find(addr => addr.isDefault) || addresses[0]}
            />
          </div>

          {/* Sidebar - sticky on desktop, inline on mobile */}
          <div className="space-y-6">
            <MiniCartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
