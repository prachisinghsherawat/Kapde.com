import { memo } from 'react';
import { Link } from 'react-router-dom';
import { App, Button, Tooltip } from 'antd';
import { HeartFilled, HeartOutlined, ShoppingOutlined, StarFilled } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { selectWishlistSet, toggleWishlist } from '@/features/wishlist/wishlistSlice';
import Price from '@/components/common/Price';
import type { Product } from '@/types';

function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const wishlisted = useAppSelector(selectWishlistSet).has(product.id);

  const handleAdd = () => {
    dispatch(addToCart({ product, size: product.size }));
    message.success(`${product.name} added to bag`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    message.info(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <article className="group surface-card overflow-hidden transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[3/4] overflow-hidden bg-subtle">
        <Link to={`/product/${product.id}`} aria-label={product.name}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white">
            {product.discount}% OFF
          </span>
        )}

        <Tooltip title={wishlisted ? 'Remove from wishlist' : 'Save for later'}>
          <button
            type="button"
            onClick={handleWishlist}
            aria-pressed={wishlisted}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save for later'}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-base shadow-card backdrop-blur transition hover:scale-105"
          >
            {wishlisted ? <HeartFilled className="text-brand-600" /> : <HeartOutlined />}
          </button>
        </Tooltip>

        {/* Slides up on hover for pointers; always visible on touch, where hover never fires. */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
          <Button block type="primary" icon={<ShoppingOutlined />} onClick={handleAdd}>
            Add to bag
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {product.brandLabel}
          </p>
          <span className="flex shrink-0 items-center gap-1 rounded bg-subtle px-1.5 py-0.5 text-xs font-medium text-ink">
            <StarFilled className="text-[10px] text-amber-500" />
            {product.rating}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="line-clamp-1 block text-sm font-medium text-ink transition-colors hover:text-brand-600"
        >
          {product.name}
        </Link>

        <Price price={product.price} mrp={product.mrp} size="sm" />
      </div>
    </article>
  );
}

export default memo(ProductCard);
