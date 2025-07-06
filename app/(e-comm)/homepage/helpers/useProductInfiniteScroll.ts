import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';
import type { Product } from '@/types/databaseTypes';

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  // Add more filter fields as needed
}

interface UseProductInfiniteScrollOptions {
  initialProducts: Product[];
  initialPage?: number;
  pageSize?: number;
  filters: ProductFilters;
}

export function useProductInfiniteScroll({
  initialProducts,
  initialPage = 2,
  pageSize = 8,
  filters,
}: UseProductInfiniteScrollOptions) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const lastFilters = useRef<ProductFilters>(filters);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Debounce filter changes
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(lastFilters.current)) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setProducts(initialProducts);
        setPage(initialPage);
        setHasMore(true);
        setError(null);
        lastFilters.current = filters;
      }, 400);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, initialProducts, initialPage]);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProductsPage(filters.categorySlug || '', page, pageSize);
      if (result.products && result.products.length > 0) {
        setProducts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const unique = result.products.filter((p) => !ids.has(p.id));
          return [...prev, ...unique];
        });
        setPage((prev) => prev + 1);
        setRetryCount(0);
      } else {
        setHasMore(false);
      }
      setHasMore(result.hasMore);
    } catch (err: any) {
      setError('فشل في تحميل المنتجات. يرجى المحاولة مرة أخرى.');
      if (retryCount < 2) {
        setTimeout(() => setRetryCount((c) => c + 1), 1000);
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, loading, hasMore, retryCount]);

  const reset = useCallback(() => {
    setProducts(initialProducts);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setRetryCount(0);
    lastFilters.current = filters;
  }, [initialProducts, initialPage, filters]);

  return {
    products,
    fetchMore,
    loading,
    error,
    hasMore,
    reset,
  };
} 