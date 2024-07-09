const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken } = require("../middlewares/auth");

router.post("/", verifyToken, orderController.createOrder);

module.exports = router;
