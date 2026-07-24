import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { App, Button, Collapse, Rate, Result, Tag } from 'antd';
import {
  CheckCircleOutlined,
  HeartFilled,
  HeartOutlined,
  RightOutlined,
  ShoppingOutlined,
  SyncOutlined,
  TruckOutlined,
} from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart, MAX_QTY } from '@/features/cart/cartSlice';
import { selectWishlistSet, toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { fetchProductById, getRelatedProducts } from '@/features/catalog/catalogApi';
import Price from '@/components/common/Price';
import PageLoader from '@/components/common/PageLoader';
import QuantityStepper from '@/components/common/QuantityStepper';
import ProductGrid from '@/components/product/ProductGrid';
import { FREE_SHIPPING_OVER, SIZES, SIZE_LABELS, getCategory } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { Product, RequestStatus } from '@/types';

export default function ProductPage() {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [qty, setQty] = useState(1);

  const wishlisted = useAppSelector(selectWishlistSet).has(id);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setQty(1);

    fetchProductById(id)
      .then((result) => {
        if (!active) return;
        setProduct(result);
        setStatus('succeeded');
      })
      .catch(() => {
        if (active) setStatus('failed');
      });

    return () => {
      active = false;
    };
  }, [id]);

  const related = useMemo(() => (product ? getRelatedProducts(product) : []), [product]);

  if (status === 'loading') return <PageLoader />;

  if (status === 'failed' || !product) {
    return (
      <Result
        status="404"
        title="Product not found"
        subTitle="This piece has sold out or the link is no longer valid."
        extra={
          <Link to="/">
            <Button type="primary">Back to shopping</Button>
          </Link>
        }
      />
    );
  }

  const category = getCategory(product.category);
  const savings = product.mrp - product.price;

  const handleAdd = (thenCheckout = false) => {
    dispatch(addToCart({ product, size: product.size, qty }));
    if (thenCheckout) {
      navigate('/cart');
      return;
    }
    message.success(`${product.name} added to bag`);
  };

  return (
    <div className="container animate-fade-up py-8 lg:py-12">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link to="/" className="hover:text-brand-600">
          Home
        </Link>
        <RightOutlined className="text-[10px]" />
        <Link to={`/c/${product.category}`} className="hover:text-brand-600">
          {category?.label}
        </Link>
        <RightOutlined className="text-[10px]" />
        <span className="truncate text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-line bg-subtle">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[3/4] w-full object-cover"
          />
        </div>

        <div className="lg:py-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {product.brandLabel}
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <Rate disabled allowHalf defaultValue={product.rating} className="!text-sm" />
            <span className="text-sm text-muted">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <div className="mt-6 border-y border-line py-5">
            <Price price={product.price} mrp={product.mrp} size="lg" />
            {savings > 0 && (
              <p className="mt-1 text-sm font-medium text-emerald-600">
                You save {formatPrice(savings)}
              </p>
            )}
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Select size</h2>
              <span className="text-xs text-muted">Size guide</span>
            </div>
            <div className="flex gap-2">
              {SIZES.map((size) => {
                const available = size === product.size;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    aria-pressed={available}
                    title={available ? SIZE_LABELS[size] : 'Out of stock'}
                    className={`h-12 min-w-[3.5rem] rounded-xl border text-sm font-semibold transition ${
                      available
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'cursor-not-allowed border-line bg-subtle text-muted line-through opacity-60'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted">
              This piece is stocked in {SIZE_LABELS[product.size]} only.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <h2 className="text-sm font-semibold text-ink">Quantity</h2>
            <QuantityStepper value={qty} max={MAX_QTY} onChange={setQty} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingOutlined />}
              onClick={() => handleAdd()}
              className="min-w-[12rem] flex-1"
            >
              Add to bag
            </Button>
            <Button size="large" onClick={() => handleAdd(true)} className="flex-1">
              Buy now
            </Button>
            <Button
              size="large"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save for later'}
              icon={wishlisted ? <HeartFilled className="text-brand-600" /> : <HeartOutlined />}
              onClick={() => dispatch(toggleWishlist(product.id))}
            />
          </div>

          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3">
              <TruckOutlined className="text-brand-600" />
              Free delivery on orders over {formatPrice(FREE_SHIPPING_OVER)}
            </li>
            <li className="flex items-center gap-3">
              <SyncOutlined className="text-brand-600" />
              Free 30-day returns and exchanges
            </li>
            <li className="flex items-center gap-3">
              <CheckCircleOutlined className="text-brand-600" />
              In stock — dispatched within 24 hours
            </li>
          </ul>

          <Collapse
            ghost
            className="mt-8"
            defaultActiveKey={['details']}
            items={[
              {
                key: 'details',
                label: <span className="font-semibold text-ink">Product details</span>,
                children: (
                  <dl className="grid grid-cols-2 gap-y-3 text-sm">
                    {[
                      ['Brand', product.brandLabel],
                      ['Colour', product.colourLabel],
                      ['Size', SIZE_LABELS[product.size]],
                      ['Category', category?.label ?? '—'],
                      ['Product code', product.id.toUpperCase()],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-muted">{label}</dt>
                        <dd className="font-medium text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ),
              },
              {
                key: 'care',
                label: <span className="font-semibold text-ink">Material & care</span>,
                children: (
                  <p className="text-sm text-muted">
                    Machine wash cold with like colours. Do not bleach. Tumble dry low, or line dry
                    in shade to keep the colour true. Warm iron if needed.
                  </p>
                ),
              },
              {
                key: 'shipping',
                label: <span className="font-semibold text-ink">Shipping & returns</span>,
                children: (
                  <p className="text-sm text-muted">
                    Standard delivery arrives in 3–5 working days, free over{' '}
                    {formatPrice(FREE_SHIPPING_OVER)}. Returns are free within 30 days as long as
                    tags are attached.
                  </p>
                ),
              },
            ]}
          />

          <div className="mt-6 flex flex-wrap gap-2">
            <Tag bordered={false} className="!rounded-full !bg-subtle !text-ink">
              {product.colourLabel}
            </Tag>
            <Tag bordered={false} className="!rounded-full !bg-subtle !text-ink">
              {category?.singular}
            </Tag>
            {product.discount >= 30 && (
              <Tag bordered={false} color="magenta" className="!rounded-full">
                Deal
              </Tag>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-6">You may also like</h2>
          <ProductGrid products={related} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
        </section>
      )}
    </div>
  );
}
