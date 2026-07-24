import type { Size } from '@/types';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number): string => inr.format(value);

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

/** Cart lines are keyed by product *and* size, so one shirt in S and L stays two lines. */
export const lineId = (productId: string, size: Size): string => `${productId}::${size}`;
