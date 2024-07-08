const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { isAdmin, verifyToken } = require("../middlewares/auth");

router.post("/products", verifyToken, isAdmin, productController.createProduct);
router.get(
  "/products/:id",
  verifyToken,
  isAdmin,
  productController.getProductById
);
router.get("/products", verifyToken, isAdmin, productController.getAllProducts);
router.put(
  "/products/:id",
  verifyToken,
  isAdmin,
  productController.updateProduct
);
router.delete(
  "/products/:id",
  verifyToken,
  isAdmin,
  productController.deleteProduct
);

module.exports = router;
