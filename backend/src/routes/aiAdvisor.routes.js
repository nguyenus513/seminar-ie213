const router = require("express").Router();
const controller = require("../controllers/aiAdvisor.controller");

router.post("/analyze", controller.analyze);
router.post("/recommend-indexes", controller.recommend);
router.post("/validate", controller.validate);
router.get("/history", controller.history);

module.exports = router;
