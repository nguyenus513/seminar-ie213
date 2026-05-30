function buildAdvisorPrompt({ queryShape, currentIndexes, currentStats }) {
  return `You are a MongoDB performance advisor. Analyze the query shape and execution stats. Return JSON with recommendations, reasoning, tradeOffs, validationPlan.\nQueryShape: ${JSON.stringify(queryShape)}\nCurrentIndexes: ${JSON.stringify(currentIndexes)}\nExecutionStats: ${JSON.stringify(currentStats)}`;
}

module.exports = { buildAdvisorPrompt };
