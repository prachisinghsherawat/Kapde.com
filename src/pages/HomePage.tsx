import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCardOutlined, SyncOutlined, TruckOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loadProducts,
  selectCatalogStatus,
  selectCategoryTiles,
  selectFeaturedProducts,
} from '@/features/catalog/catalogSlice';
import HeroCarousel from '@/components/home/HeroCarousel';
import ProductGrid from '@/components/product/ProductGrid';
import ProductImage from '@/components/product/ProductImage';
import { BRANDS, CATEGORIES, FREE_SHIPPING_OVER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

const PERKS = [
  {
    icon: <TruckOutlined />,
    title: 'Free shipping',
    body: `On every order above ${formatPrice(FREE_SHIPPING_OVER)}.`,
  },
  {
    icon: <SyncOutlined />,
    title: '30-day returns',
    body: 'Changed your mind? Send it back, no questions.',
  },
  {
    icon: <CreditCardOutlined />,
    title: 'Secure checkout',
    body: 'Every payment encrypted end to end.',
  },
];

export default function HomePage() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectCatalogStatus);
  const featured = useAppSelector(selectFeaturedProducts);
  const tiles = useAppSelector(selectCategoryTiles);

  useEffect(() => {
    void dispatch(loadProducts());
  }, [dispatch]);

  const loading = status === 'loading' || status === 'idle';

  return (
    <div className="animate-fade-up">
      <HeroCarousel />

      <section className="border-b border-line bg-surface">
        <div className="container flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-6">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              to={`/search?q=${encodeURIComponent(brand)}`}
              className="font-display text-lg font-semibold tracking-wide text-muted transition-colors hover:text-brand-600"
            >
              {brand}
            </Link>
          ))}
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
                className="group surface-card overflow-hidden transition-shadow hover:shadow-lift"
              >
                <div className="aspect-[4/5] overflow-hidden bg-subtle">
                  {tile ? (
                    <ProductImage
                      src={tile.image}
                      alt={category.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="skeleton h-full w-full" />
                  )}
                </div>
                <div className="p-3 text-center">
                  <p className="text-sm font-semibold text-ink">{category.label}</p>
                  <p className="text-xs text-muted">{tile ? `${tile.count} styles` : '—'}</p>
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

      <section className="border-y border-line bg-surface">
        <div className="container grid gap-8 py-12 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-lg text-brand-600 dark:bg-brand-900/40">
                {perk.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">{perk.title}</h3>
                <p className="mt-1 text-sm text-muted">{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
