'use client';
import { Product } from '@/types/databaseTypes';

interface ProductCardBadgesProps {
    product: Product;
}

export default function ProductCardBadges({ product }: ProductCardBadgesProps) {
    const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
    const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24) < 30; // last 30 days

    if (!isOnSale && !isNew) return null;

    return (
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
            {isOnSale && (
                <span className="rounded-lg bg-feature-commerce-soft px-2.5 py-1 text-[10px] font-bold text-feature-commerce shadow-sm">
                    خصم
                </span>
            )}
            {isNew && (
                <span className="rounded-lg bg-blue-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                    جديد
                </span>
            )}
        </div>
    );
} 