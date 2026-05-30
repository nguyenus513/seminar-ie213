const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { analyzeIndexRecommendation, getAdvisorHistory } = require("../services/aiIndexAdvisor.service");
const { validateRecommendation } = require("../services/aiAdvisorValidation.service");

exports.analyze = asyncHandler(async (req, res) => res.json(new ApiResponse(await analyzeIndexRecommendation(req.body), "Advisor analysis completed")));
exports.recommend = exports.analyze;
exports.validate = asyncHandler(async (req, res) => res.json(new ApiResponse(await validateRecommendation(req.body), "Recommendation validation completed")));
exports.history = asyncHandler(async (req, res) => res.json(new ApiResponse(await getAdvisorHistory(req.query.limit))));
