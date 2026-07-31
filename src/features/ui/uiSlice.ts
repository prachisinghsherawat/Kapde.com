import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Theme } from '@/types';

const STORAGE_KEY = 'kapde:ui';

interface StoredUi {
  theme?: Theme;
  /** A dismissed promo bar stays dismissed; it is chrome, not shopping state. */
  announcementDismissed?: boolean;
}

/**
 * This slice keeps its own storage key rather than joining redux-persist:
 * `index.html` reads it before React boots so a dark-mode reload never flashes
 * white, and that inline script needs a flat object it can parse in one step.
 */
const readStored = (): StoredUi => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return typeof stored === 'object' && stored !== null ? (stored as StoredUi) : {};
  } catch {
    /* storage blocked, or somebody else wrote this key — start clean */
    return {};
  }
};

/** Merges rather than replaces, so persisting one preference cannot drop another. */
const writeStored = (patch: StoredUi): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), ...patch }));
  } catch {
    /* nothing to do, and nothing that should break the app */
  }
};

const readStoredTheme = (): Theme => {
  const { theme } = readStored();
  if (theme === 'dark' || theme === 'light') return theme;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const persistTheme = (theme: Theme): void => writeStored({ theme });

export const persistAnnouncementDismissed = (dismissed: boolean): void =>
  writeStored({ announcementDismissed: dismissed });

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: readStoredTheme(),
    filterDrawerOpen: false,
    announcementDismissed: readStored().announcementDismissed === true,
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setFilterDrawer(state, action: PayloadAction<boolean>) {
      state.filterDrawerOpen = action.payload;
    },
    dismissAnnouncement(state) {
      state.announcementDismissed = true;
    },
  },
});

export const { toggleTheme, setFilterDrawer, dismissAnnouncement } = uiSlice.actions;

export default uiSlice.reducer;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectFilterDrawerOpen = (state: RootState) => state.ui.filterDrawerOpen;
export const selectAnnouncementDismissed = (state: RootState) => state.ui.announcementDismissed;
