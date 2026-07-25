import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined, ShoppingOutlined, StarFilled } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { selectWishlistIds, toggleWishlist } from '@/features/wishlist/wishlistSlice';
import Price from '@/components/common/Price';
import ProductImage from '@/components/product/ProductImage';
import { sizesFor } from '@/lib/constants';
import type { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const wishlisted = useAppSelector(selectWishlistIds).has(product.id);

  const sizes = sizesFor(product.category);
  const soldOut = product.availability === 'Out of Stock';

  const handleAdd = () => {
    // Anything with a real size choice belongs on the product page, not a one-click add.
    if (sizes.length > 1) {
      navigate(`/product/${product.id}`);
      return;
    }
    dispatch(addToCart({ product, size: sizes[0] }));
    message.success(`${product.title} added to bag`);
  };

  return (
    <article className="group surface-card flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
        <Link to={`/product/${product.id}`} aria-label={product.title}>
          <ProductImage
            src={product.thumbnail}
            alt={product.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              soldOut ? 'opacity-60' : ''
            }`}
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {soldOut ? (
            <span className="w-fit rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-canvas">
              Sold out
            </span>
          ) : (
            <>
              {product.discount > 0 && (
                <span className="w-fit rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
                  {product.discount}% OFF
                </span>
              )}
              {product.availability === 'Low Stock' && (
                <span className="w-fit rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
                  Low stock
                </span>
              )}
            </>
          )}
        </div>

        <Tooltip title={wishlisted ? 'Remove from wishlist' : 'Save for later'}>
          <button
            type="button"
            onClick={() => dispatch(toggleWishlist(product))}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save for later'}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-lg shadow-card backdrop-blur transition-all duration-200 hover:scale-110 active:scale-95"
          >
            {wishlisted ? (
              <HeartFilled className="text-brand-600" />
            ) : (
              <HeartOutlined className="text-ink" />
            )}
          </button>
        </Tooltip>

        {/* Slides up on hover for pointers; always visible on touch, where hover never fires. */}
        {!soldOut && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
            <Button block type="primary" icon={<ShoppingOutlined />} onClick={handleAdd}>
              {sizes.length > 1 ? 'Select size' : 'Add to bag'}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 text-xs font-semibold uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <span className="flex shrink-0 items-center gap-1 rounded bg-subtle px-1.5 py-0.5 text-xs font-medium text-ink">
            <StarFilled className="text-[10px] text-amber-500" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 block text-sm font-medium text-ink transition-colors hover:text-brand-600"
        >
          {product.title}
        </Link>

        <div className="mt-auto pt-1.5">
          <Price price={product.price} mrp={product.mrp} size="sm" />
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
