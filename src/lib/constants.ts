import catalogJson from '@/data/catalog.json';
import type { Catalog, CategorySlug, Size, SortKey } from '@/types';

const catalog = catalogJson as Catalog;

export const CATEGORIES = catalog.categories;
export const SIZES = catalog.sizes;
export const COLOURS = catalog.colours;
export const BRANDS = catalog.brands;

export const SIZE_LABELS: Record<Size, string> = {
  S: 'Small',
  L: 'Large',
  XL: 'Extra Large',
};

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Top Rated' },
];

export const PAGE_SIZE = 9;
export const FREE_SHIPPING_OVER = 2000;
export const SHIPPING_FEE = 99;

export const isCategorySlug = (value: string | undefined): value is CategorySlug =>
  CATEGORIES.some((category) => category.slug === value);

export const getCategory = (slug: CategorySlug) =>
  CATEGORIES.find((category) => category.slug === slug);
