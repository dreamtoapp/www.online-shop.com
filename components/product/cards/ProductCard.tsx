'use client';
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Check, ArrowLeft, Truck, Star } from 'lucide-react';
import { Product } from '@/types/databaseTypes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
                    <h3 id={`product-${product.id}-title`}>
                        {product.name} - منتج بسعر ${product.price} دولار
                    </h3>
                    <p id={`product-${product.id}-description`}>
                        {product.details} {stockInfo.isOutOfStock ? 'غير متوفر حالياً' : 'متوفر في المخزون'}
                    </p>
                </div>

                {/* Enhanced Notification Feedback */}
                {(added || removed) && (
                    <Notification
                        show={added || removed}
                        type={added ? 'add' : 'remove'}
                        message={added ? 'تمت الإضافة إلى السلة!' : 'تمت الإزالة من السلة!'}
                    />
                )}

                {/* Cart Indicator (Top-Right) */}
                {currentCartState && (
                    <div className="absolute right-3 top-3 z-20 rounded-full bg-green-500 p-2 text-white shadow-lg animate-in fade-in-0 zoom-in-95 duration-300"
                        aria-label="منتج في السلة">
                        <Check size={20} />
                    </div>
                )}

                {/* Media Section */}
                <ProductCardMedia
                    product={product}
                    inCart={currentCartState}
                    isOutOfStock={stockInfo.isOutOfStock}
                    lowStock={stockInfo.lowStock}
                    stockQuantity={product.stockQuantity}
                />

                <div className="flex-1 flex flex-col min-h-0">
                    {/* Enhanced Color Swatches */}
                    {(() => {
                        const colors = (product as any).colors as string[] | undefined;
                        return Array.isArray(colors) && colors.length > 0 ? (
                            <div className="px-3 sm:px-5 pt-2">
                                <ColorSwatches colors={colors} />
                            </div>
                        ) : null;
                    })()}

                    {/* Enhanced Content Section */}
                    <div className="flex-1 flex flex-col p-3 sm:p-5 gap-3 min-h-0">
                        {/* Enhanced Product Name & Type */}
                        <div className="space-y-2">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-200"
                                title={product.name}>
                                {product.name}
                            </h3>

                            {/* Enhanced product type with better visibility */}
                            <div className="flex items-center justify-between mb-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-feature-products-soft text-feature-products border border-feature-products/20">
                                    {product.type === 'accessories' ? 'إكسسوارات' : product.type}
                                </span>

                                {/* Enhanced "view details" call-to-action */}
                                <Link
                                    href={`/product/${product.slug}`}
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors duration-200 font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-1"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`عرض تفاصيل ${product.name}`}
                                >
                                    <span>عرض التفاصيل</span>
                                    <ArrowLeft className="h-3 w-3" />
                                </Link>
                            </div>

                            {/* Enhanced description with better readability */}
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {product.details}
                            </p>
                        </div>

                        {/* Enhanced Rating Display */}
                        {product.rating && product.rating > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < Math.floor(product.rating!)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : i < product.rating!
                                                    ? 'fill-yellow-400/50 text-yellow-400'
                                                    : 'text-gray-300'
                                                }`}
                                            aria-hidden="true"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    {product.rating.toFixed(1)}
                                </span>
                                {(product as any).reviewCount && (
                                    <span className="text-xs text-muted-foreground">
                                        ({(product as any).reviewCount} تقييم)
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Enhanced Stock Indicators */}
                        <div className="space-y-2">
                            {/* Stock status with visual indicators */}
                            {!stockInfo.isOutOfStock && product.manageInventory && (
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${stockInfo.lowStock ? 'bg-orange-500' : 'bg-green-500'
                                        }`} aria-hidden="true" />
                                    <span className={`text-xs font-medium ${stockInfo.lowStock ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
                                        }`}>
                                        {stockInfo.lowStock
                                            ? `متبقي ${product.stockQuantity} فقط - اطلب الآن!`
                                            : 'متوفر في المخزون'
                                        }
                                    </span>
                                </div>
                            )}

                            {/* Shipping information */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Truck className="h-3 w-3" aria-hidden="true" />
                                <span>شحن مجاني للطلبات فوق $50</span>
                            </div>
                        </div>

                        {/* Enhanced Pricing Section */}
                        <div className="space-y-3">
                            {/* Discount badge for deals */}
                            {pricingInfo.hasDiscount && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                        وفّر {pricingInfo.discountPercentage}%
                                    </span>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                        خصم محدود الوقت
                                    </span>
                                </div>
                            )}

                            {/* Enhanced price display */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-col items-start gap-1">
                                    {pricingInfo.hasDiscount ? (
                                        <>
                                            <span className="text-sm text-muted-foreground line-through" aria-label={`السعر الأصلي ${product.compareAtPrice} دولار`}>
                                                ${product.compareAtPrice!.toFixed(2)}
                                            </span>
                                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400" aria-label={`السعر المخفض ${product.price} دولار`}>
                                                ${product.price.toFixed(2)}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400" aria-label={`السعر ${product.price} دولار`}>
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}

                                    {/* Price per unit if applicable */}
                                    {(product as any).unit && (
                                        <span className="text-xs text-muted-foreground">
                                            (${(product.price / ((product as any).unitQuantity || 1)).toFixed(2)} / {(product as any).unit})
                                        </span>
                                    )}
                                </div>

                                {quantity > 1 && (
                                    <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/20 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-800">
                                        <span className="text-xs text-green-600 dark:text-green-400">الإجمالي:</span>
                                        <span className="text-sm font-bold text-green-700 dark:text-green-300">
                                            ${(quantity * product.price).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Actions Section */}
                <div className="p-3 sm:p-5 pt-0" onClick={(e) => e.stopPropagation()}>
                    <ProductCardActions
                        productId={product.id}
                        productName={product.name}
                        quantity={quantity}
                        isOutOfStock={stockInfo.isOutOfStock}
                        onAdd={handleAddToCart}
                        onRemove={onRemoveFromCart ? handleRemoveFromCart : undefined}
                    />
                </div>
            </Card>
        </>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard; 