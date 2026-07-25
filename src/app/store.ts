import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import type { PersistedState } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import catalogReducer from '@/features/catalog/catalogSlice';
import uiReducer from '@/features/ui/uiSlice';
import wishlistReducer from '@/features/wishlist/wishlistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  catalog: catalogReducer,
  ui: uiReducer,
  wishlist: wishlistReducer,
});

/**
 * redux-persist lays the stored slice over the initial state, so a blob written by
 * an older build of the app — or by anything else that used this origin — rehydrates
 * as-is and the first selector to read it throws (`wishlist.items` is undefined).
 * Anything that is not today's shape is dropped so the slice keeps its initial state.
 */
const hasArrayAt = (slice: unknown, key: string): boolean => {
  if (slice === undefined) return true;
  if (typeof slice !== 'object' || slice === null) return false;
  return Array.isArray((slice as Record<string, unknown>)[key]);
};

const isCurrentShape = (state: Record<string, unknown> | undefined): boolean => {
  if (state === undefined) return false;
  const auth = state.auth;
  const authIsObject = auth === undefined || (typeof auth === 'object' && auth !== null);
  return hasArrayAt(state.cart, 'lines') && hasArrayAt(state.wishlist, 'items') && authIsObject;
};

const persistConfig = {
  key: 'kapde',
  version: 2,
  storage,
  // Only what a shopper expects to survive a reload. `catalog` is refetched on
  // mount and `ui` owns its own storage key (see uiSlice).
  whitelist: ['cart', 'wishlist', 'auth'],
  migrate: async (state: PersistedState) =>
    isCurrentShape(state as Record<string, unknown> | undefined) ? state : undefined,
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
