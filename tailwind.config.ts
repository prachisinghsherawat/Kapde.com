import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  // Ant Design v5 ships its own reset; Tailwind's Preflight on top of it strips
  // the styling from antd Buttons and form controls.
  corePlugins: { preflight: false },
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '0.75rem', lg: '1rem' },
      screens: { '2xl': '1720px' },
    },
    extend: {
      colors: {
        brand: {
          50: '#fff1f5',
          100: '#ffe4ec',
          200: '#fecdd9',
          300: '#fda4bd',
          400: '#fb6f9c',
          500: '#f43f7e',
          600: '#c81e5a',
          700: '#a8184c',
          800: '#8c1741',
          900: '#78173b',
        },
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        subtle: 'rgb(var(--color-subtle) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 40 / 0.04), 0 8px 24px -12px rgb(16 24 40 / 0.14)',
        lift: '0 8px 16px -8px rgb(16 24 40 / 0.16), 0 24px 48px -24px rgb(16 24 40 / 0.24)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' },
        },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        // Slow pan+zoom that keeps the hero image alive between slide changes.
        kenburns: {
          '0%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1.16)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'none' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.6s infinite',
        kenburns: 'kenburns 7s ease-out both',
        'slide-in': 'slide-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 3s ease-in-out infinite',
        marquee: 'marquee 26s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
