import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';

interface QuantityControlsProps {
    productId: string;
    serverQty?: number; // server quantity to start with
    size?: 'sm' | 'md';
}

/**
 * Reusable + / – quantity controller wired to useOptimisticCart.
 * Renders nothing if the product is not yet in the cart (qty === 0).
 */
const QuantityControls: React.FC<QuantityControlsProps> = ({ productId, serverQty = 0, size = 'md' }) => {
    const { inc, dec, quantityOf } = useOptimisticCart();
    const [isLoading, setIsLoading] = useState(false);
    const qty = quantityOf(productId, serverQty);

    if (qty === 0) return null; // product not yet in cart

    const btnSize = size === 'sm' ? 'icon' : 'default';

    const handleInc = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await inc(productId);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDec = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await dec(productId);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleInc}
                disabled={isLoading}
                className='h-8 w-8 rounded-full'
                aria-label='Increase quantity'
            >
                +
            </Button>
            <span className='text-sm font-medium w-6 text-center select-none'>{qty}</span>
            <Button
                variant='outline'
                size={btnSize}
                onClick={handleDec}
                disabled={isLoading}
                className='h-8 w-8 rounded-full'
                aria-label='Decrease quantity'
            >
                –
            </Button>
        </div>
    );
};

export default QuantityControls; 