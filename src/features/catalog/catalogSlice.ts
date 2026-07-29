import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fetchProducts } from './catalogApi';
import { ALL_SIZES, PAGE_SIZE, sizesFor } from '@/lib/constants';
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

export const loadProducts = createAsyncThunk(
  'catalog/loadProducts',
  (_: void, { signal }) => fetchProducts(signal),
  {
    condition: (_arg, { getState }) => {
      const { status } = (getState() as RootState).catalog;
      return status !== 'succeeded' && status !== 'loading';
    },
  },
);

const emptyFilters = (): Filters => ({
  brands: [],
  colours: [],
  sizes: [],
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
  const haystack = [product.title, product.brand, product.colourLabel, product.category, ...product.tags]
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

// The category scope comes from the route, so it sits outside the filter panel:
// narrowing it is a different page, not a filter you can clear.
export const selectScopedProducts = createSelector([selectCatalog], ({ items, category }) =>
  category === null ? items : items.filter((product) => product.category === category),
);

export const selectVisibleProducts = createSelector(
  [selectScopedProducts, selectFilters, selectQuery, selectSort],
  (products, filters, query, sort) =>
    products
      .filter(
        (product) =>
          (filters.brands.length === 0 || filters.brands.includes(product.brand)) &&
          (filters.colours.length === 0 || filters.colours.includes(product.colour)) &&
          (filters.sizes.length === 0 ||
            sizesFor(product.category).some((size) => filters.sizes.includes(size))) &&
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
    filters.colours.length +
    filters.sizes.length +
    (filters.priceMax === null ? 0 : 1) +
    (filters.minRating === null ? 0 : 1) +
    (filters.inStockOnly ? 1 : 0),
);

export const selectAvailableFacets = createSelector([selectScopedProducts], (products) => {
  const brands = new Map<string, number>();
  const colours = new Map<string, number>();
  const sizes = new Map<string, number>();

  for (const product of products) {
    brands.set(product.brand, (brands.get(product.brand) ?? 0) + 1);
    colours.set(product.colour, (colours.get(product.colour) ?? 0) + 1);
    for (const size of sizesFor(product.category)) {
      sizes.set(size, (sizes.get(size) ?? 0) + 1);
    }
  }

  const byCountThenName = (a: [string, number], b: [string, number]) =>
    b[1] - a[1] || a[0].localeCompare(b[0]);

  return {
    brands: [...brands.entries()].sort(byCountThenName).map(([value, count]) => ({ value, count })),
    colours: [...colours.entries()].sort(byCountThenName).map(([value, count]) => ({ value, count })),
    sizes: ALL_SIZES.filter((size) => sizes.has(size)).map((value) => ({
      value,
      count: sizes.get(value) ?? 0,
    })),
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

const inStock = (product: Product): boolean => product.availability !== 'Out of Stock';

// The home page never fronts something a shopper cannot buy: sold-out pieces are
// left to the category listings, where the in-stock filter is theirs to control.
export const selectFeaturedProducts = createSelector([selectAllProducts], (products) =>
  products
    .filter(inStock)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 8),
);

export const selectCategoryTiles = createSelector([selectAllProducts], (products) => {
  const tiles = new Map<string, { image: string; count: number; buyable: boolean }>();
  for (const product of products) {
    const existing = tiles.get(product.category);
    if (!existing) {
      tiles.set(product.category, {
        image: product.thumbnail,
        count: 1,
        buyable: inStock(product),
      });
      continue;
    }
    // The count stays the whole category, so it matches what the listing shows —
    // only the photo is held to being in stock.
    existing.count += 1;
    if (!existing.buyable && inStock(product)) {
      existing.image = product.thumbnail;
      existing.buyable = true;
    }
  }
  return tiles;
});
