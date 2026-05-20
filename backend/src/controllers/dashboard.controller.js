const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const BenchmarkRun = require("../models/BenchmarkRun.model");
const SearchLog = require("../models/SearchLog.model");
const { listAllIndexes } = require("../services/index.service");

exports.summary = asyncHandler(async (req, res) => {
  const [products, orders, users, latestBenchmark, latestSearch, indexes, searchAgg] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments(),
    BenchmarkRun.findOne().sort({ createdAt: -1 }).lean(),
    SearchLog.findOne().sort({ createdAt: -1 }).lean(),
    listAllIndexes(),
    SearchLog.aggregate([{ $group: { _id: null, avgSearchTime: { $avg: "$mongoExecutionTimeMillis" }, slowest: { $max: "$mongoExecutionTimeMillis" }, fastest: { $min: "$mongoExecutionTimeMillis" } } }])
  ]);
  const customIndexes = indexes.reduce((sum, item) => sum + item.indexes.filter((index) => index.name !== "_id_").length, 0);
  res.json(new ApiResponse({ products, orders, users, customIndexes, latestBenchmark, latestSearch, searchMetrics: searchAgg[0] || null }));
});
