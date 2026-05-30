const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { INDEX_STRATEGIES, createIndex, listIndexes, listAllIndexes, dropIndex, dropAllCustomIndexes } = require("../services/index.service");

exports.strategies = asyncHandler(async (req, res) => res.json(new ApiResponse(INDEX_STRATEGIES)));
exports.listAll = asyncHandler(async (req, res) => res.json(new ApiResponse(await listAllIndexes())));
exports.listOne = asyncHandler(async (req, res) => res.json(new ApiResponse(await listIndexes(req.params.collection))));
exports.create = asyncHandler(async (req, res) => res.json(new ApiResponse(await createIndex(req.body.strategyKey), "Index created")));
exports.drop = asyncHandler(async (req, res) => res.json(new ApiResponse(await dropIndex(req.body.collection, req.body.indexName), "Index dropped")));
exports.dropAll = asyncHandler(async (req, res) => res.json(new ApiResponse(await dropAllCustomIndexes(), "Custom indexes dropped")));
