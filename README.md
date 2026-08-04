# Kapde

A fashion storefront built with React, TypeScript, Redux Toolkit, Ant Design and
Tailwind CSS. Browse a catalogue by category, filter and sort it, keep a bag and
wishlist that survive a reload, and run through a demo checkout.

## Getting started

Requires **Node.js 24.x**.

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

## Screenshots

> Drop your images in `docs/screenshots/` using the file names below and they
> show up here automatically. Any section you don't have a picture for yet can
> just be deleted.

### Home

<!-- docs/screenshots/home.png -->

![Home](docs/screenshots/home.png)

### Hero carousel

![Hero carousel](docs/screenshots/hero.png)

### Category listing & filters

![Category listing](docs/screenshots/category.png)

### Product detail

![Product detail](docs/screenshots/product.png)

### Search

![Search](docs/screenshots/search.png)

### Bag

![Bag](docs/screenshots/cart.png)

### Wishlist

![Wishlist](docs/screenshots/wishlist.png)

### Checkout

![Checkout](docs/screenshots/checkout.png)

### Login / Signup

![Login](docs/screenshots/login.png)

### Dark mode

![Dark mode](docs/screenshots/dark-mode.png)

<!--
Two pictures side by side (e.g. light vs dark):

| Light | Dark |
| ----- | ---- |
| ![Light](docs/screenshots/home.png) | ![Dark](docs/screenshots/dark-mode.png) |

Control the width with plain HTML:

<img src="docs/screenshots/home.png" width="600" alt="Home" />
-->

## Stack

- **Vite + React 18 + TypeScript** (`strict`), path alias `@/*` → `src/*`
- **Redux Toolkit** for state, **redux-persist** for the bag, wishlist and session
- **Ant Design v5** for components, themed from one token file
- **Tailwind CSS** for layout and styling

Tailwind's Preflight is **off** — antd v5 ships its own reset. Bare
`<button>`/`<input>` elements therefore keep their browser default chrome, so
anything meant to look unstyled has to say so: `appearance-none border-0
bg-transparent p-0`.

## Structure

```
src/
  app/          store, typed hooks
  features/     one folder per domain: slice + selectors (+ api)
  components/   presentational and composed UI, grouped by area
  pages/        one component per route, lazy-loaded
  routes/       route table and the auth guard
  lib/          constants, formatting, antd theme tokens, icons
  types/        shared domain types
docs/
  screenshots/  images used in this README
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

## Data

`src/data/catalog.json` holds 115 products across 7 categories, plus 6 hero
banners. It is sample data for a demo storefront — the brand names are real, the
products and prices are not. Photography is from
[Unsplash](https://unsplash.com), and each product keeps a `photoCredit` link
back to the photographer.

`src/features/catalog/catalogApi.ts` is the only module that touches the JSON, so
pointing the app at a real backend means rewriting that one file.

## Deployment

The build output is `build/`, not `dist/` — set that as the output directory on
the host. On Vercel, `engines.node` in `package.json` pins the runtime.

## Notes

Authentication and payment are demonstrations. No credentials or card details are
sent anywhere or written to storage.
