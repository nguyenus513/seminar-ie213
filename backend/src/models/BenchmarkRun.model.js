const mongoose = require("mongoose");

const benchmarkRunSchema = new mongoose.Schema(
  {
    queryKey: String,
    queryName: String,
    collectionName: String,
    indexStrategy: String,
    strategyName: String,
    mode: String,
    iterations: Number,
    avgExecutionTimeMillis: Number,
    minExecutionTimeMillis: Number,
    maxExecutionTimeMillis: Number,
    avgDocsExamined: Number,
    avgKeysExamined: Number,
    avgReturned: Number,
    stage: String,
    samples: Array,
    rawExplain: Object
  },
  { timestamps: { createdAt: true, updatedAt: false }, autoIndex: false }
);

module.exports = mongoose.model("BenchmarkRun", benchmarkRunSchema);
