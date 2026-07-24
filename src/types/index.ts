export type CategorySlug = 'tops' | 'kurtis' | 'denims' | 'frocks' | 'jackets' | 'middis';
export type Size = 'S' | 'L' | 'XL';
export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating';

export interface Product {
  id: string;
  category: CategorySlug;
  name: string;
  image: string;
  price: number;
  mrp: number;
  discount: number;
  size: Size;
  colour: string;
  colourLabel: string;
  brand: string;
  brandLabel: string;
  rating: number;
  reviews: number;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  singular: string;
}

export interface ColourFacet {
  value: string;
  label: string;
  hex: string;
}

export interface BrandFacet {
  value: string;
  label: string;
}

export interface Catalog {
  products: Product[];
  categories: Category[];
  sizes: Size[];
  colours: ColourFacet[];
  brands: BrandFacet[];
}

/** All list facets are plain `string[]` so one generic toggle reducer serves them all. */
export interface Filters {
  colours: string[];
  brands: string[];
  sizes: string[];
  priceMax: number | null;
}

export type FilterListKey = 'colours' | 'brands' | 'sizes';

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  brandLabel: string;
  colourLabel: string;
  category: CategorySlug;
  size: Size;
  qty: number;
}

export interface CartTotals {
  subtotal: number;
  savings: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface Order extends CartTotals {
  reference: string;
  placedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type Theme = 'light' | 'dark';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
