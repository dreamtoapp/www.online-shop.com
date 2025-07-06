import { fetchProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';
import type { ProductFilters } from '../helpers/useProductInfiniteScroll';
import ProductInfiniteGrid from './ProductInfiniteGrid';

interface HomepageProductSectionProps {
    filters: ProductFilters;
    page: number;
}

export default async function HomepageProductSection({ filters, page }: HomepageProductSectionProps) {
    const { products } = await fetchProductsPage(filters.categorySlug || '', page);
    return <ProductInfiniteGrid initialProducts={products} filters={filters} />;
} 