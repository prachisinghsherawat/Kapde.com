import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { PAGE_SIZE } from '@/lib/constants';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  columns?: string;
}

// Four across from lg up, so a page of 8 always lands as two even rows of four.
const DEFAULT_COLUMNS = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = PAGE_SIZE,
  columns = DEFAULT_COLUMNS,
}: ProductGridProps) {
  const gridClass = `grid gap-4 sm:gap-6 ${columns}`;

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
