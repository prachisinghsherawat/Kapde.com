import { formatPrice } from '@/lib/format';

interface PriceProps {
  price: number;
  mrp?: number;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

const sizeStyles = {
  sm: { price: 'text-sm font-semibold', meta: 'text-xs' },
  md: { price: 'text-base font-semibold', meta: 'text-xs' },
  lg: { price: 'text-2xl font-bold', meta: 'text-sm' },
} as const;

export default function Price({ price, mrp, size = 'md', showBadge = true }: PriceProps) {
  const styles = sizeStyles[size];
  const discounted = mrp !== undefined && mrp > price;
  const percent = discounted ? Math.round((1 - price / mrp) * 100) : 0;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`${styles.price} text-ink`}>{formatPrice(price)}</span>
      {discounted && (
        <>
          <span className={`${styles.meta} text-muted line-through`}>{formatPrice(mrp)}</span>
          {showBadge && percent > 0 && (
            <span className={`${styles.meta} font-semibold text-brand-600`}>{percent}% off</span>
          )}
        </>
      )}
    </div>
  );
}
