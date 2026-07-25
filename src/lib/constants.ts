import catalogJson from '@/data/catalog.json';
import type { Catalog, Category, CategorySlug, SortKey } from '@/types';

const catalog = catalogJson as Catalog;

export const CATEGORIES = catalog.categories;
export const BANNERS = catalog.banners;
export const BRANDS = catalog.brands;
export const COLOURS = catalog.colours;
export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

/** Jeans are sold on waist measurement; everything else takes letter sizes. */
const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const WAIST_SIZES = ['26', '28', '30', '32', '34', '36'];

export const sizesFor = (category: CategorySlug): string[] =>
  category === 'jeans' ? WAIST_SIZES : LETTER_SIZES;

export const ALL_SIZES = [...new Set([...LETTER_SIZES, ...WAIST_SIZES])];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export const RATING_OPTIONS = [4.5, 4, 3.5, 3];

/** Four across, two rows down. */
export const PAGE_SIZE = 8;
export const FREE_SHIPPING_OVER = 1999;
export const SHIPPING_FEE = 99;

export const isCategorySlug = (value: string | undefined): value is CategorySlug =>
  CATEGORY_SLUGS.includes(value as CategorySlug);

export const getCategory = (slug: CategorySlug): Category | undefined =>
  CATEGORIES.find((category) => category.slug === slug);
