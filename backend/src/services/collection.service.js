const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const User = require("../models/User.model");
const BenchmarkRun = require("../models/BenchmarkRun.model");
const SearchLog = require("../models/SearchLog.model");
const BenchmarkMatrixRun = require("../models/BenchmarkMatrixRun.model");
const AIRecommendationLog = require("../models/AIRecommendationLog.model");
const IndexCostRun = require("../models/IndexCostRun.model");

const COLLECTIONS = {
  products: Product,
  orders: Order,
  users: User,
  benchmarkruns: BenchmarkRun,
  searchlogs: SearchLog,
  benchmarkmatrixruns: BenchmarkMatrixRun,
  airecommendationlogs: AIRecommendationLog,
  indexcostruns: IndexCostRun
};

function getModelByCollection(collectionName) {
  const model = COLLECTIONS[collectionName?.toLowerCase()];
  if (!model) throw new Error(`Unsupported collection: ${collectionName}`);
  return model;
}

module.exports = { COLLECTIONS, getModelByCollection };
