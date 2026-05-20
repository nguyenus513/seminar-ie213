const { COLLECTIONS, getModelByCollection } = require("./collection.service");

const INDEX_STRATEGIES = {
  NO_INDEX: {
    name: "No Custom Index Baseline",
    collection: null,
    index: null,
    options: { name: "NO_INDEX" }
  },
  PRODUCT_CATEGORY: {
    name: "Single-field Index on Product Category",
    collection: "products",
    index: { category: 1 },
    options: { name: "idx_product_category" }
  },
  PRODUCT_CATEGORY_SINGLE: {
    name: "Single-field Product Category",
    collection: "products",
    index: { category: 1 },
    options: { name: "idx_product_category" }
  },
  PRODUCT_CATEGORY_PRICE: {
    name: "Compound Product Category Price",
    collection: "products",
    index: { category: 1, price: 1 },
    options: { name: "idx_product_category_price" }
  },
  PRODUCT_ESR: {
    name: "ESR Product Category Rating Price",
    collection: "products",
    index: { category: 1, rating: -1, price: 1 },
    options: { name: "idx_product_category_rating_price" }
  },
  PRODUCT_PRICE_CATEGORY_WRONG_ORDER: {
    name: "Wrong Order Product Price Category",
    collection: "products",
    index: { price: 1, category: 1 },
    options: { name: "idx_product_price_category_wrong_order" }
  },
  PRODUCT_ESR_CATEGORY_RATING_PRICE: {
    name: "ESR Product Category Rating Price",
    collection: "products",
    index: { category: 1, rating: -1, price: 1 },
    options: { name: "idx_product_category_rating_price" }
  },
  PRODUCT_TEXT_SEARCH: {
    name: "Product Text Search",
    collection: "products",
    index: { name: "text", brand: "text", description: "text", tags: "text" },
    options: { name: "idx_product_text_search" }
  },
  PRODUCT_CATEGORY_BRAND_PRICE: {
    name: "Product Category Brand Price",
    collection: "products",
    index: { category: 1, brand: 1, price: 1 },
    options: { name: "idx_product_category_brand_price" }
  },
  PRODUCT_CATEGORY_RATING: {
    name: "Product Category Rating",
    collection: "products",
    index: { category: 1, rating: -1 },
    options: { name: "idx_product_category_rating" }
  },
  PRODUCT_ACTIVE_NEWEST: {
    name: "Active Product Newest",
    collection: "products",
    index: { isActive: 1, createdAt: -1 },
    options: { name: "idx_product_active_newest" }
  },
  PRODUCT_PARTIAL_ACTIVE_CATEGORY_PRICE: {
    name: "Partial Active Product Category Price",
    collection: "products",
    index: { category: 1, price: 1 },
    options: { name: "idx_active_product_category_price", partialFilterExpression: { isActive: true } }
  },
  PRODUCT_COVERED_LISTING: {
    name: "Covered Product Listing",
    collection: "products",
    index: { category: 1, price: 1, name: 1, brand: 1, rating: 1 },
    options: { name: "idx_product_covered_listing" }
  },
  SHOP_ACTIVE_NEWEST: {
    name: "Shop Active Newest",
    collection: "products",
    index: { isActive: 1, createdAt: -1 },
    options: { name: "idx_product_active_newest" }
  },
  ORDER_USER_SINGLE: {
    name: "Single-field Order User",
    collection: "orders",
    index: { userId: 1 },
    options: { name: "idx_order_user_single" }
  },
  ORDER_STATUS_SINGLE: {
    name: "Single-field Order Status",
    collection: "orders",
    index: { status: 1 },
    options: { name: "idx_order_status_single" }
  },
  ORDER_STATUS_DATE: {
    name: "Order Status CreatedAt",
    collection: "orders",
    index: { status: 1, createdAt: -1 },
    options: { name: "idx_order_status_createdAt" }
  },
  ORDER_USER_HISTORY: {
    name: "Order User CreatedAt",
    collection: "orders",
    index: { userId: 1, createdAt: -1 },
    options: { name: "idx_order_user_createdAt" }
  },
  USER_EMAIL_UNIQUE: {
    name: "Unique User Email",
    collection: "users",
    index: { email: 1 },
    options: { name: "idx_user_email_unique", unique: true }
  },
  BENCHMARK_TTL: {
    name: "Benchmark TTL 7 Days",
    collection: "benchmarkruns",
    index: { createdAt: 1 },
    options: { name: "idx_benchmark_ttl", expireAfterSeconds: 604800 }
  }
};

async function createIndex(strategyKey) {
  const strategy = INDEX_STRATEGIES[strategyKey];
  if (!strategy) throw new Error(`Unknown strategyKey: ${strategyKey}`);
  if (strategyKey === "NO_INDEX") return { strategyKey, indexName: null, ...strategy };
  const model = getModelByCollection(strategy.collection);
  const indexName = await model.collection.createIndex(strategy.index, strategy.options);
  return { strategyKey, indexName, ...strategy };
}

async function createAllIndexes() {
  const results = [];
  for (const strategyKey of Object.keys(INDEX_STRATEGIES)) {
    results.push(await createIndex(strategyKey));
  }
  return results;
}

async function listIndexes(collectionName) {
  const model = getModelByCollection(collectionName);
  try {
    return await model.collection.indexes();
  } catch (error) {
    if (error.code === 26 || error.codeName === "NamespaceNotFound") return [];
    throw error;
  }
}

async function listAllIndexes() {
  const entries = await Promise.all(
    Object.keys(COLLECTIONS).map(async (collection) => ({ collection, indexes: await listIndexes(collection) }))
  );
  return entries;
}

async function dropIndex(collectionName, indexName) {
  if (indexName === "_id_") throw new Error("Cannot drop default _id_ index");
  const model = getModelByCollection(collectionName);
  return model.collection.dropIndex(indexName);
}

async function dropAllCustomIndexes() {
  const results = [];
  for (const collection of Object.keys(COLLECTIONS)) {
    const indexes = await listIndexes(collection);
    for (const index of indexes) {
      if (index.name !== "_id_") {
        await dropIndex(collection, index.name);
        results.push({ collection, indexName: index.name, dropped: true });
      }
    }
  }
  return results;
}

module.exports = { INDEX_STRATEGIES, createIndex, createAllIndexes, listIndexes, listAllIndexes, dropIndex, dropAllCustomIndexes };
