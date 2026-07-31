import { Link } from 'react-router-dom';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  clearRecentlyViewed,
  selectRecentlyViewed,
} from '@/features/recentlyViewed/recentlyViewedSlice';
import Price from '@/components/common/Price';
import ProductImage from '@/components/product/ProductImage';

/**
 * A rail rather than a grid: this is a trail you left, not an edit we curated, so
 * it reads as a lighter row and stays out of the way until you have browsed enough
 * to fill it. Renders nothing on a first visit.
 */
export default function RecentlyViewed() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectRecentlyViewed);

  if (items.length === 0) return null;

  return (
    <section className="container pb-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="section-title flex items-center gap-2.5">
            <Icon name="recentlyViewed" className="text-brand-600" />
            Recently viewed
          </h2>
          <p className="mt-1 text-sm text-muted">Pick up where you left off.</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(clearRecentlyViewed())}
          className="shrink-0 text-sm font-medium text-muted transition-colors hover:text-brand-600"
        >
          Clear history
        </button>
      </div>

      {/* Scrolls on narrow screens; snap points stop a swipe between two cards. */}
      <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-1">
        {items.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group surface-card w-40 shrink-0 snap-start overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:w-48"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
              <ProductImage
                src={product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.discount > 0 && (
                <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {product.discount}% off
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">
                {product.brand}
              </p>
              <p className="line-clamp-1 text-sm font-medium text-ink transition-colors group-hover:text-brand-600">
                {product.title}
              </p>
              <div className="mt-1.5">
                <Price price={product.price} mrp={product.mrp} size="sm" showBadge={false} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
