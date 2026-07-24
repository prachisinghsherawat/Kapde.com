import { Link, Navigate } from 'react-router-dom';
import { Button, Result } from 'antd';

import { useAppSelector } from '@/app/hooks';
import { selectLastOrder } from '@/features/cart/cartSlice';
import { formatPrice, pluralize } from '@/lib/format';

const deliveryWindow = () => {
  const from = new Date(Date.now() + 3 * 86_400_000);
  const to = new Date(Date.now() + 5 * 86_400_000);
  const format = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${format(from)} – ${format(to)}`;
};

export default function OrderSuccessPage() {
  const order = useAppSelector(selectLastOrder);

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container animate-fade-up py-12">
      <Result
        status="success"
        title="Order confirmed"
        subTitle={`Thanks! We have emailed your receipt. Your ${pluralize(order.itemCount, 'item')} are being packed.`}
        extra={[
          <Link key="shop" to="/">
            <Button type="primary" size="large">
              Continue shopping
            </Button>
          </Link>,
          <Link key="wishlist" to="/wishlist">
            <Button size="large">View wishlist</Button>
          </Link>,
        ]}
      />

      <div className="mx-auto mt-4 max-w-md surface-card p-6">
        <dl className="space-y-3 text-sm">
          {[
            ['Order reference', order.reference],
            ['Items', pluralize(order.itemCount, 'item')],
            ['Amount paid', formatPrice(order.total)],
            ['Estimated delivery', deliveryWindow()],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
