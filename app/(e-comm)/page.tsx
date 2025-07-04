import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import BackToTopButton from '@/components/ecomm/BackToTopButton';

import ProductsSection from '@/components/product/cards/ProductsSection';

const CriticalCSS = dynamic(() => import('./homepage/component/CriticalCSS'), { ssr: true });
const PreloadScript = dynamic(() => import('./homepage/component/PreloadScript'), { ssr: true });

export default async function HomePage(props: { searchParams: Promise<{ slug?: string }> }) {
  const searchParams = await props.searchParams;
  const slug = searchParams?.slug || '';

  return (
    <>
      <CriticalCSS />
      <div className='container mx-auto flex flex-col gap-8 bg-background text-foreground px-4 sm:px-6 lg:px-8'>
        <PreloadScript />
        {/* <HomepageHeroSection /> */}
        {/* <section className="space-y-6" aria-label="Product categories">
          <CategoryList />
        </section>
        <section className="space-y-6" aria-label="Featured promotions">
          <FeaturedPromotions />
        </section> */}
        <section className="space-y-6" aria-label="Featured products">
          <Suspense
            fallback={
              <div className='container mx-auto p-6'>
                <div className='mb-8 h-10 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className='relative h-96 animate-pulse overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg'
                    >
                      <div className='h-48 bg-gradient-to-br from-muted to-muted/70'></div>
                      <div className='space-y-4 p-6'>
                        <div className='h-5 w-3/4 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                        <div className='h-4 w-1/2 rounded-lg bg-gradient-to-r from-muted to-muted/50'></div>
                        <div className='h-12 rounded-xl bg-gradient-to-r from-muted to-muted/50'></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <ProductsSection slug={slug} />
          </Suspense>
        </section>
        <BackToTopButton />
      </div>
    </>
  );
}
