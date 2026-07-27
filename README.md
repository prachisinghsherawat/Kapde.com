# Kapde

A fashion storefront built with React, TypeScript, Redux Toolkit, Ant Design and
Tailwind CSS. Browse a catalogue by category, filter and sort it, keep a bag and
wishlist that survive a reload, and run through a demo checkout.

## Getting started

Requires **Node.js 24.x** (declared in `engines`).

```bash
npm install
npm run dev    
```

| Script              | What it does                      |
| ------------------- | --------------------------------- |
| `npm run dev`       | Vite dev server with HMR          |
| `npm run build`     | Typecheck, then build to `build/` |
| `npm run preview`   | Serve the production build        |
| `npm run typecheck` | `tsc --noEmit`                    |

`npm run build` runs `tsc --noEmit` first, so a type error fails the build rather
than shipping.

## Stack

- **Vite + React 18 + TypeScript** (`strict`), path alias `@/*` → `src/*`
- **Redux Toolkit** for state, **redux-persist** for the bag, wishlist and session
- **Ant Design v5** for components, themed from one token file
- **Tailwind CSS** for layout and styling

Tailwind's Preflight is **off** (`tailwind.config.ts`) — antd v5 ships its own
reset, and stacking Preflight on top of it strips the styling from antd Buttons and
form controls. The trade-off is that bare `<button>`/`<input>` elements keep their
browser default chrome, so anything meant to look unstyled has to say so
explicitly: `appearance-none border-0 bg-transparent p-0` (see `iconButtonClass` in
`components/layout/Navbar.tsx`).

## Structure

```
src/
  app/          store, typed hooks
  features/     one folder per domain: slice + selectors (+ api)
                auth · cart · catalog · ui · wishlist
  components/   presentational and composed UI, grouped by area
                auth · cart · catalog · checkout · common · home · layout · product
  pages/        one component per route, lazy-loaded
  routes/       route table and the auth guard
  lib/          constants, formatting, antd theme tokens, icons
  types/        shared domain types
```

## Routes

| Path                | Page                                           |
| ------------------- | ---------------------------------------------- |
| `/`                 | Home — hero carousel, category grid, markdowns |
| `/c/:category`      | Category listing; unknown slugs → 404          |
| `/search?q=`        | Search across title, brand, colour and tags    |
| `/product/:id`      | Product detail                                 |
| `/cart`             | Bag                                            |
| `/wishlist`         | Wishlist                                       |
| `/checkout`         | Demo checkout — **requires a session**         |
| `/order-confirmed`  | Order success                                  |
| `/login`, `/signup` | Demo auth                                      |

Every page is `lazy()`-loaded behind a `Suspense` fallback. `/checkout` is wrapped
in `RequireAuth`, which redirects to `/login`. A block of legacy redirects
(`/tops`, `/kurtis`, `/frocks`, `/middis`, `/denims`, `/jackets`) maps paths from an
earlier version of the site onto current categories.

## Data

`src/data/catalog.json` holds **115 products across 7 categories**, 10 brands and
12 colours, plus 6 hero banners.

| Category            | Products |
| ------------------- | -------: |
| Dresses             |       26 |
| Jackets & Coats     |       25 |
| Jeans               |       18 |
| Knitwear & Sweaters |       16 |
| Shirts              |       14 |
| T-Shirts            |       10 |
| Co-ord Sets         |        6 |

It is **sample data for a demo storefront** — the brand names are real, but the
products, prices, stock levels and reviews are not; no public API carries real
branded clothing with usable product photography.

Each product carries `price`/`mrp`/`discount` (in ₹, from ₹1,099 to ₹15,799),
`stock` with a matching `availability` (`0` → Out of Stock, `≤5` → Low Stock), a
`rating`, and two to four reviews. IDs double as the recency signal: the *Newest*
sort is `b.id - a.id`, so a higher ID reads as newer.

Photography is from [Unsplash](https://unsplash.com), served from their CDN with
sizing in the query string — `?q=80&w=1200&auto=format&fit=crop` for products, a
2000×1000 `fm=webp` crop for banners. Each product's `colour` is derived from its
own photo, so the colour filter describes what is actually in the picture, and each
keeps a `photoCredit` link back to the photographer.

### The data seam

`src/features/catalog/catalogApi.ts` is the only module that touches the JSON.
Every export is async and accepts an optional `AbortSignal` (behind a 300 ms
simulated latency), so pointing the app at a real backend means rewriting that one
file.

The catalogue loads once per session — `loadProducts` is a thunk whose `condition`
short-circuits when the data is already loaded or in flight. Category switching,
filtering, sorting, search and pagination (`PAGE_SIZE = 8`) all run client-side
against that single copy, composed through memoised selectors in `catalogSlice.ts`.

Filters are brand, colour, size, max price, minimum rating and in-stock-only. Facet
counts are computed from the products currently in scope, so an option that would
return nothing is never offered.

Sizes come from `sizesFor()` in `lib/constants.ts` — currently one letter scale
(XS–XXL) for every category. It still takes the category, so a per-category scale
stays easy to reintroduce.

## State and persistence

Five slices: `auth`, `cart`, `catalog`, `ui`, `wishlist`.

Only `cart`, `wishlist` and `auth` are persisted (key `kapde`, localStorage).
`catalog` is refetched on mount, and `ui` owns a separate key (`kapde:ui`) so the
theme can be read before React starts. The persist config carries a `migrate` step
that **drops any stored blob that is not today's shape**, so a payload written by an
older build can't rehydrate into a selector expecting `cart.lines` or
`wishlist.items` to be arrays.

## Theming

Colours are defined once as CSS variables in `src/index.css` and consumed two ways:
Tailwind semantic classes (`bg-surface`, `text-ink`, `border-line`) and Ant Design
tokens in `src/lib/antdTheme.ts`. Dark mode toggles a `dark` class on `<html>`; a
small inline script in `index.html` applies it before first paint so a reload never
flashes white.

## Deployment

The build output is `build/`, not `dist/` — set that as the output directory on the
host. Vendor code is split into `react` and `antd` chunks in `vite.config.ts`. On
Vercel, `engines.node` in `package.json` pins the runtime and takes precedence over
the dashboard's Node.js version setting.

## Notes

Authentication and payment are demonstrations. No credentials or card details are
sent anywhere or written to storage — the session is built locally from the
submitted identity, and the password never reaches the store or localStorage. See
the comment at the top of `src/features/auth/authSlice.ts`; swapping `authenticate`
for a real `POST /login` is the only change needed to make it genuine.
