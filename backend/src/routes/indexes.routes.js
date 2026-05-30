const router = require("express").Router();
const controller = require("../controllers/indexes.controller");

router.get("/strategies", controller.strategies);
router.get("/", controller.listAll);
router.get("/:collection", controller.listOne);
router.post("/create", controller.create);
router.delete("/drop", controller.drop);
router.delete("/drop-all-custom", controller.dropAll);

module.exports = router;
