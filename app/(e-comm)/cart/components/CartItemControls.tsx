"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { useState, useTransition, useOptimistic } from "react";
import { updateItemQuantity, removeItem } from "@/app/(e-comm)/cart/actions/cartServerActions";
import { toast } from "sonner";

interface CartItemControlsProps {
    itemId: string;
    currentQuantity: number;
    productName: string;
}

export default function CartItemControls({
    itemId,
    currentQuantity,
    productName
}: CartItemControlsProps) {
    const [isPending, startTransition] = useTransition();
    const [isRemoving, setIsRemoving] = useState(false);

    // Optimistic updates for better UX
    const [optimisticQuantity, updateOptimisticQuantity] = useOptimistic(
        currentQuantity,
        (_: number, newQuantity: number) => newQuantity
    );

    const handleQuantityUpdate = (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > 99) return;

        // Optimistic update
        updateOptimisticQuantity(newQuantity);

        startTransition(async () => {
            try {
                await updateItemQuantity(itemId, newQuantity);
                toast.success(`تم تحديث كمية ${productName}`, {
                    duration: 2000,
                });
            } catch (error) {
                // Revert optimistic update on error
                updateOptimisticQuantity(currentQuantity);
                toast.error("فشل في تحديث الكمية، حاول مرة أخرى");
            }
        });
    };

    const handleRemove = () => {
        setIsRemoving(true);
        startTransition(async () => {
            try {
                await removeItem(itemId);
                toast.success(`تم حذف ${productName} من السلة`, {
                    duration: 3000,
                    action: {
                        label: "تراجع",
                        onClick: () => {
                            toast.info("ميزة التراجع قريباً");
                        },
                    },
                });
            } catch (error) {
                setIsRemoving(false);
                toast.error("فشل في حذف المنتج، حاول مرة أخرى");
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(e.target.value) || 1;
        if (newQuantity >= 1 && newQuantity <= 99) {
            handleQuantityUpdate(newQuantity);
        }
    };

    // Show loading state during removal
    if (isRemoving) {
        return (
            <div className="flex items-center gap-2 opacity-50">
                <Loader2 className="h-4 w-4 animate-spin text-feature-commerce" />
                <span className="text-sm text-muted-foreground">جاري الحذف...</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center border border-feature-commerce/30 rounded-lg bg-feature-commerce-soft/20 backdrop-blur-sm overflow-hidden">
                <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9 hover:bg-feature-commerce/20 rounded-none border-r border-feature-commerce/20 active:scale-95 transition-all text-feature-commerce"
                    onClick={() => handleQuantityUpdate(optimisticQuantity - 1)}
                    disabled={isPending || optimisticQuantity <= 1}
                    aria-label="تقليل الكمية"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Minus className="h-4 w-4" />
                    )}
                </Button>

                <Input
                    type="number"
                    value={optimisticQuantity}
                    onChange={handleInputChange}
                    className="w-14 h-11 sm:h-9 text-center border-0 focus-visible:ring-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-medium text-sm text-feature-commerce"
                    min="1"
                    max="99"
                    disabled={isPending}
                    aria-label={`الكمية: ${optimisticQuantity}`}
                />

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9 hover:bg-feature-commerce/20 rounded-none border-l border-feature-commerce/20 active:scale-95 transition-all text-feature-commerce"
                    onClick={() => handleQuantityUpdate(optimisticQuantity + 1)}
                    disabled={isPending || optimisticQuantity >= 99}
                    aria-label="زيادة الكمية"
                >
                    {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Remove Button */}
            <Button
                size="icon"
                variant="ghost"
                className="h-11 w-11 sm:h-9 sm:w-9 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg border border-destructive/20 active:scale-95 transition-all"
                onClick={handleRemove}
                disabled={isPending || isRemoving}
                aria-label={`حذف ${productName} من السلة`}
                title="حذف من السلة"
            >
                {isRemoving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <X className="h-5 w-5" />
                )}
            </Button>
        </div>
    );
} 