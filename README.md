# MERN E-commerce Search Benchmark Dashboard

Strict MERN seminar project: MongoDB + Express.js + React Vite + Node.js.

The app demonstrates MongoDB query optimization with indexing and `explain("executionStats")` through a real e-commerce search UI plus benchmark dashboards.

## Features

- E-commerce `/shop` page with keyword search, filters, sort, product grid, product detail, and localStorage cart demo.
- Search stats like Google: total results, API time, MongoDB execution time, stage, docs examined, keys examined, returned docs, index name.
- MongoDB index management dashboard: create/list/drop strategies, including single-field, compound, text, partial, TTL, and unique indexes.
- Benchmark dashboard: run query catalog multiple iterations and save `BenchmarkRun` documents.
- Compare dashboard: baseline vs optimized, faster ratio, docs reduction percent.
- Explain plan viewer: raw `winningPlan` and `executionStats` from MongoDB.
- Dataset seed/clear dashboard and CLI scripts.

## Requirements

- Node.js 20+
- Docker Desktop
- npm

## Run MongoDB

```bash
docker compose up -d
```

## Install dependencies

```bash
npm install
npm run install:all
```

## Configure backend

```bash
copy backend\.env.example backend\.env
```

Important baseline setting:

```env
MONGOOSE_AUTO_INDEX=false
```

## Run app

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api/health`

## Demo flow

1. Open `/dataset`, click `Seed Medium`.
2. Open `/indexes`, click `Drop All Custom`.
3. Open `/shop`, search `iphone` with `regex` mode to show baseline-style query.
4. Open `/benchmark`, run `PRODUCTS_BY_CATEGORY` with `NO_INDEX` and mode `baseline`.
5. Open `/indexes`, create recommended indexes such as `PRODUCT_CATEGORY`, `PRODUCT_TEXT_SEARCH`, `PRODUCT_CATEGORY_PRICE`.
6. Open `/shop`, switch to `text` mode, search again and inspect `IXSCAN`/index metrics.
7. Open `/benchmark`, rerun optimized query with recommended strategy.
8. Open `/compare` and `/explain/PRODUCTS_BY_CATEGORY` for report evidence.

## Backend scripts

```bash
npm --prefix backend run seed
npm --prefix backend run clear
npm --prefix backend run index:create
npm --prefix backend run index:drop
npm --prefix backend run benchmark:baseline
npm --prefix backend run benchmark:optimized
```

## Default seed size

- Products: 30,000
- Orders: 80,000
- Users: 10,000

Use `POST /api/seed` to pass custom counts:

```json
{
  "products": 100000,
  "orders": 300000,
  "users": 50000
}
```

## Strict MERN boundary

- MongoDB stores all app, search, benchmark, and execution-plan data.
- Express exposes REST APIs only.
- React Vite is the frontend SPA.
- Node.js runs backend and CLI scripts.
- No Next.js, SSR, GraphQL, Prisma, Kafka, Redis, or Kubernetes.
