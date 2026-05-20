const router = require("express").Router();
const controller = require("../controllers/shop.controller");

router.get("/products", controller.searchProducts);
router.get("/products/:id", controller.getProduct);
router.post("/search/compare", controller.compareSearch);

module.exports = router;
