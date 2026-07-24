import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Product } from '@/types';

/**
 * The wishlist keeps whole products rather than ids: the API has no
 * "fetch these ids" endpoint, and storing the snapshot means a saved piece still
 * renders even if the catalogue has not loaded yet.
 */
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] as Product[] },
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const exists = state.items.some((item) => item.id === product.id);
      state.items = exists
        ? state.items.filter((item) => item.id !== product.id)
        : [product, ...state.items];
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlistItems = (state: RootState) => state.wishlist.items;

export const selectWishlistCount = (state: RootState) => state.wishlist.items.length;

export const selectWishlistIds = createSelector(
  [selectWishlistItems],
  (items) => new Set(items.map((item) => item.id)),
);
