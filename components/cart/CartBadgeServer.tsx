import { getCartCount } from "@/app/(e-comm)/cart/actions/cartServerActions";
import CartBadge from "./CartBadge";

export default async function CartBadgeServer({ className }: { className?: string }) {
    const count = await getCartCount();
    return <CartBadge count={count} className={className} />;
} 