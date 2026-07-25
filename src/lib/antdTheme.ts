import { theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';
import type { Theme } from '@/types';

const shared = {
  colorPrimary: '#c81e5a',
  colorInfo: '#c81e5a',
  colorSuccess: '#15803d',
  colorError: '#dc2626',
  borderRadius: 10,
  fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  fontSize: 14,
  controlHeight: 40,
};

export const buildAntdTheme = (mode: Theme): ThemeConfig => ({
  algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  token:
    mode === 'dark'
      ? {
          ...shared,
          colorBgBase: '#0d0f14',
          colorBgContainer: '#161920',
          colorBgElevated: '#1e222b',
          colorBorder: '#2d323d',
          colorBorderSecondary: '#242933',
          colorText: '#eef0f5',
          colorTextSecondary: '#949baa',
        }
      : {
          ...shared,
          colorBgBase: '#ffffff',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBorder: '#e5e5ea',
          colorBorderSecondary: '#f0f0f3',
          colorText: '#14161c',
          colorTextSecondary: '#6c707c',
        },
  components: {
    Button: { fontWeight: 500, primaryShadow: 'none', defaultShadow: 'none' },
    Segmented: { itemSelectedBg: '#c81e5a', itemSelectedColor: '#ffffff' },
  },
});
