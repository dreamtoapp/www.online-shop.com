import { NextRequest } from 'next/server';
import { fetchProductsPage } from '@/app/(e-comm)/homepage/actions/fetchProductsPage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const slug = searchParams.get('slug') || '';
  const { products, hasMore } = await fetchProductsPage(slug, page);
  return Response.json({ products, hasMore });
} 