import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: [] as string[] },
  reducers: {
    toggleWishlist(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ids = state.ids.includes(id)
        ? state.ids.filter((item) => item !== id)
        : [...state.ids, id];
    },
    clearWishlist(state) {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;

export const selectWishlistIds = (state: RootState) => state.wishlist.ids;

export const selectWishlistCount = (state: RootState) => state.wishlist.ids.length;

export const selectWishlistSet = createSelector(
  [selectWishlistIds],
  (ids) => new Set(ids),
);
