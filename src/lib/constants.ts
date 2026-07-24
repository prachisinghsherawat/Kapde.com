import type { Category, CategorySlug, SortKey } from '@/types';

export const API_BASE = 'https://dummyjson.com';

export const CATEGORIES: Category[] = [
  { slug: 'tops', label: 'Tops', singular: 'Top', group: 'Women' },
  { slug: 'womens-dresses', label: 'Dresses', singular: 'Dress', group: 'Women' },
  { slug: 'womens-shoes', label: 'Women’s Shoes', singular: 'Shoe', group: 'Women' },
  { slug: 'womens-bags', label: 'Bags', singular: 'Bag', group: 'Women' },
  { slug: 'womens-jewellery', label: 'Jewellery', singular: 'Piece', group: 'Women' },
  { slug: 'womens-watches', label: 'Women’s Watches', singular: 'Watch', group: 'Women' },
  { slug: 'mens-shirts', label: 'Shirts', singular: 'Shirt', group: 'Men' },
  { slug: 'mens-shoes', label: 'Men’s Shoes', singular: 'Shoe', group: 'Men' },
  { slug: 'mens-watches', label: 'Men’s Watches', singular: 'Watch', group: 'Men' },
  { slug: 'sunglasses', label: 'Sunglasses', singular: 'Pair', group: 'Accessories' },
];

export const CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

/**
 * The API carries no size information, so sizing is the store's own merchandising
 * layer — apparel gets letter sizes, footwear gets UK sizes, everything else is
 * a single size.
 */
const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11'];
export const ONE_SIZE = 'One Size';

const SIZE_CHART: Partial<Record<CategorySlug, string[]>> = {
  tops: APPAREL_SIZES,
  'womens-dresses': APPAREL_SIZES,
  'mens-shirts': APPAREL_SIZES,
  'womens-shoes': SHOE_SIZES,
  'mens-shoes': SHOE_SIZES,
};

export const sizesFor = (category: CategorySlug): string[] =>
  SIZE_CHART[category] ?? [ONE_SIZE];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export const RATING_OPTIONS = [4.5, 4, 3.5, 3];

export const PAGE_SIZE = 12;
export const FREE_SHIPPING_OVER = 100;
export const SHIPPING_FEE = 9;

export const isCategorySlug = (value: string | undefined): value is CategorySlug =>
  CATEGORY_SLUGS.includes(value as CategorySlug);

export const getCategory = (slug: CategorySlug): Category | undefined =>
  CATEGORIES.find((category) => category.slug === slug);
