import { formatPrice } from '@/lib/format';

interface PriceProps {
  price: number;
  mrp?: number;
  discount?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: { price: 'text-sm font-semibold', meta: 'text-xs' },
  md: { price: 'text-base font-semibold', meta: 'text-xs' },
  lg: { price: 'text-2xl font-bold', meta: 'text-sm' },
} as const;

export default function Price({ price, mrp, discount = 0, size = 'md' }: PriceProps) {
  const styles = sizeStyles[size];
  const showStrikethrough = discount > 0 && mrp !== undefined && mrp > price;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`${styles.price} text-ink`}>{formatPrice(price)}</span>
      {showStrikethrough && (
        <>
          <span className={`${styles.meta} text-muted line-through`}>{formatPrice(mrp)}</span>
          <span className={`${styles.meta} font-semibold text-brand-600`}>{discount}% off</span>
        </>
      )}
    </div>
  );
}
