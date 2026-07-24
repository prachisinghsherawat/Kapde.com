import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Theme } from '@/types';

const STORAGE_KEY = 'kapde:ui';

/**
 * Theme is kept out of redux-persist deliberately: `index.html` reads this same key
 * before React boots so a dark-mode reload never flashes white, and that inline
 * script needs a flat value it can parse in one step.
 */
const readStoredTheme = (): Theme => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as { theme?: Theme };
    if (stored.theme === 'dark' || stored.theme === 'light') return stored.theme;
  } catch {
    /* storage blocked — fall through to the OS preference */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const persistTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme }));
  } catch {
    /* nothing to do, and nothing that should break the app */
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: readStoredTheme(),
    filterDrawerOpen: false,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setFilterDrawer(state, action: PayloadAction<boolean>) {
      state.filterDrawerOpen = action.payload;
    },
  },
});

export const { toggleTheme, setFilterDrawer } = uiSlice.actions;

export default uiSlice.reducer;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectFilterDrawerOpen = (state: RootState) => state.ui.filterDrawerOpen;
