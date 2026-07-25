import catalogJson from '@/data/catalog.json';
import type { Catalog, Product } from '@/types';

const catalog = catalogJson as Catalog;

/**
 * The catalogue ships with the bundle. No public API carries real branded clothing
 * with usable product photography, so the data is curated here instead — but every
 * export is async, so this module is the single seam to swap for a real backend.
 */
const LATENCY_MS = 300;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  await delay(LATENCY_MS);
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return catalog.products;
}

export async function fetchProductById(id: number, signal?: AbortSignal): Promise<Product> {
  await delay(LATENCY_MS);
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const product = catalog.products.find((item) => item.id === id);
  if (!product) throw new Error('That product is no longer available.');
  return product;
}
