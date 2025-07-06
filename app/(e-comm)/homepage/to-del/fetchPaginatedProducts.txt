'use server';

import { cacheData } from '@/lib/cache';
import db from '@/lib/prisma';
import {
  Prisma,
  Product,
} from '@prisma/client'; // Import Prisma

// Define a type for the returned product shape (extends Product with normalized fields and supplier info)
type ProductWithSupplier = Omit<Product, 'supplier'> & {
  supplier?: {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    // Add more fields as needed
  };
  details?: string;
  size?: string;
  rating?: number;
  imageUrl?: string;
  images: string[];
  inStock: boolean;
  slug: string;
};

async function fetchPaginatedProductsFromDB(
  page: number = 1,
  limit: number = 20,
  slug: string = '',
): Promise<ProductWithSupplier[]> {
  // Calculate skip value for pagination
  const skip = (page - 1) * limit;

  // Find supplier if slug is provided
  const whereClause: Prisma.ProductWhereInput = { published: true }; // Use const

  if (slug && slug.trim() !== '') {
    const supplier = await db.supplier.findFirst({
      where: { slug },
      select: { id: true },
    });

    if (supplier) {
      whereClause.supplierId = supplier.id;
    }
  }

  // Fetch paginated products
  const products = await db.product.findMany({
    where: whereClause,
    skip,
    take: limit,
    include: { supplier: true },
    orderBy: { createdAt: 'desc' },
  });

  // Add default image if needed, ensure price is a valid number
  return products.map((product) => ({
    ...product,
    details: product.details === null ? undefined : product.details,
    size: product.size === null ? undefined : product.size,
    rating: product.rating === null ? undefined : product.rating,
    imageUrl: product.imageUrl === null ? undefined : (product.imageUrl as string),
    supplier: product.supplier
      ? {
          id: product.supplier.id,
          name: product.supplier.name,
          email: product.supplier.email ?? undefined,
          phone: product.supplier.phone ?? undefined,
        }
      : undefined,
    images: Array.isArray(product.images) ? product.images.filter(Boolean) : [],
    inStock: !product.outOfStock, // Derive inStock
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    slug: product.slug || product.id,
    // Fix: ensure nullable fields are null, not undefined, for Product base fields
    // (TypeScript: Omit<Product, 'supplier'> expects null, not undefined)
    // Only override if the original value is null, otherwise keep as is
    // This ensures compatibility with Prisma types
    // If you want to always use undefined, update the ProductWithSupplier type accordingly
  } as ProductWithSupplier));
}

// Cache the paginated products with a unique key based on page, limit, and slug
export const fetchPaginatedProducts = cacheData<
  [number?, number?, string?], // Args type
  ProductWithSupplier[], // Return type
  typeof fetchPaginatedProductsFromDB // Function type T
>(
  fetchPaginatedProductsFromDB,
  ['fetchPaginatedProducts'],
  { revalidate: 3600 }, // Revalidate every hour
);
