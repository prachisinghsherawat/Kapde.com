# Kapde

A demo fashion storefront built with **React, TypeScript, Redux Toolkit, Ant Design and Tailwind CSS**.
Browse a catalogue, filter and sort it, keep a bag and wishlist that survive a reload, and run
through a demo checkout.

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

| Hero carousel | Home |
| ------------- | ---- |
| ![Hero carousel](https://github.com/user-attachments/assets/6016fba3-a0e5-4715-87de-b5a2badd6c15) | ![Home](https://github.com/user-attachments/assets/209790f9-0ed3-416e-82d9-b990328cca5a) |

| Category listing & filters | Product detail |
| -------------------------- | -------------- |
| ![Category listing and filters](https://github.com/user-attachments/assets/142d1e1e-2d87-47dc-9a0a-2552546397f1) | ![Product detail](https://github.com/user-attachments/assets/afaae241-d50a-4241-9f22-26b1dbe25869) |

| Search | Bag |
| ------ | --- |
| ![Search](https://github.com/user-attachments/assets/c24c6553-70f7-4ab3-b07b-2035105b0df3) | ![Bag](https://github.com/user-attachments/assets/2a68ff09-04bb-4f9b-b6ee-f4a1a4d8b2ab) |

| Wishlist | Checkout |
| -------- | -------- |
| ![Wishlist](https://github.com/user-attachments/assets/02bdea8e-3d77-4847-bd2b-0493c7cc4028) | ![Checkout](https://github.com/user-attachments/assets/a5823d85-c277-41ae-b07e-fd4640387608) |

| Login / Signup | Light mode |
| -------------- | ---------- |
| ![Login and signup](https://github.com/user-attachments/assets/fb4322f8-87dd-4218-8dff-035225f1b2d1) | ![Light mode](https://github.com/user-attachments/assets/0506eb06-94ac-42a1-930a-555b1cc60cc6) |

## Stack

- **Vite + React 18 + TypeScript** (`strict`), path alias `@/*` → `src/*`
- **Redux Toolkit** for state, **redux-persist** for the bag, wishlist and session
- **Ant Design v5**, themed from one token file (light + dark)
- **Tailwind CSS** for layout and styling

> Tailwind's Preflight is **off** — antd v5 ships its own reset. Anything meant to look unstyled
> has to say so: `appearance-none border-0 bg-transparent p-0`.

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
  data/         catalog.json — sample catalogue and hero banners
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

`src/data/catalog.json` holds 115 products across 7 categories plus 6 hero banners. Brand names are
real, products and prices are not. `src/features/catalog/catalogApi.ts` is the only module that
touches the JSON, so swapping in a real backend means rewriting that one file.

## Deployment

Build output is `build/`, not `dist/` — set that as the output directory on the host. On Vercel,
`engines.node` in `package.json` pins the runtime.

Auth and payment are demonstrations only. No credentials or card details are sent anywhere.
