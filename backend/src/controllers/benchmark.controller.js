const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const BenchmarkRun = require("../models/BenchmarkRun.model");
const { QUERY_CATALOG } = require("../services/queryCatalog.service");
const { runBenchmark, runAllBenchmarks, getHistory, compareLatest } = require("../services/benchmark.service");
const { toCsv } = require("../utils/csvExporter");
const { BENCHMARK_MATRIX, runMatrix, getMatrixHistory, exportExtendedCsv } = require("../services/benchmarkMatrix.service");

exports.queries = asyncHandler(async (req, res) => res.json(new ApiResponse(QUERY_CATALOG)));
exports.runOne = asyncHandler(async (req, res) => res.json(new ApiResponse(await runBenchmark(req.body), "Benchmark completed")));
exports.runAll = asyncHandler(async (req, res) => res.json(new ApiResponse(await runAllBenchmarks(req.body), "All benchmarks completed")));
exports.history = asyncHandler(async (req, res) => res.json(new ApiResponse(await getHistory(req.query))));
exports.compare = asyncHandler(async (req, res) => res.json(new ApiResponse(await compareLatest())));
exports.exportCsv = asyncHandler(async (req, res) => {
  const rows = await BenchmarkRun.find().sort({ createdAt: -1 }).lean();
  const csv = toCsv(rows, ["queryKey", "queryName", "indexStrategy", "mode", "avgExecutionTimeMillis", "avgDocsExamined", "avgKeysExamined", "avgReturned", "stage", "createdAt"]);
  res.header("Content-Type", "text/csv").attachment("benchmark-results.csv").send(csv);
});
exports.matrixQueries = asyncHandler(async (req, res) => res.json(new ApiResponse(BENCHMARK_MATRIX)));
exports.runMatrix = asyncHandler(async (req, res) => res.json(new ApiResponse(await runMatrix(req.body), "Matrix benchmark completed")));
exports.matrixHistory = asyncHandler(async (req, res) => res.json(new ApiResponse(await getMatrixHistory(req.query))));
exports.strategyComparison = asyncHandler(async (req, res) => res.json(new ApiResponse(await getMatrixHistory(req.query))));
exports.exportExtendedCsv = asyncHandler(async (req, res) => {
  const csv = await exportExtendedCsv();
  res.header("Content-Type", "text/csv").attachment("benchmark-results-extended.csv").send(csv);
});
