import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loadProducts,
  selectCatalogStatus,
  selectCategoryTiles,
  selectFeaturedProducts,
  selectTopRated,
} from '@/features/catalog/catalogSlice';
import HeroCarousel from '@/components/home/HeroCarousel';
import Newsletter from '@/components/home/Newsletter';
import RecentlyViewed from '@/components/home/RecentlyViewed';
import ProductGrid from '@/components/product/ProductGrid';
import ProductImage from '@/components/product/ProductImage';
import { BRANDS, CATEGORIES, FREE_SHIPPING_OVER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

const PERKS = [
  {
    icon: 'shipping',
    title: 'Free shipping',
    body: `On every order above ${formatPrice(FREE_SHIPPING_OVER)}.`,
  },
  {
    icon: 'returns',
    title: '30-day returns',
    body: 'Changed your mind? Send it back, no questions.',
  },
  {
    icon: 'secure',
    title: 'Secure checkout',
    body: 'Every payment encrypted end to end.',
  },
] as const;

export default function HomePage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const featured = useAppSelector(selectFeaturedProducts);
  const topRated = useAppSelector(selectTopRated);
  const tiles = useAppSelector(selectCategoryTiles);

  useEffect(() => {
    void dispatch(loadProducts());
  }, [dispatch]);

  const loading = status === 'loading' || status === 'idle';

  return (
    <div className="animate-fade-up">
      <HeroCarousel />

      {/* Continuously scrolling brand strip. The list is doubled so the -50% loop
          is seamless; hovering pauses it. */}
      <section className="group border-b border-line bg-surface py-6">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="flex shrink-0 animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused]">
            {[...BRANDS, ...BRANDS].map((brand, index) => (
              <Link
                key={`${brand}-${index}`}
                to={`/search?q=${encodeURIComponent(brand)}`}
                className="whitespace-nowrap font-display text-xl font-semibold tracking-wide text-muted transition-colors hover:text-brand-600"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="section-title mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((category) => {
            const tile = tiles.get(category.slug);
            return (
              <Link
                key={category.slug}
                to={`/c/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-subtle shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                {tile ? (
                  <ProductImage
                    src={tile.image}
                    alt={category.label}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="skeleton h-full w-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-center text-white">
                  <p className="text-sm font-semibold drop-shadow">{category.label}</p>
                  <p className="text-xs text-white/80">{tile ? `${tile.count} styles` : '—'}</p>
                  <span className="mt-1 inline-flex translate-y-1 items-center gap-1 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Shop now <Icon name="arrowRight" size="xs" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container pb-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="section-title">Biggest markdowns</h2>
            <p className="mt-1 text-sm text-muted">The steepest reductions in the store right now.</p>
          </div>
          <Link
            to="/search"
            className="hidden text-sm font-medium text-brand-600 hover:underline sm:block"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={featured} loading={loading} skeletonCount={8} />
      </section>

      <section className="container pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title flex items-center gap-2.5">
              <Icon name="topRated" className="text-brand-600" />
              Top rated
            </h2>
            <p className="mt-1 text-sm text-muted">
              The pieces shoppers keep coming back to score highest.
            </p>
          </div>
          <Link
            to="/search?sort=rating"
            className="hidden shrink-0 text-sm font-medium text-brand-600 hover:underline sm:block"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={topRated} loading={loading} skeletonCount={4} />
      </section>

      <RecentlyViewed />

      <Newsletter />

      <section className="border-y border-line bg-surface">
        <div className="container grid gap-8 py-12 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div
              key={perk.title}
              className="group flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-subtle"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:bg-brand-900/40">
                <Icon name={perk.icon} size="2xl" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-ink">{perk.title}</h3>
                <p className="mt-1 text-sm text-muted">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
