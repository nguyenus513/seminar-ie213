const mongoose = require("mongoose");

const benchmarkMatrixRunSchema = new mongoose.Schema(
  {
    datasetLabel: String,
    queryKey: String,
    queryName: String,
    collectionName: String,
    strategyKey: String,
    indexName: String,
    stage: String,
    hasSortStage: Boolean,
    isCoveredQuery: Boolean,
    iterations: Number,
    avgExecutionTimeMillis: Number,
    minExecutionTimeMillis: Number,
    maxExecutionTimeMillis: Number,
    avgDocsExamined: Number,
    avgKeysExamined: Number,
    avgReturned: Number,
    docsExaminedPerReturned: Number,
    keysExaminedPerReturned: Number,
    fasterRatio: Number,
    docsReductionPercent: Number,
    indexSizeMB: Number,
    samples: Array
  },
  { timestamps: { createdAt: true, updatedAt: false }, autoIndex: false }
);

module.exports = mongoose.model("BenchmarkMatrixRun", benchmarkMatrixRunSchema);
