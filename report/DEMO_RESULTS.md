# Demo Benchmark Results

## Dataset

| Collection | Documents |
|---|---:|
| products | 30000 |
| orders | 80000 |
| users | 10000 |

## Benchmark Comparison

| Query | Before Stage | After Stage | Before ms | After ms | Faster | Before Docs | After Docs | Docs Reduced |
|---|---|---|---|---|---|---|---|---|
| PRODUCTS_BY_CATEGORY | COLLSCAN | FETCH+IXSCAN | 1.4 | 10 | 0.14x | 1244 | 500 | 59.81% |
| PRODUCTS_BY_CATEGORY_SORT_PRICE | SORT | FETCH+IXSCAN | 28.2 | 2.8 | 10.07x | 30000 | 500 | 98.33% |
| PRODUCTS_ESR | SORT | FETCH+IXSCAN | 36.2 | 5 | 7.24x | 30000 | 500 | 98.33% |
| ORDERS_BY_STATUS_DATE | SORT | FETCH+IXSCAN | 124.8 | 3.6 | 34.67x | 80000 | 500 | 99.38% |
| ORDERS_BY_USER_HISTORY | SORT | FETCH+IXSCAN | 90.8 | 0.4 | 227x | 80000 | 7 | 99.99% |
| SHOP_CATEGORY_PRICE_SORT | SORT | FETCH+IXSCAN | 80.2 | 6.4 | 12.53x | 30000 | 500 | 98.33% |
| SHOP_CATEGORY_BRAND_PRICE_SORT | SORT | FETCH+IXSCAN | 38.8 | 6.4 | 6.06x | 30000 | 533 | 98.22% |
| SHOP_CATEGORY_RATING_SORT | SORT | FETCH+IXSCAN | 35 | 8.4 | 4.17x | 30000 | 553 | 98.16% |
| SHOP_ACTIVE_NEWEST | SORT | FETCH+IXSCAN | 79.8 | 2 | 39.9x | 30000 | 500 | 98.33% |

## Raw Benchmark Runs

| Query | Mode | Strategy | Stage | Avg Time ms | Docs Examined | Keys Examined | Returned |
|---|---|---|---|---:|---:|---:|---:|
| PRODUCTS_BY_CATEGORY | baseline | PRODUCT_CATEGORY | COLLSCAN | 1.4 | 1244 | 0 | 500 |
| PRODUCTS_BY_CATEGORY | optimized | PRODUCT_CATEGORY | FETCH+IXSCAN | 10 | 500 | 500 | 500 |
| PRODUCTS_BY_CATEGORY_SORT_PRICE | baseline | PRODUCT_CATEGORY_PRICE | SORT | 28.2 | 30000 | 0 | 500 |
| PRODUCTS_BY_CATEGORY_SORT_PRICE | optimized | PRODUCT_CATEGORY_PRICE | FETCH+IXSCAN | 2.8 | 500 | 500 | 500 |
| PRODUCTS_ESR | baseline | PRODUCT_ESR | SORT | 36.2 | 30000 | 0 | 500 |
| PRODUCTS_ESR | optimized | PRODUCT_ESR | FETCH+IXSCAN | 5 | 500 | 505 | 500 |
| ORDERS_BY_STATUS_DATE | baseline | ORDER_STATUS_DATE | SORT | 124.8 | 80000 | 0 | 500 |
| ORDERS_BY_STATUS_DATE | optimized | ORDER_STATUS_DATE | FETCH+IXSCAN | 3.6 | 500 | 500 | 500 |
| ORDERS_BY_USER_HISTORY | baseline | ORDER_USER_HISTORY | SORT | 90.8 | 80000 | 0 | 7 |
| ORDERS_BY_USER_HISTORY | optimized | ORDER_USER_HISTORY | FETCH+IXSCAN | 0.4 | 7 | 7 | 7 |
| PRODUCTS_TEXT_SEARCH | optimized | PRODUCT_TEXT_SEARCH | TEXT_MATCH+IXSCAN | 3 | 500 | 500 | 500 |
| SHOP_CATEGORY_PRICE_SORT | baseline | PRODUCT_CATEGORY_PRICE | SORT | 80.2 | 30000 | 0 | 500 |
| SHOP_CATEGORY_PRICE_SORT | optimized | PRODUCT_CATEGORY_PRICE | FETCH+IXSCAN | 6.4 | 500 | 500 | 500 |
| SHOP_CATEGORY_BRAND_PRICE_SORT | baseline | PRODUCT_CATEGORY_BRAND_PRICE | SORT | 38.8 | 30000 | 0 | 500 |
| SHOP_CATEGORY_BRAND_PRICE_SORT | optimized | PRODUCT_CATEGORY_BRAND_PRICE | FETCH+IXSCAN | 6.4 | 533 | 533 | 500 |
| SHOP_CATEGORY_RATING_SORT | baseline | PRODUCT_CATEGORY_RATING | SORT | 35 | 30000 | 0 | 500 |
| SHOP_CATEGORY_RATING_SORT | optimized | PRODUCT_CATEGORY_RATING | FETCH+IXSCAN | 8.4 | 553 | 553 | 500 |
| SHOP_ACTIVE_NEWEST | baseline | PRODUCT_ACTIVE_NEWEST | SORT | 79.8 | 30000 | 0 | 500 |
| SHOP_ACTIVE_NEWEST | optimized | PRODUCT_ACTIVE_NEWEST | FETCH+IXSCAN | 2 | 500 | 500 | 500 |

## Current Indexes

| Collection | Indexes |
|---|---|
| products | _id_, idx_product_category, idx_product_category_price, idx_product_category_rating_price, idx_product_text_search, idx_product_category_brand_price, idx_product_category_rating, idx_product_active_newest, idx_active_product_category_price |
| orders | _id_, idx_order_status_createdAt, idx_order_user_createdAt |
| users | _id_, idx_user_email_unique |
| benchmarkruns | _id_, idx_benchmark_ttl |
| searchlogs | _id_ |

Generated at: 2026-05-07T08:21:30.315Z
