const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");

router.post("/brands", brandController.createBrand);
router.get("/brands", brandController.getAllBrands);

module.exports = router;
