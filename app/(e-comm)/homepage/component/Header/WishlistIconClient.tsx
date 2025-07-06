"use client";
import { useContext } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WishlistContext } from "@/providers/wishlist-provider";
import { iconVariants } from "@/lib/utils";

export default function WishlistIconClient() {
    const ctx = useContext(WishlistContext);
    const count = ctx ? ctx.wishlistIds.size : 0;

    return (
        <Link href="/user/wishlist" aria-label="عرض المفضلة" prefetch={false}>
            <Button
                variant="ghost"
                className="relative flex items-center gap-2 rounded-lg bg-feature-users/10 px-3 py-2 transition-all duration-300 hover:scale-105 hover:bg-feature-users/20"
            >
                <Heart
                    className={iconVariants({ size: "sm", variant: "secondary" }) + " text-feature-users"}
                    aria-label="المفضلة"
                />
                {count > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-feature-users text-xs font-semibold text-white shadow-md">
                        {count > 99 ? "99+" : count}
                    </span>
                )}
            </Button>
        </Link>
    );
} 