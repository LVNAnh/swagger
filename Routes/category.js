const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { isAdmin, verifyToken } = require("../middlewares/auth");

router.post(
  "/categories",
  verifyToken,
  isAdmin,
  categoryController.createCategory
);
router.get(
  "/categories",
  verifyToken,
  isAdmin,
  categoryController.getAllCategories
);

module.exports = router;
