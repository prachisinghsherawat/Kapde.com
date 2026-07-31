import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Product } from '@/types';

/** Enough to fill two rows of four, and short enough to stay a *recent* list. */
export const MAX_RECENTLY_VIEWED = 8;

/**
 * Like the wishlist, this keeps whole products rather than ids: the API has no
 * "fetch these ids" endpoint, so storing the snapshot means the rail renders on a
 * cold load, before the catalogue request has come back.
 */
const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { items: [] as Product[] },
  reducers: {
    // Re-visiting a piece moves it back to the front rather than duplicating it,
    // so the rail reads as "where you have been", newest first.
    recordView(state, action: PayloadAction<Product>) {
      const product = action.payload;
      state.items = [product, ...state.items.filter((item) => item.id !== product.id)].slice(
        0,
        MAX_RECENTLY_VIEWED,
      );
    },
    clearRecentlyViewed(state) {
      state.items = [];
    },
  },
});

export const { recordView, clearRecentlyViewed } = recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;

export const selectRecentlyViewed = (state: RootState) => state.recentlyViewed.items;
