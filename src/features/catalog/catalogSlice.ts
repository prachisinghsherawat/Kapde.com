import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fetchFashionProducts } from './catalogApi';
import { PAGE_SIZE } from '@/lib/constants';
import type { RootState } from '@/app/store';
import type {
  CategorySlug,
  FilterListKey,
  Filters,
  Product,
  RequestStatus,
  SortKey,
} from '@/types';

interface CatalogState {
  items: Product[];
  status: RequestStatus;
  error: string | null;
  category: CategorySlug | null;
  query: string;
  sort: SortKey;
  page: number;
  filters: Filters;
}

/**
 * The whole fashion catalogue is small enough to load once per session, so
 * category switching and filtering stay instant and offline-ish after first paint.
 * `condition` skips the request when we already have the data.
 */
export const loadProducts = createAsyncThunk(
  'catalog/loadProducts',
  (_: void, { signal }) => fetchFashionProducts(signal),
  {
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).catalog;
      return status !== 'succeeded' && status !== 'loading';
    },
  },
);

// Factories, not shared constants: RTK deep-freezes initial state in development,
// so handing the same object back from a reset would make the next filter toggle
// throw when Immer tries to mutate a frozen array.
const emptyFilters = (): Filters => ({
  brands: [],
  tags: [],
  priceMax: null,
  minRating: null,
  inStockOnly: false,
});

const initialState: CatalogState = {
  items: [],
  status: 'idle',
  error: null,
  category: null,
  query: '',
  sort: 'featured',
  page: 1,
  filters: emptyFilters(),
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    // Anything that narrows the result set returns to page 1; otherwise you can sit
    // on page 3 of a result set that just shrank to one page.
    toggleFilterValue(state, action: PayloadAction<{ key: FilterListKey; value: string }>) {
      const { key, value } = action.payload;
      const current = state.filters[key];
      state.filters[key] = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      state.page = 1;
    },
    setPriceMax(state, action: PayloadAction<number | null>) {
      state.filters.priceMax = action.payload;
      state.page = 1;
    },
    setMinRating(state, action: PayloadAction<number | null>) {
      state.filters.minRating = action.payload;
      state.page = 1;
    },
    setInStockOnly(state, action: PayloadAction<boolean>) {
      state.filters.inStockOnly = action.payload;
      state.page = 1;
    },
    clearFilters(state) {
      state.filters = emptyFilters();
      state.page = 1;
    },
    /** Switching listing keeps the loaded products but drops the previous view. */
    openListing(
      state,
      action: PayloadAction<{ category: CategorySlug | null; query?: string }>,
    ) {
      state.category = action.payload.category;
      state.query = action.payload.query ?? '';
      state.filters = emptyFilters();
      state.sort = 'featured';
      state.page = 1;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.page = 1;
    },
    setSort(state, action: PayloadAction<SortKey>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'We could not reach the store.';
      });
  },
});

export const {
  toggleFilterValue,
  setPriceMax,
  setMinRating,
  setInStockOnly,
  clearFilters,
  openListing,
  setQuery,
  setSort,
  setPage,
} = catalogSlice.actions;

export default catalogSlice.reducer;

const selectCatalog = (state: RootState) => state.catalog;

export const selectAllProducts = (state: RootState) => state.catalog.items;
export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;
export const selectFilters = (state: RootState) => state.catalog.filters;
export const selectQuery = (state: RootState) => state.catalog.query;
export const selectSort = (state: RootState) => state.catalog.sort;
export const selectPage = (state: RootState) => state.catalog.page;
export const selectCategory = (state: RootState) => state.catalog.category;

const matchesQuery = (product: Product, query: string): boolean => {
  if (!query.trim()) return true;
  const haystack = [product.title, product.brand, product.category, ...product.tags]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => b.rating - a.rating || b.reviews.length - a.reviews.length,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  discount: (a, b) => b.discount - a.discount,
  rating: (a, b) => b.rating - a.rating,
  newest: (a, b) => b.id - a.id,
};

/** Products in the current category, before any facet is applied. */
export const selectScopedProducts = createSelector([selectCatalog], ({ items, category }) =>
  category === null ? items : items.filter((product) => product.category === category),
);

export const selectVisibleProducts = createSelector(
  [selectScopedProducts, selectFilters, selectQuery, selectSort],
  (products, filters, query, sort) =>
    products
      .filter(
        (product) =>
          (filters.brands.length === 0 ||
            (product.brand !== null && filters.brands.includes(product.brand))) &&
          (filters.tags.length === 0 ||
            product.tags.some((tag) => filters.tags.includes(tag))) &&
          (filters.priceMax === null || product.price <= filters.priceMax) &&
          (filters.minRating === null || product.rating >= filters.minRating) &&
          (!filters.inStockOnly || product.availability !== 'Out of Stock') &&
          matchesQuery(product, query),
      )
      .sort(comparators[sort]),
);

export const selectPageCount = createSelector([selectVisibleProducts], (products) =>
  Math.max(1, Math.ceil(products.length / PAGE_SIZE)),
);

export const selectPagedProducts = createSelector(
  [selectVisibleProducts, selectPage, selectPageCount],
  (products, page, pageCount) => {
    const safePage = Math.min(page, pageCount);
    return products.slice((safePage - 1) * PAGE_SIZE, (safePage - 1) * PAGE_SIZE + PAGE_SIZE);
  },
);

export const selectActiveFilterCount = createSelector(
  [selectFilters],
  (filters) =>
    filters.brands.length +
    filters.tags.length +
    (filters.priceMax === null ? 0 : 1) +
    (filters.minRating === null ? 0 : 1) +
    (filters.inStockOnly ? 1 : 0),
);

/** Facets are derived from the products actually in scope, so they never offer a
 *  brand or tag that would return nothing. */
export const selectAvailableFacets = createSelector([selectScopedProducts], (products) => {
  const brands = new Map<string, number>();
  const tags = new Map<string, number>();

  for (const product of products) {
    if (product.brand) brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1);
    for (const tag of product.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }

  const byCountThenName = (a: [string, number], b: [string, number]) =>
    b[1] - a[1] || a[0].localeCompare(b[0]);

  return {
    brands: [...brands.entries()].sort(byCountThenName).map(([value, count]) => ({ value, count })),
    tags: [...tags.entries()].sort(byCountThenName).map(([value, count]) => ({ value, count })),
    priceCeiling: products.length
      ? Math.ceil(Math.max(...products.map((product) => product.price)))
      : 1000,
  };
});

export const selectProductById = (id: number) =>
  createSelector([selectAllProducts], (products) => products.find((product) => product.id === id));

export const selectRelatedProducts = (product: Product | null, limit = 4) =>
  createSelector([selectAllProducts], (products) =>
    product === null
      ? []
      : products
          .filter((item) => item.category === product.category && item.id !== product.id)
          .slice(0, limit),
  );

export const selectFeaturedProducts = createSelector([selectAllProducts], (products) =>
  [...products].sort((a, b) => b.discount - a.discount).slice(0, 8),
);

export const selectCategoryTiles = createSelector([selectAllProducts], (products) => {
  const tiles = new Map<string, { image: string; count: number }>();
  for (const product of products) {
    const existing = tiles.get(product.category);
    if (existing) {
      existing.count += 1;
    } else {
      tiles.set(product.category, { image: product.thumbnail, count: 1 });
    }
  }
  return tiles;
});
