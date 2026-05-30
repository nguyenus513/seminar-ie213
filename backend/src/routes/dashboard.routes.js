const router = require("express").Router();
const controller = require("../controllers/dashboard.controller");

router.get("/summary", controller.summary);

module.exports = router;
