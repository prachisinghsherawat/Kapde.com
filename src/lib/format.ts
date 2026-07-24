const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

export const formatPrice = (value: number): string => usd.format(value);

export const pluralize = (count: number, singular: string, plural = `${singular}s`): string =>
  `${count} ${count === 1 ? singular : plural}`;

/** Cart lines are keyed by product *and* size, so one shirt in S and L stays two lines. */
export const lineId = (productId: number, size: string): string => `${productId}::${size}`;

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

/** "women's shoes" reads better than the API's "womens-shoes" in free text. */
export const titleCase = (value: string): string =>
  value.replace(/(^|\s|-)(\w)/g, (_, prefix: string, letter: string) => prefix + letter.toUpperCase());
