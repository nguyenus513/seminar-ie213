const BenchmarkRun = require("../models/BenchmarkRun.model");
const { average, min, max } = require("../utils/average");
const { resolveQueryConfig, QUERY_CATALOG } = require("./queryCatalog.service");
const { INDEX_STRATEGIES, createIndex } = require("./index.service");
const { explainQuery } = require("./explain.service");

function hasTextSearch(filter = {}) {
  return Boolean(filter.$text);
}

async function resolveBenchmarkStrategy({ queryConfig, strategyKey }) {
  const strategy = INDEX_STRATEGIES[strategyKey];
  const usesTextSearch = hasTextSearch(queryConfig.filter);

  if (strategyKey === "NO_INDEX") {
    if (usesTextSearch) {
      throw new Error("NO_INDEX baseline cannot run for $text queries because MongoDB requires a text index. Use a regex/shop baseline or another non-$text benchmark query.");
    }
    return { strategy, hint: { $natural: 1 }, forcedNoIndex: true };
  }

  if (!strategy || !strategy.collection) return { strategy, hint: null, forcedNoIndex: false };

  await createIndex(strategyKey);
  return {
    strategy,
    hint: usesTextSearch ? null : strategy.options?.name,
    forcedNoIndex: false
  };
}

async function runBenchmark({ queryKey, strategyKey = "NO_INDEX", mode = "custom", iterations = 5, limit = 500, saveLog = true }) {
  const queryConfig = await resolveQueryConfig(queryKey);
  const { strategy, hint, forcedNoIndex } = await resolveBenchmarkStrategy({ queryConfig, strategyKey });
  const samples = [];
  for (let index = 0; index < Number(iterations); index += 1) {
    samples.push(
      await explainQuery({
        collection: queryConfig.collection,
        filter: queryConfig.filter,
        sort: queryConfig.sort,
        limit,
        hint
      })
    );
  }
  const summary = {
    avgExecutionTimeMillis: average(samples, "executionTimeMillis"),
    minExecutionTimeMillis: min(samples, "executionTimeMillis"),
    maxExecutionTimeMillis: max(samples, "executionTimeMillis"),
    avgDocsExamined: average(samples, "totalDocsExamined"),
    avgKeysExamined: average(samples, "totalKeysExamined"),
    avgReturned: average(samples, "nReturned"),
    stage: samples.at(-1)?.stage || null
  };
  const payload = {
    queryKey,
    queryName: queryConfig.label,
    collectionName: queryConfig.collection,
    indexStrategy: strategyKey,
    strategyName: strategy?.name || strategyKey,
    mode,
    iterations: Number(iterations),
    forcedNoIndex,
    forcedHint: hint,
    ...summary,
    samples: samples.map(({ raw, ...sample }) => sample),
    rawExplain: samples.at(-1)?.raw || null
  };
  const saved = saveLog ? await BenchmarkRun.create(payload) : null;
  return { ...payload, id: saved?._id, summary };
}

async function runAllBenchmarks({ iterations = 5, limit = 500, mode = "custom", saveLog = true }) {
  const results = [];
  for (const [queryKey, config] of Object.entries(QUERY_CATALOG)) {
    try {
      const strategyKey = mode === "baseline" ? "NO_INDEX" : config.recommendedStrategy || "NO_INDEX";
      results.push(await runBenchmark({ queryKey, strategyKey, mode, iterations, limit, saveLog }));
    } catch (error) {
      results.push({ queryKey, queryName: config.label, collectionName: config.collection, error: error.message });
    }
  }
  return results;
}

async function getHistory(filters = {}) {
  const query = {};
  if (filters.queryKey) query.queryKey = filters.queryKey;
  if (filters.strategyKey) query.indexStrategy = filters.strategyKey;
  return BenchmarkRun.find(query).sort({ createdAt: -1 }).limit(Number(filters.limit || 100)).lean();
}

async function compareLatest() {
  const queryKeys = Object.keys(QUERY_CATALOG);
  const comparisons = [];
  for (const queryKey of queryKeys) {
    const recommendedStrategy = QUERY_CATALOG[queryKey].recommendedStrategy;
    const baseline = await BenchmarkRun.findOne({ queryKey, indexStrategy: "NO_INDEX" }).sort({ createdAt: -1 }).lean();
    const optimized = await BenchmarkRun.findOne({ queryKey, indexStrategy: recommendedStrategy }).sort({ createdAt: -1 }).lean();
    if (baseline && optimized) {
      const fasterRatio = optimized.avgExecutionTimeMillis > 0 ? baseline.avgExecutionTimeMillis / optimized.avgExecutionTimeMillis : 0;
      const docsReductionPercent = baseline.avgDocsExamined > 0 ? (1 - optimized.avgDocsExamined / baseline.avgDocsExamined) * 100 : 0;
      comparisons.push({
        queryKey,
        queryName: QUERY_CATALOG[queryKey].label,
        baseline,
        optimized,
        improvement: {
          fasterRatio: Number(fasterRatio.toFixed(2)),
          docsReductionPercent: Number(docsReductionPercent.toFixed(2))
        }
      });
    }
  }
  return comparisons;
}

module.exports = { runBenchmark, runAllBenchmarks, getHistory, compareLatest };
