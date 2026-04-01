# CityKart Connect (Frontend)

CityKart Connect is a React + TypeScript frontend for a city-based marketplace (browse by city, view products, manage cart, place orders, and vendor dashboard).

## Tech stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query (installed; ready for API integration)
- Vitest + Testing Library

## Requirements

- Node.js 18+ (recommended: Node 20+)
- npm

## Setup

```bash
npm install
npm run dev
```

App runs on `http://localhost:8080`.

## Scripts

- `npm run dev`: dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: ESLint
- `npm run test`: unit tests (Vitest)

## Frontend routes

- `/`: Landing (choose a city)
- `/auth`: Sign in / Register
- `/products`: Product listing (requires selected city)
- `/product/:id`: Product detail
- `/cart`: Cart
- `/orders`: Orders
- `/vendor`: Vendor dashboard (vendor-only)
- `*`: Not found

## Environment variables

Create a `.env` file (or set env vars in your host):

- `VITE_API_BASE_URL`: Backend base URL (example: `http://localhost:3000`)

The current UI uses mock data (`src/features/marketplace/data/mock.ts`). To connect the backend, replace mock reads/writes with API calls (TanStack Query is configured in `src/app/query-client.ts` and mounted in `src/app/providers/AppProviders.tsx`).

## Project structure (scalable)

```txt
src/
  app/                      # app shell: providers + router + query client
    App.tsx
    query-client.ts
    providers/
      AppProviders.tsx
    router/
      AppRouter.tsx
      NotFoundRoute.tsx

  features/                 # feature modules (routes + state + api + types)
    auth/
      auth-context.tsx
      routes/
        AuthRoute.tsx
    cart/
      cart-context.tsx
      routes/
        CartRoute.tsx
    marketplace/
      city-context.tsx
      types.ts
      data/
        mock.ts
      routes/
        LandingRoute.tsx
        ProductsRoute.tsx
        ProductDetailRoute.tsx
    orders/
      routes/
        OrdersRoute.tsx
    vendor/
      routes/
        VendorDashboardRoute.tsx

  shared/
    components/             # reusable, app-wide components
      Header.tsx
      ProductCard.tsx
      NavLink.tsx

  components/ui/            # shadcn/ui primitives (kept together)
  hooks/                    # legacy shared hooks (used by shadcn)
  lib/                      # shared utilities (cn)
```

## Backend API contract (routes to implement)

This section describes the minimum backend surface area needed to fully support the current UI. Paths below are prefixed with your base URL (e.g. `VITE_API_BASE_URL`).

### Auth

- `POST /auth/register`
  - Body: `{ "name": string, "email": string, "password": string, "role": "buyer" | "vendor" }`
  - Response: `{ "user": { "id": string, "name": string, "email": string, "role": "buyer" | "vendor" }, "token"?: string }`
- `POST /auth/login`
  - Body: `{ "email": string, "password": string }`
  - Response: `{ "user": { ... }, "token"?: string }`
- `POST /auth/logout` (optional if using stateless JWT)
- `GET /auth/me`
  - Response: `{ "user": { ... } }`

Auth can be implemented using:
- **Cookie-based sessions** (recommended for web apps), or
- **JWT** returned from login/register and stored client-side.

### Cities & shops

- `GET /cities`
  - Response: `{ "cities": Array<{ "id": string, "name": string, "state": string, "image"?: string, "shopCount"?: number }> }`
- `GET /cities/:cityId/shops`
  - Response: `{ "shops": Array<{ "id": string, "name": string, "cityId": string, "description"?: string, "image"?: string, "rating"?: number, "vendorId"?: string }> }`

### Products

- `GET /products?cityId=...&search=...&category=...&page=...&limit=...`
  - Response: `{ "items": Product[], "page": number, "total": number }`
- `GET /products/:productId`
  - Response: `{ "product": Product }`

`Product` shape expected by UI today:

```ts
type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  shopId: string;
  cityId: string;
  rating?: number;
  inStock: boolean;
};
```

### Cart

If you want a server-backed cart (recommended for multi-device), implement:

- `GET /cart`
  - Response: `{ "items": Array<{ "product": Product, "quantity": number }> }`
- `POST /cart/items`
  - Body: `{ "productId": string, "quantity"?: number }`
- `PATCH /cart/items/:productId`
  - Body: `{ "quantity": number }`
- `DELETE /cart/items/:productId`
- `DELETE /cart` (clear cart)

If you prefer client-only cart, you can skip these routes and store cart in localStorage; the UI currently keeps cart in memory.

### Orders

- `POST /orders`
  - Body: `{ "items": Array<{ "productId": string, "quantity": number }>, "cityId": string }`
  - Response: `{ "order": { "id": string, "status": string, "total": number, "createdAt": string, "items": ... } }`
- `GET /orders`
  - Response: `{ "orders": Order[] }`
- `GET /orders/:orderId` (optional)

### Vendor (vendor-only)

- `GET /vendor/products`
- `POST /vendor/products`
  - Body: `{ "name": string, "price": number, "category": string, "description"?: string, "status"?: "active" | "draft" }`
- `PATCH /vendor/products/:productId`
- `DELETE /vendor/products/:productId`

## Notes

- The current auth/cart/vendor flows are mock implementations in feature contexts under `src/features/*/*-context.tsx`. They’re good placeholders while the backend is built.
