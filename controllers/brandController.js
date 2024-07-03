const asyncHandler = require("express-async-handler");
const Brand = require("../model/Brand");

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management API
 */

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name });
  res.status(201).json(brand);
});

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brands retrieved successfully
 *       500:
 *         description: Server error
 */
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  res.status(200).json(brands);
});

module.exports = {
  createBrand,
  getAllBrands,
};
