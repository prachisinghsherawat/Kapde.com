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

Products come from the public [DummyJSON](https://dummyjson.com) API — no key, no
backend to run. `src/features/catalog/catalogApi.ts` is the only module that talks
to it: it fetches the ten fashion categories in parallel and maps the raw payload
onto the `Product` type in `src/types`, reconstructing the pre-discount price so
components never do that arithmetic themselves.

The whole fashion catalogue (49 products) is small enough to load once per session,
so `loadProducts` short-circuits when the data is already in the store and category
switching, filtering and sorting all happen client-side against that one copy.

Sizes are the one thing the API does not carry, so `sizesFor()` in `lib/constants.ts`
is the store's own merchandising layer: letter sizes for apparel, UK sizes for
footwear, one size for everything else.

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
