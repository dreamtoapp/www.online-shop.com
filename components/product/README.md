# Product Components Structure

This folder contains all product-related UI components, organized for clarity and scalability.

## Structure

- `cards/` — Product card components for lists, grids, and featured displays.
  - `ProductCard.tsx` — Minimal, default product card for lists and grids.
  - `EnhancedProductCard.tsx` — Feature-rich card for special use cases.
  - `ProductCardSkeleton.tsx` — Skeleton loader for product cards.
  - `index.ts` — Barrel export for all card components.

- `gallery/` — Product image gallery components.
  - `ProductImageGallery.tsx` — Handles product image display, thumbnails, and fullscreen dialog.
  - `index.ts` — Barrel export for gallery components.

- `related/` — Related product features.
  - `RelatedProducts.tsx` — Displays a grid of related products.
  - `index.ts` — Barrel export for related product features.

## Usage

Import product components using barrel exports for clean and maintainable code:

```tsx
import { ProductCard, EnhancedProductCard, ProductCardSkeleton } from '@/components/product/cards';
import { ProductImageGallery } from '@/components/product/gallery';
import { RelatedProducts } from '@/components/product/related';
```

## Notes
- Keep all product card variants in `cards/`.
- Place only gallery-related logic in `gallery/`.
- Add new product-related features in their own subfolders for scalability. 