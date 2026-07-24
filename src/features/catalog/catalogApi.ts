import catalogJson from '@/data/catalog.json';
import type { Catalog, CategorySlug, Product } from '@/types';

const catalog = catalogJson as Catalog;

/**
 * The catalog ships with the bundle, so there is no server to fall over. Every
 * export is async anyway — swapping these three bodies for `fetch` calls is the
 * only change needed to move to a real backend.
 */
const LATENCY_MS = 350;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(category?: CategorySlug): Promise<Product[]> {
  await delay(LATENCY_MS);
  return category
    ? catalog.products.filter((product) => product.category === category)
    : catalog.products;
}

export async function fetchProductById(id: string): Promise<Product> {
  await delay(LATENCY_MS);
  const product = catalog.products.find((item) => item.id === id);
  if (!product) throw new Error('That product is no longer available.');
  return product;
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return catalog.products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return [...catalog.products].sort((a, b) => b.discount - a.discount).slice(0, limit);
}

export const getAllProducts = (): Product[] => catalog.products;
