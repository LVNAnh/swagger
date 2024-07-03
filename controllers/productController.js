const asyncHandler = require("express-async-handler");
const Product = require("../model/Product");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("brand", "name")
      .populate("category", "name");
    if (!product) {
      return res.status(404).json({ success: false, mes: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, mes: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Server error
 */
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand", "name")
      .populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, mes: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (updatedProduct) {
    res.status(200).json(updatedProduct);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (deletedProduct) {
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
