"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CartBadgeProps {
    count: number;
    className?: string;
}

export default function CartBadge({ count, className }: CartBadgeProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            router.push("/cart");
        });
    };

    return (
        <button
            onClick={handleClick}
            aria-label="سلة التسوق"
            className={clsx(
                "relative flex items-center justify-center rounded-full bg-feature-commerce-soft card-hover-effect transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-feature-commerce/70 shadow-lg w-12 h-12",
                className
            )}
        >
            <span className="absolute inset-0 rounded-full bg-feature-commerce/30 blur-md opacity-70 pointer-events-none animate-pulse" />
            <ShoppingCart className="relative z-10 h-7 w-7 text-feature-commerce-bright icon-enhanced drop-shadow-[0_2px_8px_rgba(80,120,255,0.45)] transition-transform duration-200 group-hover:scale-110" />
            <AnimatePresence>
                {count > 0 && (
                    <motion.span
                        key={count}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-feature-commerce text-white text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-gray-900 border-2 border-feature-commerce animate-in fade-in zoom-in"
                        aria-live="polite"
                    >
                        {count}
                    </motion.span>
                )}
            </AnimatePresence>
            {isPending && <span className="ml-2 animate-bounce text-xs">…</span>}
        </button>
    );
} 