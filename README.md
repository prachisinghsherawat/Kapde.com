# Kapde

A fashion storefront built with React, TypeScript, Redux Toolkit, Ant Design and Tailwind CSS.

## Getting started


```bash
npm install
npm run dev      # http://localhost:3000
```

| Script              | What it does                                |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Vite dev server with HMR                    |
| `npm run build`     | Typecheck, then build to `build/`           |
| `npm run preview`   | Serve the production build locally          |
| `npm run typecheck` | `tsc --noEmit`                              |

## Stack

- **Vite + React 18 + TypeScript** (`strict`), path alias `@/*` → `src/*`
- **Redux Toolkit** for state, **redux-persist** for the bag, wishlist and session
- **Ant Design v5** for components, themed from one token file
- **Tailwind CSS** for layout and styling (Preflight off — antd ships its own reset)

## Structure

```
src/
  app/          store, typed hooks
  features/     one folder per domain: slice + selectors (+ api)
  components/   presentational and composed UI, grouped by area
  pages/        one component per route, lazy-loaded
  routes/       route table and the auth guard
  lib/          constants, formatting, antd theme tokens
  types/        shared domain types
```

## Data

`src/data/catalog.json` holds 71 clothing products across 7 categories and 10
brands, plus 6 hero banners. It is **sample data for a demo storefront** — the
brand names are real, but the products, prices, stock levels and reviews are not;
no public API carries real branded clothing with usable product photography.

Photography is HD from [Unsplash](https://unsplash.com), served from their CDN at
`w=1200&q=80&fm=webp`. Every image was verified to return a real file, and each
product's `colour` is derived from its photo's own alt text, so the colour filter
describes what is actually in the picture. Each product keeps a `photoCredit` link
back to the photographer.

`src/features/catalog/catalogApi.ts` is the single seam to the data. Every export
is async, so pointing it at a real backend means rewriting that one file. The
catalogue loads once per session — `loadProducts` short-circuits when the data is
already in the store, and category switching, filtering and sorting all run
client-side against that copy.

Sizes come from `sizesFor()` in `lib/constants.ts`: waist sizes for jeans, letter
sizes for everything else.

## Theming

Colours are defined once as CSS variables in `src/index.css` and consumed two ways:
Tailwind semantic classes (`bg-surface`, `text-ink`, `border-line`) and Ant Design
tokens in `src/lib/antdTheme.ts`. Dark mode toggles a `dark` class on `<html>`; a
small inline script in `index.html` applies it before first paint so a reload never
flashes white.

## Notes

Authentication and payment are demonstrations. No credentials or card details are
sent anywhere or written to storage — see the comment at the top of
`src/features/auth/authSlice.ts`.
