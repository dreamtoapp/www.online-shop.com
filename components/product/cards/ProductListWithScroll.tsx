'use client';

import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Product } from '@/types/databaseTypes';
import { fetchProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';
import ProductCardSkeleton from '@/components/product/cards/ProductCardSkeleton';
import { ProductCardAdapter } from '@/components/product/cards';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { getCart } from '@/app/(e-comm)/cart/actions/cartServerActions';
import { CartWithItems } from '@/app/(e-comm)/cart/actions/cartServerActions';

interface ProductListWithScrollProps {
    firstPageProducts: Product[];
    categorySlug: string;
    pageSize?: number;
}

export default function ProductListWithScroll({
    firstPageProducts,
    categorySlug,
    pageSize = 8,
}: ProductListWithScrollProps) {
    const [products, setProducts] = useState<Product[]>(firstPageProducts);
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [cart, setCart] = useState<CartWithItems | null>(null);

    // Refs for performance optimization
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastFetchTimeRef = useRef<number>(0);
    const isInitialLoadRef = useRef<boolean>(true);

    // Optimized debounce and retry settings
    const FETCH_DEBOUNCE_MS = 500; // Increased from 300ms
    const MAX_RETRY_ATTEMPTS = 2; // Reduced from 3

    // Optimized intersection observer settings
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px 0px', // Reduced from 400px to prevent premature loading
        triggerOnce: false,
        initialInView: false,
    });

    // Memoized product IDs for efficient duplicate checking
    const productIds = useMemo(() => new Set(products.map(p => p.id)), [products]);

    // --- Load More pattern state ---
    const [autoLoadCount, setAutoLoadCount] = useState(0); // Track auto-loads
    const AUTO_LOAD_LIMIT = 3; // Max auto-loads before showing button

    // Optimized fetch function with better error handling
    const fetchMoreProducts = useCallback(async (isManual = false) => {
        const now = Date.now();
        // Enhanced debounce logic
        if (!isManual && now - lastFetchTimeRef.current < FETCH_DEBOUNCE_MS) {
            return;
        }
        if (loading) return;
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        lastFetchTimeRef.current = now;
        setLoading(true);
        setError(null);
        try {
            const result = await fetchProductsPage(categorySlug, page, pageSize);
            if (result.products && result.products.length > 0) {
                setProducts((prev) => {
                    const uniqueNewProducts = result.products.filter((p) => !productIds.has(p.id));
                    if (uniqueNewProducts.length === 0) {
                        setHasMore(false);
                        return prev;
                    }
                    return [...prev, ...uniqueNewProducts];
                });
                setPage((prev) => prev + 1);
                setRetryCount(0); // Reset retry count on success
                // Only increment autoLoadCount if not manual (button)
                if (!isManual) setAutoLoadCount((c) => c + 1);
            } else {
                setHasMore(false);
            }
            setHasMore(result.hasMore);
        } catch (err: any) {
            console.error('Failed to fetch products:', err);
            if (err.name === 'AbortError') return;
            setError('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
            if (retryCount < MAX_RETRY_ATTEMPTS) {
                const retryDelay = Math.pow(1.5, retryCount) * 1000;
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    fetchMoreProducts(true);
                }, retryDelay);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    }, [loading, categorySlug, page, pageSize, productIds, retryCount]);

    // Manual retry function
    const handleRetry = useCallback(() => {
        setRetryCount(0);
        setError(null);
        fetchMoreProducts(true);
    }, [fetchMoreProducts]);

    // --- Only auto-load if under limit ---
    useEffect(() => {
        if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            return;
        }
        // After 3 auto-loads, stop auto infinite scroll and show Load More button
        if (inView && hasMore && !loading && !error && autoLoadCount < AUTO_LOAD_LIMIT) {
            fetchMoreProducts();
        }
    }, [inView, hasMore, loading, error, fetchMoreProducts, autoLoadCount]);

    // Fetch cart from server and listen for cart-changed events
    useEffect(() => {
        async function fetchCart() {
            const latestCart = await getCart();
            setCart(latestCart);
        }
        fetchCart();
        window.addEventListener('cart-changed', fetchCart);
        return () => window.removeEventListener('cart-changed', fetchCart);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return (
        <>
            {/*
            <div style={{position: 'fixed', top: 10, left: '50%', transform: 'translateX(-50%)', background: '#ff0', color: '#000', padding: '6px 18px', borderRadius: 8, fontWeight: 'bold', fontSize: 18, border: '2px solid #333', zIndex: 9999, boxShadow: '0 2px 8px rgba(0,0,0,0.15)'}}>
                autoLoadCount: {autoLoadCount}
            </div>
            */}
            <div className="container mx-auto">
                {/* Products Grid with Performance Optimizations */}
                <div
                    className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    role="grid"
                    aria-label="قائمة المنتجات"
                >
                    {products.map((product, index) => (
                        <div
                            key={`${product.id}_${index}`}
                            className="product-card"
                            role="gridcell"
                            style={{
                                contentVisibility: 'auto',
                                containIntrinsicSize: '0 520px',
                            }}
                        >
                            <ProductCardAdapter
                                product={product}
                                className="h-full w-full"
                                index={index}
                                quantity={cart?.items?.find(item => item.productId === product.id)?.quantity ?? 0}
                            />
                        </div>
                    ))}
                </div>

                {/* Loading/Error/End States */}
                <div
                    ref={ref}
                    className="mt-8 flex w-full flex-col items-center py-6"
                    role="status"
                    aria-live="polite"
                >
                    {loading && (
                        <div className="w-full">
                            <div className="mb-4 text-center">
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-6 py-3 text-blue-600 shadow-sm">
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    جاري تحميل المزيد من المنتجات...
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {Array.from({ length: pageSize }).map((_, i) => (
                                    <ProductCardSkeleton key={`skeleton_${i}`} />
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center gap-4 rounded-xl bg-red-50 p-6 text-center shadow-sm">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertCircle className="h-5 w-5" />
                                <span className="font-medium">{error}</span>
                            </div>
                            {retryCount < MAX_RETRY_ATTEMPTS ? (
                                <p className="text-sm text-red-500">
                                    محاولة {retryCount + 1} من {MAX_RETRY_ATTEMPTS}...
                                </p>
                            ) : (
                                <Button
                                    onClick={handleRetry}
                                    variant="outline"
                                    size="sm"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    إعادة المحاولة
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Show Load More button after auto-load limit */}
                    {autoLoadCount >= AUTO_LOAD_LIMIT && hasMore && !loading && !error && (
                        <Button
                            onClick={() => fetchMoreProducts(true)}
                            className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                        >
                            تحميل المزيد من المنتجات
                        </Button>
                    )}

                    {!loading && hasMore && !error && autoLoadCount < AUTO_LOAD_LIMIT && (
                        <div className="rounded-full bg-blue-50 px-6 py-3 text-center text-blue-600 shadow-sm transition-colors hover:bg-blue-100">
                            قم بالتمرير لتحميل المزيد من المنتجات...
                        </div>
                    )}

                    {!hasMore && products.length > 0 && !error && (
                        <div className="rounded-full bg-gray-50 px-6 py-3 text-center text-gray-600">
                            تم عرض جميع المنتجات ({products.length} منتج)
                        </div>
                    )}

                    {!hasMore && products.length === 0 && !loading && !error && (
                        <div className="flex flex-col items-center gap-4 rounded-xl bg-gray-50 p-8 text-center">
                            <div className="rounded-full bg-gray-100 p-4">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">لا توجد منتجات</h3>
                                <p className="text-gray-500">لم يتم العثور على منتجات في هذه الفئة.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 