export type CategorySlug =
  | 'tshirts'
  | 'shirts'
  | 'dresses'
  | 'coord-sets'
  | 'jeans'
  | 'outerwear'
  | 'knitwear'
  | 'hoodies';

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating' | 'newest';

export type Availability = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface Product {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: CategorySlug;
  brand: string;
  colour: string;
  colourLabel: string;
  tags: string[];
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  stock: number;
  availability: Availability;
  images: string[];
  thumbnail: string;
  sku: string;
  reviews: Review[];
  /** Link back to the photographer's page on Unsplash. */
  photoCredit: string;
}

export interface Category {
  slug: CategorySlug;
  label: string;
  singular: string;
}

export interface Banner {
  id: string;
  image: string;
  alt: string;
}

export interface ColourFacet {
  value: string;
  label: string;
  hex: string;
}

export interface Catalog {
  products: Product[];
  banners: Banner[];
  categories: Category[];
  brands: string[];
  colours: ColourFacet[];
}

export interface Filters {
  brands: string[];
  colours: string[];
  sizes: string[];
  priceMax: number | null;
  minRating: number | null;
  inStockOnly: boolean;
}

export type FilterListKey = 'brands' | 'colours' | 'sizes';

export interface CartLine {
  id: string;
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  mrp: number;
  brand: string;
  colourLabel: string;
  category: CategorySlug;
  size: string;
  qty: number;
  stock: number;
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
