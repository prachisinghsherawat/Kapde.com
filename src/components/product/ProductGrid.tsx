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

const DEFAULT_COLUMNS = 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3';

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
