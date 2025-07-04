"use client";
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CartPreview from './CartPreview';
import { useState, useEffect, useTransition } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { motion, AnimatePresence } from "framer-motion";

import type { CartWithItems } from '@/app/(e-comm)/cart/actions/cartServerActions';
import { getCart } from '@/app/(e-comm)/cart/actions/cartServerActions';

export default function CartIconClient() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cart, setCart] = useState<CartWithItems | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();

    const fetchCart = () => {
        startTransition(async () => {
            try {
                const cartData = await getCart();
                setCart(cartData);
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        });
    };

    useEffect(() => {
        setMounted(true);
        fetchCart();

        const handleCartChanged = () => fetchCart();
        window.addEventListener('cart-changed', handleCartChanged);
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'cart-updated') {
                handleCartChanged();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('cart-changed', handleCartChanged);
            window.removeEventListener('storage', handleStorage);
        };
    }, []);

    // Refresh cart when popover/sheet opens
    useEffect(() => {
        if (isOpen) {
            fetchCart();
        }
    }, [isOpen]);

    // Show number of unique items (not total quantity)
    const cartCount = cart?.items?.length ?? 0;

    // Close popover/sheet when navigating away
    const handleClose = () => setIsOpen(false);

    // The CartIcon UI remains mostly the same
    const cartIcon = (
        <Button
            aria-label="عرض السلة"
            variant="ghost"
            className="relative flex items-center justify-center gap-2 rounded-full bg-feature-commerce-soft card-hover-effect transition-all duration-300 hover:scale-105 hover:bg-feature-commerce/20 w-12 h-12 shadow-lg"
            disabled={isPending}
        >
            <span className="absolute inset-0 rounded-full bg-feature-commerce/30 blur-md opacity-70 pointer-events-none animate-pulse" />
            <ShoppingCart
                className="relative z-10 h-7 w-7 text-feature-commerce-bright icon-enhanced drop-shadow-[0_2px_8px_rgba(80,120,255,0.45)] transition-transform duration-200 group-hover:scale-110"
                aria-label="عرض السلة"
            />
            <AnimatePresence>
                {mounted && cartCount > 0 && (
                    <motion.span
                        key={cartCount}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1.1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-feature-commerce text-white text-[10px] font-bold shadow-lg ring-2 ring-white dark:ring-gray-900 border-2 border-feature-commerce animate-in fade-in zoom-in"
                        aria-live="polite"
                    >
                        {cartCount}
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );

    // Mobile version - bottom sheet
    if (isMobile) {
        return (
            <div className="relative">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        {cartIcon}
                    </SheetTrigger>

                    <SheetContent side="bottom" className="h-[85vh] rounded-t-xl p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle>
                                <span className="text-lg font-semibold text-primary">عربة التسوق</span>
                            </SheetTitle>
                        </SheetHeader>
                        <CartPreview cart={cart} closePopover={handleClose} hideHeader />
                    </SheetContent>
                </Sheet>
            </div>
        );
    }

    // Desktop version - popover dropdown
    return (
        <div className="relative">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    {cartIcon}
                </PopoverTrigger>

                <PopoverContent
                    className="w-80 p-2 shadow-lg rounded-xl"
                    align="end"
                    sideOffset={10}
                >
                    <CartPreview cart={cart} closePopover={handleClose} />
                </PopoverContent>
            </Popover>
        </div>
    );
} 