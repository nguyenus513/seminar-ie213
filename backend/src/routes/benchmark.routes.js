const router = require("express").Router();
const controller = require("../controllers/benchmark.controller");

router.get("/queries", controller.queries);
router.get("/matrix-queries", controller.matrixQueries);
router.post("/run-one", controller.runOne);
router.post("/run-all", controller.runAll);
router.post("/run-matrix", controller.runMatrix);
router.get("/history", controller.history);
router.get("/matrix-history", controller.matrixHistory);
router.get("/compare", controller.compare);
router.get("/strategy-comparison", controller.strategyComparison);
router.get("/export/csv", controller.exportCsv);
router.get("/export-extended-csv", controller.exportExtendedCsv);

module.exports = router;
