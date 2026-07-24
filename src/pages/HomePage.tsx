import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import {
  ArrowRightOutlined,
  CreditCardOutlined,
  SyncOutlined,
  TruckOutlined,
} from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  loadProducts,
  selectAllProducts,
  selectCatalogStatus,
  selectCategoryTiles,
  selectFeaturedProducts,
} from '@/features/catalog/catalogSlice';
import ProductGrid from '@/components/product/ProductGrid';
import ProductImage from '@/components/product/ProductImage';
import { CATEGORIES, FREE_SHIPPING_OVER } from '@/lib/constants';
import { formatPrice } from '@/lib/format';

const PERKS = [
  {
    icon: <TruckOutlined />,
    title: 'Free shipping',
    body: `On every order above ${formatPrice(FREE_SHIPPING_OVER)}.`,
  },
  {
    icon: <SyncOutlined />,
    title: 'Easy returns',
    body: 'Return windows are listed on every product page.',
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
  const products = useAppSelector(selectAllProducts);
  const featured = useAppSelector(selectFeaturedProducts);
  const tiles = useAppSelector(selectCategoryTiles);

  useEffect(() => {
    void dispatch(loadProducts());
  }, [dispatch]);

  const loading = status === 'loading' || status === 'idle';
  const heroImages = featured.slice(0, 3).map((product) => product.thumbnail);
  const brandCount = new Set(products.map((product) => product.brand).filter(Boolean)).size;

  return (
    <div className="animate-fade-up">
      <section className="border-b border-line bg-gradient-to-br from-brand-50 via-canvas to-canvas dark:from-brand-900/25 dark:via-canvas dark:to-canvas">
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-brand-200 bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:border-brand-800">
              New season · 2026
            </span>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Clothes that stay
              <br />
              in the rotation.
            </h1>

            <p className="mt-5 max-w-md text-base text-muted">
              Shirts, dresses, shoes and accessories picked for fit and fabric first — the pieces
              you reach for long after the trend has moved on.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/c/womens-dresses">
                <Button type="primary" size="large" icon={<ArrowRightOutlined />} iconPosition="end">
                  Shop the collection
                </Button>
              </Link>
              <Link to="/search">
                <Button size="large">Browse everything</Button>
              </Link>
            </div>

            <dl className="mt-10 flex gap-8">
              {[
                { value: loading ? '—' : `${products.length}`, label: 'Styles' },
                { value: loading ? '—' : `${brandCount}`, label: 'Brands' },
                { value: `${formatPrice(FREE_SHIPPING_OVER)}+`, label: 'Free shipping' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-bold text-ink">{stat.value}</dt>
                  <dd className="text-xs uppercase tracking-wide text-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton aspect-[3/4] overflow-hidden rounded-2xl shadow-lift">
              {heroImages[0] && (
                <ProductImage src={heroImages[0]} alt="" eager className="h-full w-full object-cover" />
              )}
            </div>
            <div className="grid gap-4">
              {[heroImages[1], heroImages[2]].map((src, index) => (
                <div
                  key={index}
                  className="skeleton aspect-[4/3] overflow-hidden rounded-2xl shadow-card"
                >
                  {src && <ProductImage src={src} alt="" eager className="h-full w-full object-cover" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14">
        <h2 className="section-title mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => {
            const tile = tiles.get(category.slug);
            return (
              <Link
                key={category.slug}
                to={`/c/${category.slug}`}
                className="group surface-card overflow-hidden transition-shadow hover:shadow-lift"
              >
                <div className="aspect-square overflow-hidden bg-subtle">
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
                  <p className="text-xs text-muted">
                    {tile ? `${tile.count} styles` : category.group}
                  </p>
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
            <p className="mt-1 text-sm text-muted">The steepest discounts in the store right now.</p>
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
