# Realtime Product Dashboard – Backend

This is the API that the frontend talks to. It:

- Logs in a single demo user and sets a JWT in an HTTP‑only cookie.
- Exposes CRUD endpoints for products (plus a separate `status` toggle).
- Computes a small analytics summary used on the `/analytics` page.

Everything is written in TypeScript on top of Express and Firestore.

---

## Running the backend

From the `backend` folder:

```bash
npm install
npm run dev
```

By default the server listens on `http://localhost:4000` and the API base URL is `http://localhost:4000/api`.

The frontend expects this value (or whatever you configure in `NEXT_PUBLIC_API_BASE_URL`).

---

## Configuration

Create a `.env` file in `backend/` with at least:

```bash
PORT=4000

JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The Firebase values come from a service account key for the Firestore project you want to use.

`FIREBASE_PRIVATE_KEY` must keep the `\n` characters – they represent the newlines inside the key.

---

## Demo user

Credentials are hard‑coded in `src/modules/auth/auth.service.ts`:

- **Email:** `admin@example.com`
- **Password:** `Admin@123`

---

## API sketch

All routes are mounted under `/api`.

Auth:

- `POST /api/auth/login` – logs in the demo user and sets the cookie.
- `GET /api/auth/me` – returns the current user (or 401).
- `POST /api/auth/logout` – clears the cookie.

Products (all require auth):

- `GET /api/products` – list products ordered by `createdAt desc`.
- `POST /api/products` – create a product.
- `PUT /api/products/:id` – update a product.
- `PATCH /api/products/:id/status` – change only the status.
- `DELETE /api/products/:id` – delete a product.

Analytics (requires auth):

- `GET /api/analytics/overview` – totals, products by status, products by category.

---

## Tests

There are a couple of Jest + Supertest tests under `tests/`:

- `analytics.test.ts` – checks the analytics overview endpoint and auth guard.
- `products.test.ts` – runs a full products flow: list → create → update → change status → delete.

Run them with:

```bash
npm test
```

Make sure your `.env` is set up and Firestore is reachable before running the tests.

## 3. Environment Variables

Create a `.env` file in `backend/` with the following variables:

```bash
PORT=4000

# JWT
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Firebase Admin service account
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
```

Notes:

- `FIREBASE_PRIVATE_KEY` must keep the `\n` newlines escaped when stored in `.env`.
- These values must match the Firebase project used by the frontend.

---

## 4. Installation & Running Locally

From the `backend/` directory:

```bash
npm install

# development
npm run dev
```

The API will run on `http://localhost:4000` by default.

---

## 5. API Overview

Base path: `/api`

### Auth

- `POST /api/auth/login`
  - Body: `{ "email": string, "password": string }`
  - On success, sets an HTTP‑only `token` cookie and returns user info.

- `GET /api/auth/me`
  - Requires valid `token` cookie.
  - Returns the current demo user.

- `POST /api/auth/logout`
  - Clears the auth cookie.

The demo credentials are, by default:

- **Email:** `admin@example.com`
- **Password:** `password123`

> If you change them, also update the frontend README.

### Products

All products routes are under `/api/products` and require authentication.

- `GET /api/products`
  - Returns list of products ordered by `createdAt desc`.

- `POST /api/products`
  - Body: `{ name, price, status?, category?, stock? }`
  - Validated with Zod; inserts into Firestore.

- `PATCH /api/products/:id`
  - Updates product fields; also updates `updatedAt`.

- `DELETE /api/products/:id`
  - Deletes the product from Firestore.

- `PATCH /api/products/:id/status`
  - Body: `{ status: "active" | "inactive" }`.

### Analytics

- `GET /api/analytics/overview`
  - Returns aggregate analytics data used by the frontend, including:
    - Total inventory value
    - Products by status
    - Products by category

---

## 6. Firestore Data Model

Collection: `products`

Each document:

```json
{
  "name": "Product name",
  "price": 100,
  "status": "active" | "inactive",
  "category": "Category name" | null,
  "stock": 3,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

The backend always reads products ordered by `createdAt` descending.

---

## 7. Testing

From the `backend/` directory:

```bash
npm test
```

This runs Jest tests (including analytics endpoint tests using Supertest).

> Make sure your `.env` is configured and Firestore is reachable before running tests.

---

## 8. Deployment Notes

You can deploy this backend to any Node‑capable host (Render, Railway, Fly.io, etc.).

Important points:

- Set all environment variables from **section 3** in the hosting provider.
- Ensure the `FIREBASE_PRIVATE_KEY` is formatted correctly (escaped newlines if needed).
- Configure CORS and cookie options (domain, `SameSite`, `secure`) so the frontend can send and receive the auth cookie from its origin.

---

## 9. Frontend Integration

The frontend expects the base API URL to be:

```bash
http://localhost:4000/api
```

or, in production, whatever you set as `NEXT_PUBLIC_API_BASE_URL` in the frontend `.env.local`.

Once both backend and frontend are running, you can:

- Login at `/login` with the demo user.
- Manage products at `/products`.
- View analytics at `/analytics`.
