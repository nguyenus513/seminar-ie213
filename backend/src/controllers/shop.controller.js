const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { searchProducts, getProductById } = require("../services/shop.service");

exports.searchProducts = asyncHandler(async (req, res) => res.json(new ApiResponse(await searchProducts(req.query))));
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  res.json(new ApiResponse(product));
});
exports.compareSearch = asyncHandler(async (req, res) => {
  const baseline = await searchProducts({ ...req.body, searchMode: "regex" }, { logSearch: false });
  const optimized = await searchProducts({ ...req.body, searchMode: "text" }, { logSearch: false });
  const fasterRatio = optimized.performance.mongoExecutionTimeMillis > 0 ? baseline.performance.mongoExecutionTimeMillis / optimized.performance.mongoExecutionTimeMillis : 0;
  const docsReductionPercent = baseline.performance.totalDocsExamined > 0 ? (1 - optimized.performance.totalDocsExamined / baseline.performance.totalDocsExamined) * 100 : 0;
  res.json(new ApiResponse({ query: req.body, baseline: baseline.performance, optimized: optimized.performance, improvement: { fasterRatio: Number(fasterRatio.toFixed(2)), docsReductionPercent: Number(docsReductionPercent.toFixed(2)) } }));
});
