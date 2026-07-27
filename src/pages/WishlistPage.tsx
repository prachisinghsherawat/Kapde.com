import { Link } from 'react-router-dom';
import { Button } from 'antd';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { clearWishlist, selectWishlistItems } from '@/features/wishlist/wishlistSlice';
import EmptyState from '@/components/common/EmptyState';
import ProductGrid from '@/components/product/ProductGrid';
import { pluralize } from '@/lib/format';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="wishlist" />}
        title="No saved pieces yet"
        description="Tap the heart on anything you like and it will wait for you here."
        action={
          <Link to="/">
            <Button type="primary" size="large">
              Find something to love
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="container animate-fade-up py-8 lg:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Wishlist</h1>
          <p className="mt-1 text-sm text-muted">{pluralize(items.length, 'saved piece')}</p>
        </div>
        <Button type="text" danger onClick={() => dispatch(clearWishlist())}>
          Clear wishlist
        </Button>
      </div>

      <ProductGrid products={items} />
    </div>
  );
}
