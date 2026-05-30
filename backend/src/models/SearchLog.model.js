const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema(
  {
    keyword: String,
    category: String,
    brand: String,
    minPrice: Number,
    maxPrice: Number,
    sort: String,
    searchMode: String,
    totalResults: Number,
    returned: Number,
    apiResponseTimeMs: Number,
    mongoExecutionTimeMillis: Number,
    countTimeMillis: Number,
    stage: String,
    indexUsed: String,
    totalDocsExamined: Number,
    totalKeysExamined: Number,
    nReturned: Number
  },
  { timestamps: { createdAt: true, updatedAt: false }, autoIndex: false }
);

module.exports = mongoose.model("SearchLog", searchLogSchema);
