'use client';
import { useInView } from 'react-intersection-observer';
import ProductCardAdapter from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardAdapter';
import ProductCardSkeleton from '@/app/(e-comm)/(home-page-sections)/product/cards/ProductCardSkeleton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductFilters } from '../helpers/useProductInfiniteScroll';

interface ProductInfiniteGridProps {
    initialProducts: any[];
    filters: ProductFilters;
}

export default function ProductInfiniteGrid({ initialProducts, filters }: ProductInfiniteGridProps) {
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [products, setProducts] = useState<any[]>(initialProducts);
    const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '200px 0px' });
    const router = useRouter();
    const slug = filters.categorySlug || '';

    useEffect(() => {
        if (inView && hasMore && !loading && !error) {
            setLoading(true);
            fetch(`/api/products-grid?page=${page}&slug=${encodeURIComponent(slug)}`)
                .then(res => res.json())
                .then(data => {
                    if (!data.products || data.products.length === 0) {
                        setHasMore(false);
                    } else {
                        setProducts(prev => [...prev, ...data.products]);
                        setPage(prev => prev + 1);
                        router.replace(`?page=${page}`);
                    }
                })
                .catch(() => setError('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.'))
                .finally(() => setLoading(false));
        }
    }, [inView, hasMore, loading, error, page, slug, router]);

    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" role="grid" aria-label="قائمة المنتجات">
                {products.map((product, index) => (
                    <div key={`${product.id}_${index}`} className="product-card" role="gridcell" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 520px' }}>
                        <ProductCardAdapter product={product} className="h-full w-full" index={index} />
                    </div>
                ))}
                {loading && Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={`skeleton_${i}`} />)}
            </div>
            <div ref={ref} className="mt-8 flex w-full flex-col items-center py-6" role="status" aria-live="polite">
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {!loading && !hasMore && products.length === 0 && <div className="text-muted-foreground">لا توجد منتجات متاحة.</div>}
                {hasMore && !loading && (
                    <button onClick={() => setPage(page)} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90">تحميل المزيد</button>
                )}
            </div>
        </div>
    );
} 