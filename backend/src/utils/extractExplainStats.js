const TARGET_STAGES = ["IXSCAN", "COLLSCAN", "FETCH", "SORT", "TEXT_MATCH", "TEXT", "COUNT_SCAN"];

function findStageNode(plan, targetStages = TARGET_STAGES) {
  if (!plan || typeof plan !== "object") return null;
  if (plan.stage && targetStages.includes(plan.stage)) return plan;
  for (const value of Object.values(plan)) {
    const result = Array.isArray(value)
      ? value.map((entry) => findStageNode(entry, targetStages)).find(Boolean)
      : findStageNode(value, targetStages);
    if (result) return result;
  }
  return null;
}

function findIndexName(plan) {
  if (!plan || typeof plan !== "object") return null;
  if (plan.indexName) return plan.indexName;
  for (const value of Object.values(plan)) {
    const result = Array.isArray(value)
      ? value.map(findIndexName).find(Boolean)
      : findIndexName(value);
    if (result) return result;
  }
  return null;
}

function hasStage(plan, stageName) {
  if (!plan || typeof plan !== "object") return false;
  if (plan.stage === stageName) return true;
  return Object.values(plan).some((value) => Array.isArray(value) ? value.some((entry) => hasStage(entry, stageName)) : hasStage(value, stageName));
}

function extractExplainStats(explain) {
  const executionStats = explain.executionStats || {};
  const winningPlan = explain.queryPlanner?.winningPlan || {};
  const stageNode = findStageNode(winningPlan);
  return {
    executionTimeMillis: executionStats.executionTimeMillis ?? null,
    totalDocsExamined: executionStats.totalDocsExamined ?? null,
    totalKeysExamined: executionStats.totalKeysExamined ?? null,
    nReturned: executionStats.nReturned ?? null,
    stage: stageNode?.stage || null,
    indexName: findIndexName(winningPlan),
    hasSortStage: hasStage(winningPlan, "SORT"),
    isCoveredQuery: executionStats.totalDocsExamined === 0 && executionStats.totalKeysExamined > 0,
    winningPlan,
    executionStats,
    raw: explain
  };
}

module.exports = { extractExplainStats, findStageNode, findIndexName, hasStage };
