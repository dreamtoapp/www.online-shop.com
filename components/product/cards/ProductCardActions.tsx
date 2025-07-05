'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/icons/Icon';
import QuantityControls from '@/components/cart/QuantityControls';

interface ProductCardActionsProps {
    productId: string;
    productName: string;
    quantity: number;
    isOutOfStock: boolean;
    onAdd: () => Promise<void>;
    onRemove?: () => Promise<void>;
}

const ProductCardActions = React.memo(function ProductCardActions({
    productId,
    productName,
    quantity,
    isOutOfStock,
    onAdd,
    onRemove,
}: ProductCardActionsProps) {
    const [loading, setLoading] = useState(false);

    const handlePrimary = async () => {
        setLoading(true);
        try {
            if (quantity > 0 && onRemove) await onRemove();
            else await onAdd();
        } finally {
            setLoading(false);
        }
    };

    const isRemoveMode = quantity > 0 && !!onRemove;
    const buttonText = loading
        ? isRemoveMode
            ? 'جاري الإزالة...'
            : 'جاري الإضافة...'
        : isRemoveMode
            ? 'إزالة من السلة'
            : isOutOfStock
                ? 'نفد المخزون'
                : 'أضف إلى السلة';

    return (
        <div className="flex flex-col gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
            {quantity > 0 && (
                <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-muted/50 to-muted/30 backdrop-blur-sm rounded-full p-1.5 border border-border/50">
                    <QuantityControls
                        productId={productId}
                        serverQty={quantity}
                        size="sm"
                    />
                </div>
            )}

            <Button
                onClick={handlePrimary}
                variant={isRemoveMode ? 'destructive' : 'default'}
                size="lg"
                className="w-full flex items-center justify-center gap-2 btn-professional"
                disabled={loading || isOutOfStock}
                aria-label={isRemoveMode ? `إزالة ${productName} من السلة` : `أضف ${productName} إلى السلة`}
            >
                {isRemoveMode ? <Icon name="Trash2" size="sm" /> : <Icon name="FaCartPlus" size="sm" />}
                <span className="font-semibold text-base">{buttonText}</span>
            </Button>
        </div>
    );
});

export default ProductCardActions; 