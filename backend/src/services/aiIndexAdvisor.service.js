const AIRecommendationLog = require("../models/AIRecommendationLog.model");
const { resolveQueryConfig, QUERY_CATALOG } = require("./queryCatalog.service");
const { BENCHMARK_MATRIX } = require("./benchmarkMatrix.service");
const { explainQuery } = require("./explain.service");
const { listAllIndexes } = require("./index.service");
const { analyzeQueryPattern } = require("./ruleBasedIndexAdvisor.service");

function findQuery(queryKey) {
  const classic = QUERY_CATALOG[queryKey];
  if (classic) return resolveQueryConfig(queryKey);
  const matrix = BENCHMARK_MATRIX.find((item) => item.queryKey === queryKey);
  if (matrix) return Promise.resolve({ label: matrix.queryName, ...matrix });
  throw new Error(`Unknown queryKey: ${queryKey}`);
}

async function analyzeIndexRecommendation({ queryKey, limit = 500 }) {
  const query = await findQuery(queryKey);
  const stats = await explainQuery({ collection: query.collection, filter: query.filter || {}, sort: query.sort || null, projection: query.projection || null, limit });
  const currentIndexes = await listAllIndexes();
  const advisor = analyzeQueryPattern({ queryKey, filter: query.filter || {}, sort: query.sort || {}, projection: query.projection || null, stats });
  const payload = {
    queryKey,
    queryShape: { collection: query.collection, filter: query.filter || {}, sort: query.sort || null, projection: query.projection || null },
    currentStats: stats,
    currentIndexes,
    recommendations: advisor.recommendations,
    reasoning: advisor.reasoning,
    tradeOffs: advisor.tradeOffs,
    riskLevel: advisor.riskLevel,
    advisorMode: "rule-based",
    validationPlan: advisor.validationPlan
  };
  const saved = await AIRecommendationLog.create(payload);
  return { id: saved._id, ...payload };
}

async function getAdvisorHistory(limit = 50) {
  return AIRecommendationLog.find().sort({ createdAt: -1 }).limit(Number(limit)).lean();
}

module.exports = { analyzeIndexRecommendation, getAdvisorHistory };
