const Order = require("../models/Order.model");

const QUERY_CATALOG = {
  PRODUCTS_BY_CATEGORY: {
    label: "Products by Category",
    collection: "products",
    filter: { category: "phone" },
    sort: null,
    recommendedStrategy: "PRODUCT_CATEGORY"
  },
  PRODUCTS_BY_CATEGORY_SORT_PRICE: {
    label: "Products by Category Sort Price",
    collection: "products",
    filter: { category: "phone" },
    sort: { price: 1 },
    recommendedStrategy: "PRODUCT_CATEGORY_PRICE"
  },
  PRODUCTS_ESR: {
    label: "Products ESR Query",
    collection: "products",
    filter: { category: "phone", price: { $gte: 5000000, $lte: 30000000 } },
    sort: { rating: -1 },
    recommendedStrategy: "PRODUCT_ESR"
  },
  ORDERS_BY_STATUS_DATE: {
    label: "Orders by Status and Date",
    collection: "orders",
    filter: {
      status: "delivered",
      createdAt: { $gte: new Date("2026-01-01"), $lte: new Date("2026-05-01") }
    },
    sort: { createdAt: -1 },
    recommendedStrategy: "ORDER_STATUS_DATE"
  },
  ORDERS_BY_USER_HISTORY: {
    label: "Orders by User History",
    collection: "orders",
    dynamic: true,
    sort: { createdAt: -1 },
    recommendedStrategy: "ORDER_USER_HISTORY"
  },
  PRODUCTS_TEXT_SEARCH: {
    label: "Products Text Search",
    collection: "products",
    filter: { $text: { $search: "iphone apple" } },
    sort: null,
    recommendedStrategy: "PRODUCT_TEXT_SEARCH"
  },
  SHOP_CATEGORY_PRICE_SORT: {
    label: "Shop Category Price Sort",
    collection: "products",
    filter: { isActive: true, category: "phone", price: { $gte: 5000000, $lte: 30000000 } },
    sort: { price: 1 },
    recommendedStrategy: "PRODUCT_CATEGORY_PRICE"
  },
  SHOP_CATEGORY_BRAND_PRICE_SORT: {
    label: "Shop Category Brand Price Sort",
    collection: "products",
    filter: { isActive: true, category: "phone", brand: "Apple" },
    sort: { price: 1 },
    recommendedStrategy: "PRODUCT_CATEGORY_BRAND_PRICE"
  },
  SHOP_CATEGORY_RATING_SORT: {
    label: "Shop Category Rating Sort",
    collection: "products",
    filter: { isActive: true, category: "laptop" },
    sort: { rating: -1 },
    recommendedStrategy: "PRODUCT_CATEGORY_RATING"
  },
  SHOP_ACTIVE_NEWEST: {
    label: "Shop Active Newest",
    collection: "products",
    filter: { isActive: true },
    sort: { createdAt: -1 },
    recommendedStrategy: "PRODUCT_ACTIVE_NEWEST"
  }
};

async function resolveQueryConfig(queryKey) {
  const config = QUERY_CATALOG[queryKey];
  if (!config) throw new Error(`Unknown queryKey: ${queryKey}`);
  if (queryKey !== "ORDERS_BY_USER_HISTORY") return config;
  const order = await Order.findOne().select("userId").lean();
  return { ...config, filter: { userId: order?.userId } };
}

module.exports = { QUERY_CATALOG, resolveQueryConfig };
