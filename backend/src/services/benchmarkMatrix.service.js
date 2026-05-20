const fs = require("fs");
const path = require("path");
const BenchmarkMatrixRun = require("../models/BenchmarkMatrixRun.model");
const Order = require("../models/Order.model");
const { average, min, max } = require("../utils/average");
const { toCsv } = require("../utils/csvExporter");
const { extractExplainStats } = require("../utils/extractExplainStats");
const { getModelByCollection } = require("./collection.service");
const { INDEX_STRATEGIES, createIndex } = require("./index.service");

const BENCHMARK_MATRIX = [
  {
    queryKey: "PRODUCTS_CATEGORY",
    queryName: "Products by Category",
    collection: "products",
    filter: { category: "phone" },
    strategies: ["NO_INDEX", "PRODUCT_CATEGORY_SINGLE"]
  },
  {
    queryKey: "PRODUCTS_CATEGORY_SORT_PRICE",
    queryName: "Products by Category Sort Price",
    collection: "products",
    filter: { category: "phone" },
    sort: { price: 1 },
    strategies: ["NO_INDEX", "PRODUCT_CATEGORY_SINGLE", "PRODUCT_PRICE_CATEGORY_WRONG_ORDER", "PRODUCT_CATEGORY_PRICE", "PRODUCT_COVERED_LISTING"]
  },
  {
    queryKey: "PRODUCTS_ESR",
    queryName: "Products ESR Query",
    collection: "products",
    filter: { category: "phone", price: { $gte: 5000000, $lte: 30000000 } },
    sort: { rating: -1 },
    strategies: ["NO_INDEX", "PRODUCT_CATEGORY_SINGLE", "PRODUCT_CATEGORY_PRICE", "PRODUCT_ESR_CATEGORY_RATING_PRICE"]
  },
  {
    queryKey: "ORDERS_USER_HISTORY",
    queryName: "Orders by User History",
    collection: "orders",
    dynamicUser: true,
    sort: { createdAt: -1 },
    strategies: ["NO_INDEX", "ORDER_USER_SINGLE", "ORDER_USER_HISTORY"]
  },
  {
    queryKey: "ORDERS_STATUS_DATE",
    queryName: "Orders by Status and Date",
    collection: "orders",
    filter: { status: "delivered", createdAt: { $gte: new Date("2026-01-01"), $lte: new Date("2026-05-01") } },
    sort: { createdAt: -1 },
    strategies: ["NO_INDEX", "ORDER_STATUS_SINGLE", "ORDER_STATUS_DATE"]
  },
  {
    queryKey: "SHOP_ACTIVE_NEWEST",
    queryName: "Shop Active Newest",
    collection: "products",
    filter: { isActive: true },
    sort: { createdAt: -1 },
    strategies: ["NO_INDEX", "PRODUCT_ACTIVE_NEWEST", "SHOP_ACTIVE_NEWEST"]
  },
  {
    queryKey: "SHOP_TEXT_SEARCH",
    queryName: "Shop Text Search",
    collection: "products",
    filter: { $text: { $search: "iphone apple" } },
    strategies: ["PRODUCT_TEXT_SEARCH"]
  },
  {
    queryKey: "PRODUCTS_COVERED_LISTING",
    queryName: "Covered Product Listing",
    collection: "products",
    filter: { category: "phone" },
    sort: { price: 1 },
    projection: { _id: 0, name: 1, brand: 1, price: 1, rating: 1 },
    strategies: ["NO_INDEX", "PRODUCT_CATEGORY_PRICE", "PRODUCT_COVERED_LISTING"]
  }
];

function findMatrixQuery(queryKey) {
  const query = BENCHMARK_MATRIX.find((item) => item.queryKey === queryKey);
  if (!query) throw new Error(`Unknown matrix query: ${queryKey}`);
  return query;
}

async function resolveMatrixQuery(query) {
  if (!query.dynamicUser) return query;
  const order = await Order.findOne().select("userId").lean();
  return { ...query, filter: { userId: order?.userId } };
}

async function explainMatrixQuery(query, strategyKey, limit) {
  const model = getModelByCollection(query.collection);
  const strategy = INDEX_STRATEGIES[strategyKey];
  let cursor = model.collection.find(query.filter || {}, query.projection ? { projection: query.projection } : undefined);
  if (query.sort) cursor = cursor.sort(query.sort);
  if (limit) cursor = cursor.limit(Number(limit));
  if (strategyKey === "NO_INDEX") cursor = cursor.hint({ $natural: 1 });
  if (strategyKey !== "NO_INDEX" && strategy?.options?.name && !query.filter?.$text) cursor = cursor.hint(strategy.options.name);
  return extractExplainStats(await cursor.explain("executionStats"));
}

async function getIndexSizeMB(collectionName, indexName) {
  if (!indexName) return 0;
  const model = getModelByCollection(collectionName);
  const stats = await model.db.db.command({ collStats: model.collection.collectionName });
  const bytes = stats.indexSizes?.[indexName] || 0;
  return Number((bytes / 1024 / 1024).toFixed(4));
}

