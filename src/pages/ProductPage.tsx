import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { App, Button, Collapse, Rate, Result, Tag } from 'antd';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { MAX_QTY, addToCart } from '@/features/cart/cartSlice';
import { selectWishlistIds, toggleWishlist } from '@/features/wishlist/wishlistSlice';
import { loadProducts, selectAllProducts } from '@/features/catalog/catalogSlice';
import { recordView } from '@/features/recentlyViewed/recentlyViewedSlice';
import { fetchProductById } from '@/features/catalog/catalogApi';
import Price from '@/components/common/Price';
import PageLoader from '@/components/common/PageLoader';
import QuantityStepper from '@/components/common/QuantityStepper';
import ProductGrid from '@/components/product/ProductGrid';
import ProductImage from '@/components/product/ProductImage';
import { FREE_SHIPPING_OVER, getCategory, sizesFor } from '@/lib/constants';
import { formatDate, formatPrice, pluralize, titleCase } from '@/lib/format';
import type { Product, RequestStatus } from '@/types';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const wishlisted = useAppSelector(selectWishlistIds).has(productId);
  const allProducts = useAppSelector(selectAllProducts);

  useEffect(() => {
    // The related-products rail needs the catalogue; it is a no-op once loaded.
    void dispatch(loadProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setStatus('failed');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setActiveImage(0);
    setQty(1);

    fetchProductById(productId, controller.signal)
      .then((result) => {
        setProduct(result);
        const sizes = sizesFor(result.category);
        setSize(sizes.length === 1 ? sizes[0] : null);
        setStatus('succeeded');
        // Recorded on a successful fetch, not on mount: a dead link is not a visit.
        dispatch(recordView(result));
      })
      .catch((cause: unknown) => {
        if ((cause as Error).name !== 'AbortError') setStatus('failed');
      });

    return () => controller.abort();
  }, [dispatch, productId]);

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
  const sizes = sizesFor(product.category);
  const soldOut = product.availability === 'Out of Stock';
  const maxQty = Math.max(1, Math.min(MAX_QTY, product.stock));
  const related = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 5);

  const handleAdd = (thenCheckout = false) => {
    if (!size) {
      message.warning('Please choose a size first.');
      return;
    }
    dispatch(addToCart({ product, size, qty }));
    if (thenCheckout) {
      navigate('/cart');
      return;
    }
    message.success(`${product.title} added to bag`);
  };

  return (
    <div className="container animate-fade-up py-8 lg:py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link to="/" className="hover:text-brand-600">
          Home
        </Link>
        <Icon name="chevronRight" size="xs" />
        <Link to={`/c/${product.category}`} className="hover:text-brand-600">
          {category?.label}
        </Link>
        <Icon name="chevronRight" size="xs" />
        <span className="truncate text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar sm:flex-col">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === activeImage}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    index === activeImage
                      ? 'border-brand-600'
                      : 'border-line opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden rounded-2xl border border-line bg-subtle">
            <ProductImage
              src={product.images[activeImage] ?? product.thumbnail}
              alt={product.title}
              eager
              className="aspect-square w-full object-contain"
            />
          </div>
        </div>

        <div className="lg:py-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
            {product.brand}
          </p>

          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Rate disabled allowHalf value={product.rating} className="!text-sm" />
            <span className="text-sm text-muted">
              {product.rating.toFixed(2)} · {pluralize(product.reviews.length, 'review')}
            </span>
          </div>

          <p className="mt-5 text-[15px] leading-relaxed text-muted">{product.description}</p>

          <div className="mt-6 border-y border-line py-5">
            <Price price={product.price} mrp={product.mrp} size="lg" />
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes</p>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">
                {sizes.length > 1 ? 'Select size' : 'Size'}
              </h2>
              {sizes.length > 1 && <span className="text-xs text-muted">Size guide</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={soldOut}
                  aria-pressed={size === option}
                  onClick={() => setSize(option)}
                  className={`h-12 min-w-[3.5rem] rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    size === option
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-line bg-surface text-ink hover:border-brand-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h2 className="text-sm font-semibold text-ink">Quantity</h2>
            <QuantityStepper value={qty} max={maxQty} onChange={setQty} />
            {product.availability === 'Low Stock' && (
              <span className="text-sm font-medium text-amber-600">
                Only {product.stock} left
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="primary"
              size="large"
              disabled={soldOut}
              icon={<Icon name="bag" />}
              onClick={() => handleAdd()}
              className="min-w-[12rem] flex-1"
            >
              {soldOut ? 'Sold out' : 'Add to bag'}
            </Button>
            <Button size="large" disabled={soldOut} onClick={() => handleAdd(true)} className="flex-1">
              Buy now
            </Button>
            <Button
              size="large"
              aria-label={wishlisted ? 'Remove from wishlist' : 'Save for later'}
              icon={
                wishlisted ? (
                  <Icon name="wishlistOn" className="text-brand-600" />
                ) : (
                  <Icon name="wishlist" />
                )
              }
              onClick={() => dispatch(toggleWishlist(product))}
            />
          </div>

          <ul className="mt-8 space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3">
              <Icon name="shipping" size="md" className="text-brand-600" />
              Free delivery on orders over {formatPrice(FREE_SHIPPING_OVER)}
            </li>
            <li className="flex items-center gap-3">
              <Icon name="returns" size="md" className="text-brand-600" />
              Free 30-day returns and exchanges
            </li>
            <li className="flex items-center gap-3">
              <Icon name="guarantee" size="md" className="text-brand-600" />
              Quality guaranteed for 12 months
            </li>
            <li className="flex items-center gap-3">
              <Icon name="inStock" size="md" className="text-brand-600" />
              {product.availability}
              {!soldOut && ` — ${product.stock} in stock`}
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
                      ['Brand', product.brand],
                      ['Category', category?.label ?? '—'],
                      ['SKU', product.sku],
                      ['Colour', product.colourLabel],
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
                key: 'reviews',
                label: (
                  <span className="font-semibold text-ink">
                    Reviews ({product.reviews.length})
                  </span>
                ),
                children:
                  product.reviews.length === 0 ? (
                    <p className="text-sm text-muted">No reviews yet.</p>
                  ) : (
                    <ul className="space-y-5">
                      {product.reviews.map((review, index) => (
                        <li key={`${review.reviewerName}-${index}`} className="border-b border-line pb-4 last:border-0 last:pb-0">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-ink">
                              {review.reviewerName}
                            </span>
                            <span className="text-xs text-muted">{formatDate(review.date)}</span>
                          </div>
                          <Rate disabled value={review.rating} className="!mt-1 !text-xs" />
                          <p className="mt-1.5 text-sm text-muted">{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  ),
              },
            ]}
          />

          {product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Link key={tag} to={`/search?q=${encodeURIComponent(tag)}`}>
                  <Tag bordered={false} className="!rounded-full !bg-subtle !text-ink">
                    {titleCase(tag)}
                  </Tag>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-6">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
