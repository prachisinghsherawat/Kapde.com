import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { fetchProducts } from './catalogApi';
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
  query: string;
  sort: SortKey;
  page: number;
  filters: Filters;
}

export const loadProducts = createAsyncThunk('catalog/loadProducts', (category?: CategorySlug) =>
  fetchProducts(category),
);

const emptyFilters: Filters = { colours: [], brands: [], sizes: [], priceMax: null };

const initialState: CatalogState = {
  items: [],
  status: 'idle',
  error: null,
  query: '',
  sort: 'featured',
  page: 1,
  filters: emptyFilters,
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    // Narrowing the result set always returns to page 1; otherwise you can sit on
    // page 3 of a result set that just shrank to one page.
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
    clearFilters(state) {
      state.filters = emptyFilters;
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
    resetCatalog: () => initialState,
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
        state.error = action.error.message ?? 'We could not load these products.';
      });
  },
});

export const {
  toggleFilterValue,
  setPriceMax,
  clearFilters,
  setQuery,
  setSort,
  setPage,
  resetCatalog,
} = catalogSlice.actions;

export default catalogSlice.reducer;

const selectCatalog = (state: RootState) => state.catalog;

export const selectCatalogStatus = (state: RootState) => state.catalog.status;
export const selectCatalogError = (state: RootState) => state.catalog.error;
export const selectFilters = (state: RootState) => state.catalog.filters;
export const selectQuery = (state: RootState) => state.catalog.query;
export const selectSort = (state: RootState) => state.catalog.sort;
export const selectPage = (state: RootState) => state.catalog.page;

const matchesQuery = (product: Product, query: string): boolean => {
  if (!query.trim()) return true;
  const haystack =
    `${product.name} ${product.brandLabel} ${product.colourLabel} ${product.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => b.rating * b.reviews - a.rating * a.reviews,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  discount: (a, b) => b.discount - a.discount,
  rating: (a, b) => b.rating - a.rating,
};

export const selectVisibleProducts = createSelector([selectCatalog], ({ items, filters, query, sort }) => {
  const filtered = items.filter(
    (product) =>
      (filters.colours.length === 0 || filters.colours.includes(product.colour)) &&
      (filters.brands.length === 0 || filters.brands.includes(product.brand)) &&
      (filters.sizes.length === 0 || filters.sizes.includes(product.size)) &&
      (filters.priceMax === null || product.price <= filters.priceMax) &&
      matchesQuery(product, query),
  );
  return filtered.sort(comparators[sort]);
});

export const selectPageCount = createSelector([selectVisibleProducts], (products) =>
  Math.max(1, Math.ceil(products.length / PAGE_SIZE)),
);

export const selectPagedProducts = createSelector(
  [selectVisibleProducts, selectPage, selectPageCount],
  (products, page, pageCount) => {
    const safePage = Math.min(page, pageCount);
    const start = (safePage - 1) * PAGE_SIZE;
    return products.slice(start, start + PAGE_SIZE);
  },
);

export const selectActiveFilterCount = createSelector(
  [selectFilters],
  (filters) =>
    filters.colours.length +
    filters.brands.length +
    filters.sizes.length +
    (filters.priceMax === null ? 0 : 1),
);

export const selectPriceCeiling = createSelector([selectCatalog], ({ items }) =>
  items.length === 0 ? 10000 : Math.max(...items.map((product) => product.price)),
);
