const { performance } = require("perf_hooks");
const Product = require("../models/Product.model");
const SearchLog = require("../models/SearchLog.model");
const { extractExplainStats } = require("../utils/extractExplainStats");
const { buildProductSearchQuery, buildProductSort } = require("./shopQueryBuilder.service");

async function searchProducts(params, { logSearch = true } = {}) {
  const apiStart = performance.now();
  const page = Math.max(Number(params.page || 1), 1);
  const limit = Math.min(Math.max(Number(params.limit || 20), 1), 100);
  const skip = (page - 1) * limit;
  const filter = buildProductSearchQuery(params);
  const hasTextSearch = Boolean(filter.$text);
  const sort = buildProductSort(params.sort, hasTextSearch);
  const projection = hasTextSearch ? { score: { $meta: "textScore" } } : undefined;

  const countStart = performance.now();
  const totalResults = await Product.countDocuments(filter);
  const countTimeMillis = Math.round(performance.now() - countStart);

  const products = await Product.find(filter, projection).sort(sort).skip(skip).limit(limit).lean();
  const explain = await Product.collection.find(filter, projection ? { projection } : undefined).sort(sort).skip(skip).limit(limit).explain("executionStats");
  const stats = extractExplainStats(explain);
  const apiResponseTimeMs = Math.round(performance.now() - apiStart);
  const performancePayload = {
    apiResponseTimeMs,
    mongoExecutionTimeMillis: stats.executionTimeMillis,
    countTimeMillis,
    stage: stats.stage,
    totalDocsExamined: stats.totalDocsExamined,
    totalKeysExamined: stats.totalKeysExamined,
    nReturned: stats.nReturned,
    indexUsed: stats.indexName
  };
  if (logSearch) {
    await SearchLog.create({
      keyword: params.q || "",
      category: params.category || "all",
      brand: params.brand || "all",
      minPrice: params.minPrice ? Number(params.minPrice) : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
      sort: params.sort || "relevance",
      searchMode: params.searchMode || "text",
      totalResults,
      returned: products.length,
      ...performancePayload
    });
  }
  return {
    data: products,
    pagination: { page, limit, returned: products.length, totalResults, totalPages: Math.ceil(totalResults / limit) },
    performance: performancePayload,
    query: params
  };
}

async function getProductById(id) {
  return Product.findById(id).lean();
}

module.exports = { searchProducts, getProductById };
