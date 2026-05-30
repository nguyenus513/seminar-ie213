const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { resolveQueryConfig } = require("../services/queryCatalog.service");
const { explainQuery } = require("../services/explain.service");

async function explainByKey(queryKey, limit = 500) {
  const config = await resolveQueryConfig(queryKey);
  return explainQuery({ collection: config.collection, filter: config.filter, sort: config.sort, limit });
}

exports.explainGet = asyncHandler(async (req, res) => res.json(new ApiResponse(await explainByKey(req.params.queryKey, req.query.limit))));
exports.explainPost = asyncHandler(async (req, res) => res.json(new ApiResponse(await explainByKey(req.body.queryKey, req.body.limit))));
