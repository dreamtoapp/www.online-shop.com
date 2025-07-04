import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getProductsByCategorySlug } from '../action/actions';
import { Separator } from '@/components/ui/separator';

import { getCategories } from '../../homepage/actions/getCategories';
import { PageProps } from '@/types/commonTypes';
import { ProductsSection } from '@/components/product/cards';

export async function generateMetadata({ params }: PageProps<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const categoryResult = await getCategoryBySlug(slug);

  if (!categoryResult.success || !categoryResult.category) {
    return {
      title: 'Category Not Found',
    };
  }
  const category = categoryResult.category;
  return {
    title: category.name,
    description: category.description || `Browse products in the ${category.name} category.`,
    openGraph: {
      title: category.name,
      description: category.description || `Browse products in the ${category.name} category.`,
      images: category.imageUrl ? [{ url: category.imageUrl, alt: category.name }] : [],
    },
  };
}

const PRODUCTS_PER_PAGE = 12;

export default async function CategoryPage({ params, searchParams }: PageProps<{ slug: string }, { page?: string }>) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { slug } = resolvedParams;
  const pageParam = resolvedSearchParams?.page;

  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const pageSize = PRODUCTS_PER_PAGE;

  // Fetch data in parallel for better performance
  const [categoryDataResult, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getCategories() // Get all categories for related categories section
  ]);

  if (!categoryDataResult.success || !categoryDataResult.category) {
    notFound();
  }
  const category = categoryDataResult.category;

  // Fetch products for the current category
  const productsResult = await getProductsByCategorySlug(slug, currentPage, pageSize);

  // Handle products result with enhanced type safety
  if (!productsResult.success) {
    console.error('Error fetching products:', productsResult.error);
    return notFound();
  }

  // Get related categories (excluding current one)
  const relatedCategories = allCategories
    .filter(c => c.slug !== slug)
    .slice(0, 4); // Limit to 4 related categories

  return (
    <div className="container mx-auto bg-background px-4 py-8 text-foreground">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 flex items-center text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          الرئيسية
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href="/categories" className="text-muted-foreground hover:text-foreground">
          الفئات
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="font-medium">{category.name}</span>
      </nav>

      {/* Hero header with category image */}
      <header className="mb-8 overflow-hidden rounded-xl bg-accent">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex-1 p-6 md:p-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                {category.description}
              </p>
            )}
            <div className="mt-6 rounded-lg bg-muted/50 px-4 py-2">
              <span className="font-medium">{productsResult.success ? productsResult.totalProducts : 0}</span> منتج في هذه الفئة
            </div>
          </div>

          {category.imageUrl && (
            <div className="h-60 w-full md:h-80 md:w-1/2 lg:h-96">
              <div className="relative h-full w-full">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Products grid */}
      <h2 className="mb-6 text-2xl font-bold">منتجات {category.name}</h2>
      <ProductsSection slug={slug} />

      {/* Pagination */}
      {/* Pagination logic can be handled inside ProductsSection if needed */}

      {/* Related Categories Section */}
      {relatedCategories.length > 0 && (
        <div className="mt-20">
          <Separator className="mb-8" />
          <h2 className="mb-6 text-2xl font-bold">فئات ذات صلة</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {relatedCategories.map((relatedCategory) => (
              <Link
                key={relatedCategory.id}
                href={`/categories/${relatedCategory.slug}`}
                className="group overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-40 overflow-hidden">
                  {relatedCategory.imageUrl ? (
                    <Image
                      src={relatedCategory.imageUrl}
                      alt={relatedCategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{relatedCategory.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {relatedCategory.productCount} منتج
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
