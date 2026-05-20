const router = require("express").Router();
const controller = require("../controllers/explain.controller");

router.post("/", controller.explainPost);
router.get("/:queryKey", controller.explainGet);

module.exports = router;
