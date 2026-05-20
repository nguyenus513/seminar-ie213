const AIRecommendationLog = require("../models/AIRecommendationLog.model");
const { runMatrixStrategy } = require("./benchmarkMatrix.service");

async function validateRecommendation({ logId, queryKey, strategyKey, iterations = 5, limit = 500 }) {
  const result = await runMatrixStrategy({ queryKey, strategyKey, iterations, limit, saveLog: true });
  if (logId) await AIRecommendationLog.findByIdAndUpdate(logId, { acceptedRecommendation: { strategyKey }, validationResult: result });
  return result;
}

module.exports = { validateRecommendation };
