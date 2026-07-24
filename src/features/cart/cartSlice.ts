import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { lineId } from '@/lib/format';
import { FREE_SHIPPING_OVER, SHIPPING_FEE } from '@/lib/constants';
import type { RootState } from '@/app/store';
import type { CartLine, CartTotals, Order, Product, Size } from '@/types';

export const MAX_QTY = 10;

interface CartState {
  lines: CartLine[];
  lastOrder: Order | null;
}

const initialState: CartState = { lines: [], lastOrder: null };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ product: Product; size: Size; qty?: number }>) {
      const { product, size, qty = 1 } = action.payload;
      const id = lineId(product.id, size);
      const existing = state.lines.find((line) => line.id === id);

      if (existing) {
        existing.qty = Math.min(existing.qty + qty, MAX_QTY);
        return;
      }

      // Cart lines snapshot what the cart renders, so they never need to look the
      // product up again — and a price change mid-session can't rewrite the basket.
      state.lines.push({
        id,
        productId: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        mrp: product.mrp,
        brandLabel: product.brandLabel,
        colourLabel: product.colourLabel,
        category: product.category,
        size,
        qty: Math.min(qty, MAX_QTY),
      });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.lines = state.lines.filter((line) => line.id !== action.payload);
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const { id, qty } = action.payload;
      if (qty < 1) {
        state.lines = state.lines.filter((line) => line.id !== id);
        return;
      }
      const line = state.lines.find((item) => item.id === id);
      if (line) line.qty = Math.min(qty, MAX_QTY);
    },
    clearCart(state) {
      state.lines = [];
    },
    placeOrder: {
      reducer(state, action: PayloadAction<Order>) {
        state.lastOrder = action.payload;
        state.lines = [];
      },
      prepare: (totals: CartTotals) => ({
        payload: {
          ...totals,
          reference: `KPD-${Date.now().toString(36).toUpperCase()}`,
          placedAt: new Date().toISOString(),
        },
      }),
    },
  },
});

export const { addToCart, removeFromCart, setQty, clearCart, placeOrder } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCartLines = (state: RootState) => state.cart.lines;
export const selectLastOrder = (state: RootState) => state.cart.lastOrder;

export const selectCartCount = createSelector([selectCartLines], (lines) =>
  lines.reduce((total, line) => total + line.qty, 0),
);

export const selectCartTotals = createSelector([selectCartLines], (lines): CartTotals => {
  const subtotal = lines.reduce((total, line) => total + line.price * line.qty, 0);
  const mrpTotal = lines.reduce((total, line) => total + line.mrp * line.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;

  return {
    subtotal,
    savings: mrpTotal - subtotal,
    shipping,
    total: subtotal + shipping,
    itemCount: lines.reduce((total, line) => total + line.qty, 0),
  };
});

export const selectCartProductIds = createSelector(
  [selectCartLines],
  (lines) => new Set(lines.map((line) => line.productId)),
);
