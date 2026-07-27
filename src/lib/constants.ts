import catalogJson from '@/data/catalog.json';
import type { Catalog, Category, CategorySlug, SortKey } from '@/types';

const catalog = catalogJson as Catalog;

export const CATEGORIES = catalog.categories;
export const BANNERS = catalog.banners;
export const BRANDS = catalog.brands;
export const COLOURS = catalog.colours;
export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

/** One letter scale across the whole store — no numeric waist sizes to decode. */
const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

/** Takes the category so a per-category scale stays easy to reintroduce. */
export const sizesFor = (_category: CategorySlug): string[] => LETTER_SIZES;

export const ALL_SIZES = LETTER_SIZES;

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
