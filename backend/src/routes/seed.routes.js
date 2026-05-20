const router = require("express").Router();
const controller = require("../controllers/seed.controller");

router.post("/", controller.seed);
router.delete("/", controller.clear);
router.get("/status", controller.status);

module.exports = router;
