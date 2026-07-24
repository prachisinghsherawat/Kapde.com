import { API_BASE, CATEGORY_SLUGS } from '@/lib/constants';
import type { Availability, CategorySlug, Product, Review } from '@/types';

/** The subset of the DummyJSON payload this app relies on. */
interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  availabilityStatus?: string;
  shippingInformation?: string;
  warrantyInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images?: string[];
  thumbnail?: string;
  reviews?: Review[];
}

const AVAILABILITY: Availability[] = ['In Stock', 'Low Stock', 'Out of Stock'];

const toAvailability = (value: string | undefined, stock: number): Availability => {
  if (value && (AVAILABILITY as string[]).includes(value)) return value as Availability;
  if (stock === 0) return 'Out of Stock';
  return stock < 10 ? 'Low Stock' : 'In Stock';
};

/**
 * The API quotes the selling price plus a discount percentage; the store shows a
 * struck-through "was" price, so the original is reconstructed here once rather
 * than in every component that renders a price.
 */
const toProduct = (raw: ApiProduct): Product => {
  const discount = Math.round(raw.discountPercentage ?? 0);
  const mrp = discount > 0 ? Number((raw.price / (1 - discount / 100)).toFixed(2)) : raw.price;
  const images = raw.images?.length ? raw.images : raw.thumbnail ? [raw.thumbnail] : [];

  return {
    id: raw.id,
    slug: raw.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    title: raw.title,
    description: raw.description,
    category: raw.category as CategorySlug,
    brand: raw.brand ?? null,
    tags: raw.tags ?? [],
    price: raw.price,
    mrp,
    discount,
    rating: raw.rating,
    stock: raw.stock,
    availability: toAvailability(raw.availabilityStatus, raw.stock),
    images,
    thumbnail: raw.thumbnail ?? images[0] ?? '',
    sku: raw.sku ?? `SKU-${raw.id}`,
    reviews: raw.reviews ?? [],
    shippingInformation: raw.shippingInformation ?? 'Ships in 3–5 business days',
    warrantyInformation: raw.warrantyInformation ?? 'No warranty',
    returnPolicy: raw.returnPolicy ?? 'No return policy',
    minimumOrderQuantity: raw.minimumOrderQuantity ?? 1,
  };
};

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`The store is not responding right now (${response.status}).`);
  }
  return (await response.json()) as T;
}

/**
 * DummyJSON has no "several categories at once" endpoint, so the ten fashion
 * categories are fetched in parallel. `Promise.all` means one failed category
 * fails the load, which is what we want — a silently half-empty store is worse
 * than an error the shopper can retry.
 */
export async function fetchFashionProducts(signal?: AbortSignal): Promise<Product[]> {
  const responses = await Promise.all(
    CATEGORY_SLUGS.map((slug) =>
      getJson<{ products: ApiProduct[] }>(`/products/category/${slug}?limit=0`, signal),
    ),
  );

  return responses
    .flatMap((response) => response.products)
    .map(toProduct)
    .filter((product) => product.images.length > 0);
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  const raw = await getJson<ApiProduct>(`/products/${id}`, signal);
  return toProduct(raw);
}
