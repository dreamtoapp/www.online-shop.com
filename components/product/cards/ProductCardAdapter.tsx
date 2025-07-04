'use client';

import { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOptimisticCart } from '@/lib/hooks/useOptimisticCart';
import { onCartChanged } from '@/lib/cart-events';
import { ProductCard } from '@/components/product/cards';
import { Product } from '@/types/databaseTypes';
import React from 'react';

interface ProductCardAdapterProps {
    product: Product;
    className?: string;
    index?: number;
    discountPercentage?: number; // Optional global discount
    quantity?: number; // <-- allow parent to control quantity
}

const ProductCardAdapter = React.memo(function ProductCardAdapter({ product, className, discountPercentage, quantity }: ProductCardAdapterProps) {
    const router = useRouter();
    const { add, remove, quantityOf } = useOptimisticCart();

    const optimisticRef = useRef<Set<string>>(new Set());

    const cartQty = quantityOf(product.id, 0);
    const inCart = cartQty > 0 || optimisticRef.current.has(product.id);

    // Use the passed quantity if provided, otherwise fallback to local
    const displayQty = typeof quantity === 'number' ? quantity : cartQty;

    const handleAddToCart = async (productId: string, qty: number, _product: Product) => {
        // console.log('[ProductCardAdapter] Quantity BEFORE add:', quantityOf(productId, 0)); // Uncomment for debugging if needed
        optimisticRef.current.add(productId);
        await add(productId, Math.max(1, qty));
        // console.log('[ProductCardAdapter] Quantity AFTER add:', quantityOf(productId, 0)); // Uncomment for debugging if needed
        router.refresh();
    };

    const handleRemoveFromCart = async (productId: string) => {
        await remove(productId);
    };

    // Discount logic: globally adapt product if discountPercentage is provided
    let adaptedProduct = product;
    if (discountPercentage && discountPercentage > 0) {
        adaptedProduct = {
            ...product,
            compareAtPrice: product.price,
            price: +(product.price * (1 - discountPercentage / 100)).toFixed(2),
        };
    }

    // When cart changes globally, clear optimistic flags and reset display if needed
    useEffect(() =>
        onCartChanged(() => {
            optimisticRef.current.clear();
        })
        , []);

    return (
        <ProductCard
            product={adaptedProduct}
            className={className}
            quantity={displayQty}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            isInCart={inCart}
        />
    );
});

export default ProductCardAdapter; 