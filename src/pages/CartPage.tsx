import { Link, useNavigate } from 'react-router-dom';
import { App, Button, Popconfirm } from 'antd';

import Icon from '@/lib/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  MAX_QTY,
  clearCart,
  removeFromCart,
  selectCartLines,
  selectCartTotals,
  setQty,
} from '@/features/cart/cartSlice';
import EmptyState from '@/components/common/EmptyState';
import Price from '@/components/common/Price';
import QuantityStepper from '@/components/common/QuantityStepper';
import ProductImage from '@/components/product/ProductImage';
import OrderSummary from '@/components/cart/OrderSummary';
import { pluralize } from '@/lib/format';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const lines = useAppSelector(selectCartLines);
  const totals = useAppSelector(selectCartTotals);

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="bag" />}
        title="Your bag is empty"
        description="Once you add something you like, it will show up here."
        action={
          <Link to="/">
            <Button type="primary" size="large">
              Start shopping
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
          <h1 className="section-title">Your bag</h1>
          <p className="mt-1 text-sm text-muted">{pluralize(totals.itemCount, 'item')}</p>
        </div>

        <Popconfirm
          title="Empty your bag?"
          description="This removes every item."
          okText="Empty bag"
          okButtonProps={{ danger: true }}
          onConfirm={() => {
            dispatch(clearCart());
            message.success('Bag emptied');
          }}
        >
          <Button type="text" danger icon={<Icon name="remove" />}>
            Empty bag
          </Button>
        </Popconfirm>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-4">
          {lines.map((line) => (
            <li key={line.id} className="surface-card flex gap-4 p-4">
              <Link
                to={`/product/${line.productId}`}
                className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-subtle sm:h-36 sm:w-28"
              >
                <ProductImage
                  src={line.thumbnail}
                  alt={line.title}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      {line.brand}
                    </p>
                    <Link
                      to={`/product/${line.productId}`}
                      className="line-clamp-2 text-sm font-medium text-ink hover:text-brand-600 sm:text-base"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {line.colourLabel} · Size {line.size}
                    </p>
                  </div>

                  <Button
                    type="text"
                    danger
                    icon={<Icon name="remove" />}
                    aria-label={`Remove ${line.title}`}
                    onClick={() => dispatch(removeFromCart(line.id))}
                  />
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                  <QuantityStepper
                    value={line.qty}
                    max={Math.max(1, Math.min(MAX_QTY, line.stock))}
                    onChange={(qty) => dispatch(setQty({ id: line.id, qty }))}
                  />
                  <Price price={line.price * line.qty} mrp={line.mrp * line.qty} showBadge={false} />
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary
            totals={totals}
            action={
              <Button type="primary" size="large" block onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
