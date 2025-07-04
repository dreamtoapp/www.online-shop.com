// components/LoadingSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

// Simple ProductSkeleton component - no memo needed for loading states
function SkeletonItem() {
  return (
    <div
      className='relative flex animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md'
      style={{
        contain: 'content',
        containIntrinsicSize: '500px',
        height: '500px',
      }}
    >
      {/* Wishlist button placeholder */}
      <div className='absolute left-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80'></div>
      {/* Image section - fixed height */}
      <div className='h-48 w-full rounded-t-2xl bg-muted'></div>
      {/* Content section - flex-grow to fill space */}
      <div className='flex flex-1 flex-col p-4 text-center'>
        <div className='mx-auto mb-1 h-5 w-3/4 rounded bg-muted'></div>
        <div className='mx-auto mb-2 mt-2 h-10 w-1/2 rounded bg-muted'></div>
        <div className='mb-3 flex items-center justify-center gap-1'>
          <div className='flex gap-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='h-3.5 w-3.5 rounded bg-muted'></div>
            ))}
          </div>
          <div className='ml-1 h-3 w-16 rounded bg-muted'></div>
        </div>
        <div className='min-h-[10px] flex-grow'></div>
        <div className='mb-2 mt-3 flex items-center justify-between'>
          <div className='h-5 w-1/3 rounded bg-muted'></div>
          <div className='h-5 w-1/3 rounded bg-muted'></div>
        </div>
        <div className='mt-2 flex justify-center gap-2'>
          <div className='h-8 w-8 rounded-full bg-muted'></div>
          <div className='h-8 w-8 rounded bg-muted'></div>
          <div className='h-8 w-8 rounded-full bg-muted'></div>
        </div>
      </div>
      <div className='flex h-[80px] justify-center p-4'>
        <div className='h-10 w-32 rounded-full bg-muted'></div>
      </div>
    </div>
  );
}

function ProductSkeleton({ count }: { count: number }) {
  return (
    <div className='grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <div className='container mx-auto flex flex-col gap-8 bg-background px-4 text-foreground sm:px-6 lg:px-8'>
      {/* Hero Section Skeleton */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8" aria-label="Loading hero banner">
        <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] rounded-2xl overflow-hidden shadow-2xl">
          <Skeleton className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <Skeleton className="mb-4 h-8 w-2/3 max-w-lg rounded-lg" />
            <Skeleton className="mb-2 h-6 w-1/2 max-w-md rounded-lg" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Section Skeleton */}
      <section className="space-y-6" aria-label="Loading product categories">
        <div className="flex items-center justify-between pb-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <div className="flex gap-5 pb-3 overflow-x-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-72 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* Featured Promotions Section Skeleton */}
      <section className="space-y-6" aria-label="Loading featured promotions">
        <Skeleton className="h-8 w-48 rounded mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border shadow-sm">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-32 mb-2 rounded" />
                <Skeleton className="h-4 w-48 mb-3 rounded" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section Skeleton */}
      <section className="space-y-6" aria-label="Loading featured products">
        <ProductSkeleton count={8} />
      </section>
    </div>
  );
}
