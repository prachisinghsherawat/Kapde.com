import type { ReactNode } from 'react';
import { Progress } from 'antd';

import { FREE_SHIPPING_OVER } from '@/lib/constants';
import { formatPrice, pluralize } from '@/lib/format';
import type { CartTotals } from '@/types';

interface OrderSummaryProps {
  totals: CartTotals;
  action?: ReactNode;
}

export default function OrderSummary({ totals, action }: OrderSummaryProps) {
  const remainingForFreeShipping = FREE_SHIPPING_OVER - totals.subtotal;

  const rows = [
    { label: `Subtotal (${pluralize(totals.itemCount, 'item')})`, value: formatPrice(totals.subtotal) },
    ...(totals.savings > 0
      ? [{ label: 'Discount', value: `− ${formatPrice(totals.savings)}`, accent: true }]
      : []),
    {
      label: 'Delivery',
      value: totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping),
      accent: totals.shipping === 0,
    },
  ];

  return (
    <div className="surface-card p-6">
      <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-muted">{row.label}</dt>
            <dd className={row.accent ? 'font-medium text-emerald-600' : 'font-medium text-ink'}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="font-semibold text-ink">Total</span>
        <span className="font-display text-xl font-bold text-ink">{formatPrice(totals.total)}</span>
      </div>

      {remainingForFreeShipping > 0 && (
        <div className="mt-5 rounded-xl bg-subtle p-3">
          <p className="text-xs text-muted">
            Add <span className="font-semibold text-ink">{formatPrice(remainingForFreeShipping)}</span>{' '}
            more for free delivery
          </p>
          <Progress
            percent={Math.round((totals.subtotal / FREE_SHIPPING_OVER) * 100)}
            showInfo={false}
            size="small"
            strokeColor="#c81e5a"
          />
        </div>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
