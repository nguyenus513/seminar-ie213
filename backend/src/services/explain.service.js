const { getModelByCollection } = require("./collection.service");
const { extractExplainStats } = require("../utils/extractExplainStats");

async function explainQuery({ collection, filter = {}, sort = null, limit = 500, skip = 0, projection = null }) {
  const model = getModelByCollection(collection);
  let cursor = model.collection.find(filter, projection ? { projection } : undefined);
  if (sort) cursor = cursor.sort(sort);
  if (skip) cursor = cursor.skip(Number(skip));
  if (limit) cursor = cursor.limit(Number(limit));
  const explain = await cursor.explain("executionStats");
  return extractExplainStats(explain);
}

module.exports = { explainQuery };
