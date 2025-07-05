'use client';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icons/Icon';
import { Product } from '@/types/databaseTypes';
import dynamic from 'next/dynamic';
import ProductCardMedia from './ProductCardMedia';
import ProductCardActions from './ProductCardActions';
import ColorSwatches from './ColorSwatches';
import { useRouter } from 'next/navigation';
import { useProductCardOptimizations } from '@/lib/hooks/useProductCardOptimizations';

const Notification = dynamic(() => import('@/components/product/cards/NotificationSection'), { ssr: false });

interface ProductCardProps {
    product: Product;
    quantity: number;
    onAddToCart: (productId: string, quantity: number, product: Product) => void;
    onRemoveFromCart?: (productId: string) => void;
    isInCart: boolean;
    className?: string;
    index?: number; // For analytics tracking
}

const ProductCard = memo(({
    product,
    quantity,
    onAddToCart,
    onRemoveFromCart,
    isInCart,
    className,
    index
}: ProductCardProps) => {
    const router = useRouter();
    const [added, setAdded] = useState(false);
    const [removed, setRemoved] = useState(false);
    const [currentCartState, setCurrentCartState] = useState(isInCart);

    // Performance optimizations
    const {
        cardRef,
        handleMouseEnter: optimizedMouseEnter,
        handleMouseLeave: optimizedMouseLeave,
        handleClick: optimizedClick,
        preloadImages
    } = useProductCardOptimizations({
        productId: product.id,
        onVisible: () => {
            // Preload images when card becomes visible
            if (product.imageUrl) {
                preloadImages([product.imageUrl]);
            }
        },
        onHover: () => {
            // Additional hover logic if needed
        },
        trackAnalytics: true
    });

    // Memoized calculations for performance
    const stockInfo = useMemo(() => {
        const isOutOfStock = product.outOfStock || (product.manageInventory && (product.stockQuantity ?? 0) <= 0);
        const lowStock = !isOutOfStock && product.manageInventory && (product.stockQuantity ?? 0) > 0 && (product.stockQuantity ?? 0) <= 3;
        return { isOutOfStock, lowStock };
    }, [product.outOfStock, product.manageInventory, product.stockQuantity]);

    // Memoized pricing calculations
    const pricingInfo = useMemo(() => {
        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
        const discountPercentage = hasDiscount && product.compareAtPrice
            ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
            : 0;
        return { hasDiscount, discountPercentage };
    }, [product.compareAtPrice, product.price]);

    // Sync internal cart state with prop changes
    useEffect(() => {
        setCurrentCartState(isInCart);
    }, [isInCart]);

    // Analytics tracking
    const trackProductView = useCallback(() => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'USD',
                value: product.price,
                items: [{
                    item_id: product.id,
                    item_name: product.name,
                    item_category: product.type,
                    price: product.price,
                    quantity: 1,
                    index: index
                }]
            });
        }
    }, [product, index]);

    const handleAddToCart = useCallback(async () => {
        try {
            // Ensure minimum quantity of 1 when adding to cart
            const addQuantity = Math.max(1, quantity);

            // Analytics tracking
            if (typeof window !== 'undefined' && window.gtag) {
                window.gtag('event', 'add_to_cart', {
                    currency: 'USD',
                    value: product.price * addQuantity,
                    items: [{
                        item_id: product.id,
                        item_name: product.name,
                        item_category: product.type,
                        price: product.price,
                        quantity: addQuantity
                    }]
                });
            }

            await onAddToCart(product.id, addQuantity, product);
            setCurrentCartState(true);
            setAdded(true);
            setRemoved(false);
            setTimeout(() => setAdded(false), 3000);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            setCurrentCartState(false);
        }
    }, [onAddToCart, product, quantity]);

    const handleRemoveFromCart = useCallback(async () => {
        if (!onRemoveFromCart) return;

        try {
            await onRemoveFromCart(product.id);
            setCurrentCartState(false);
            setAdded(false);
            setRemoved(true);
            setTimeout(() => setRemoved(false), 3000);
        } catch (error) {
            console.error('Failed to remove from cart:', error);
            setCurrentCartState(true);
        }
    }, [onRemoveFromCart, product.id]);

    // Keyboard navigation handler
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trackProductView();
            router.push(`/product/${product.slug}`);
        }
    }, [router, product.slug, trackProductView]);

    // Structured data for SEO
    const structuredData = useMemo(() => ({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.details,
        "image": product.imageUrl,
        "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "USD",
            "availability": stockInfo.isOutOfStock ? "OutOfStock" : "InStock"
        }
    }), [product, stockInfo.isOutOfStock]);

    return (
        <>
            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <Card
                ref={cardRef}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-card/95 
                           shadow-lg border border-card transition-all duration-300 ease-out cursor-pointer
                           hover:shadow-[0_0_0_2px_var(--feature-products)] focus-visible:shadow-[0_0_0_2px_var(--feature-products)] card-hover-effect flex flex-col h-full ${className || ''}`}
                tabIndex={0}
                role="article"
                aria-labelledby={`product-${product.id}-title`}
                aria-describedby={`product-${product.id}-description`}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => {
                    optimizedMouseEnter();
                }}
                onMouseLeave={() => {
                    optimizedMouseLeave();
                }}
                onClick={() => {
                    trackProductView();
                    optimizedClick();
                    router.push(`/product/${product.slug}`);
                }}
            >
                {/* Screen reader only product summary */}
                <div className="sr-only">
                    <h2 id={`product-${product.id}-title`}>{product.name}</h2>
                    <p id={`product-${product.id}-description`}>
                        {product.details} - السعر: {product.price} ر.س
                        {stockInfo.isOutOfStock ? ' - غير متوفر' : ' - متوفر'}
                    </p>
                </div>

                {/* Product Media */}
                <ProductCardMedia
                    product={product}
                    inCart={currentCartState}
                    isOutOfStock={stockInfo.isOutOfStock}
                    lowStock={stockInfo.lowStock}
                    stockQuantity={product.stockQuantity}
                />

                {/* Notification overlay */}
                <Notification
                    show={added}
                    type="add"
                    message="تمت الإضافة إلى السلة"
                />
                <Notification
                    show={removed}
                    type="remove"
                    message="تمت الإزالة من السلة"
                />

                {/* Product Info */}
                <div className="flex flex-col gap-3 p-4 flex-1">
                    {/* Color Swatches */}
                    {product.color && (
                        <ColorSwatches colors={[product.color]} />
                    )}

                    {/* Product Title */}
                    <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-feature-products transition-colors">
                            {product.name}
                        </h3>
                    </div>

                    {/* Rating */}
                    {product.rating && product.rating > 0 && (
                        <div className="flex items-center gap-1">
                            <Icon name="Star" size="xs" className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-muted-foreground">
                                {product.rating.toFixed(1)}
                                {product.reviewCount > 0 && (
                                    <span className="text-xs"> ({product.reviewCount})</span>
                                )}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-feature-commerce">
                            {product.price.toLocaleString()} ر.س
                        </span>
                        {pricingInfo.hasDiscount && (
                            <>
                                <span className="text-sm line-through text-muted-foreground">
                                    {product.compareAtPrice?.toLocaleString()} ر.س
                                </span>
                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                    -{pricingInfo.discountPercentage}%
                                </span>
                            </>
                        )}
                    </div>

                    {/* Shipping Info */}
                    {product.shippingDays && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Truck" size="xs" />
                            <span>شحن {product.shippingDays} أيام</span>
                        </div>
                    )}

                    {/* Stock Status */}
                    {stockInfo.isOutOfStock && (
                        <div className="flex items-center gap-1 text-xs text-destructive">
                            <Icon name="X" size="xs" />
                            <span>غير متوفر</span>
                        </div>
                    )}

                    {/* Actions */}
                    <ProductCardActions
                        productId={product.id}
                        productName={product.name}
                        quantity={quantity}
                        isOutOfStock={stockInfo.isOutOfStock}
                        onAdd={handleAddToCart}
                        onRemove={handleRemoveFromCart}
                    />
                </div>
            </Card>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 