function summarizeSamples(samples) {
  const avgReturned = average(samples, "nReturned");
  const avgDocsExamined = average(samples, "totalDocsExamined");
  const avgKeysExamined = average(samples, "totalKeysExamined");
  return {
    avgExecutionTimeMillis: average(samples, "executionTimeMillis"),
    minExecutionTimeMillis: min(samples, "executionTimeMillis"),
    maxExecutionTimeMillis: max(samples, "executionTimeMillis"),
    avgDocsExamined,
    avgKeysExamined,
    avgReturned,
    docsExaminedPerReturned: Number((avgDocsExamined / Math.max(avgReturned, 1)).toFixed(2)),
    keysExaminedPerReturned: Number((avgKeysExamined / Math.max(avgReturned, 1)).toFixed(2))
  };
}

async function runMatrixStrategy({ queryKey, strategyKey, datasetLabel = "30k_products_80k_orders_10k_users", iterations = 5, limit = 500, saveLog = true }) {
  const query = await resolveMatrixQuery(findMatrixQuery(queryKey));
  if (strategyKey !== "NO_INDEX") await createIndex(strategyKey);
  const samples = [];
  for (let index = 0; index < Number(iterations); index += 1) {
    samples.push(await explainMatrixQuery(query, strategyKey, limit));
  }
  const summary = summarizeSamples(samples);
  const last = samples.at(-1) || {};
  const payload = {
    datasetLabel,
    queryKey,
    queryName: query.queryName,
    collectionName: query.collection,
    strategyKey,
    indexName: last.indexName || null,
    stage: last.stage,
    hasSortStage: Boolean(last.hasSortStage),
    isCoveredQuery: Boolean(last.isCoveredQuery),
    iterations: Number(iterations),
    ...summary,
    indexSizeMB: await getIndexSizeMB(query.collection, last.indexName),
    samples: samples.map(({ raw, winningPlan, executionStats, ...sample }) => sample)
  };
  const saved = saveLog ? await BenchmarkMatrixRun.create(payload) : null;
  return { id: saved?._id, ...payload };
}

async function runMatrix({ queryKey = null, strategies = null, datasetLabel = "30k_products_80k_orders_10k_users", iterations = 5, limit = 500, saveLog = true }) {
  const queries = queryKey ? [findMatrixQuery(queryKey)] : BENCHMARK_MATRIX;
  const results = [];
  for (const query of queries) {
    const selectedStrategies = strategies?.length ? strategies : query.strategies;
    let baseline = null;
    for (const strategyKey of selectedStrategies) {
      try {
        const result = await runMatrixStrategy({ queryKey: query.queryKey, strategyKey, datasetLabel, iterations, limit, saveLog });
        if (strategyKey === "NO_INDEX") baseline = result;
        if (baseline && strategyKey !== "NO_INDEX") {
          result.fasterRatio = baseline.avgExecutionTimeMillis > 0 ? Number((baseline.avgExecutionTimeMillis / Math.max(result.avgExecutionTimeMillis, 0.001)).toFixed(2)) : 0;
          result.docsReductionPercent = baseline.avgDocsExamined > 0 ? Number(((1 - result.avgDocsExamined / baseline.avgDocsExamined) * 100).toFixed(2)) : 0;
          if (saveLog && result.id) await BenchmarkMatrixRun.findByIdAndUpdate(result.id, { fasterRatio: result.fasterRatio, docsReductionPercent: result.docsReductionPercent });
        }
        results.push(result);
      } catch (error) {
        results.push({ queryKey: query.queryKey, strategyKey, error: error.message });
      }
    }
  }
  return { datasetLabel, iterations: Number(iterations), results };
}

async function getMatrixHistory(filters = {}) {
  const query = {};
  if (filters.queryKey) query.queryKey = filters.queryKey;
  if (filters.strategyKey) query.strategyKey = filters.strategyKey;
  return BenchmarkMatrixRun.find(query).sort({ createdAt: -1 }).limit(Number(filters.limit || 200)).lean();
}

async function exportExtendedCsv() {
  const rows = await BenchmarkMatrixRun.find().sort({ createdAt: -1 }).lean();
  const columns = ["datasetLabel", "queryKey", "queryName", "strategyKey", "indexName", "stage", "hasSortStage", "isCoveredQuery", "iterations", "avgExecutionTimeMillis", "minExecutionTimeMillis", "maxExecutionTimeMillis", "avgDocsExamined", "avgKeysExamined", "avgReturned", "docsExaminedPerReturned", "keysExaminedPerReturned", "fasterRatio", "docsReductionPercent", "indexSizeMB", "createdAt"];
  const csv = toCsv(rows, columns);
  const reportPath = path.resolve(__dirname, "../../../report/benchmark-results-extended.csv");
  fs.writeFileSync(reportPath, csv, "utf8");
  return csv;
}

module.exports = { BENCHMARK_MATRIX, runMatrix, runMatrixStrategy, getMatrixHistory, exportExtendedCsv };
