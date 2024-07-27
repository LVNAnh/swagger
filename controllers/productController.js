const asyncHandler = require("express-async-handler");
const Product = require("../model/Product");
const Brand = require("../model/Brand");
const Category = require("../model/Category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Upload destination
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  },
});

const upload = multer({ storage: storage });

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
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: number
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - category
 *               - brand
 *               - image
 *               - description
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, quantity, category, brand, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Find brand by name
    const brandDoc = await Brand.findOne({
      name: { $regex: brand, $options: "i" },
    });
    if (!brandDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Brand not found" });
    }

    // Find category by name
    const categoryDoc = await Category.findOne({
      name: { $regex: category, $options: "i" },
    });
    if (!categoryDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const newProduct = new Product({
      name,
      price,
      quantity,
      category: categoryDoc._id,
      brand: brandDoc._id,
      image,
      description,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
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
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Product name
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Product brand
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit the number of products returned
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       500:
 *         description: Server error
 */
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const { name, brand, category, minPrice, maxPrice, limit } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (brand) {
      const brandDoc = await Brand.findOne({
        name: { $regex: brand, $options: "i" },
      });
      if (brandDoc) {
        filter.brand = brandDoc._id;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Brand not found" });
      }
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    const productsQuery = Product.find(filter)
      .populate("brand", "name")
      .populate("category", "name");

    if (limit) {
      productsQuery.limit(Number(limit));
    }

    const products = await productsQuery.exec();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: ""
 *               brand:
 *                 type: string
 *                 example: ""
 *               name:
 *                 type: string
 *                 example: ""
 *               image:
 *                 type: string
 *                 format: binary
 *                 example: ""
 *               price:
 *                 type: number
 *                 example: ""
 *               quantity:
 *                 type: number
 *                 example: ""
 *               description:
 *                 type: string
 *                 example: ""
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { category, brand, name, price, quantity, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const updates = {};

    if (name) updates.name = name;
    if (image) updates.image = image;
    if (price) updates.price = price;
    if (quantity) updates.quantity = quantity;
    if (description) updates.description = description;

    if (brand) {
      const brandDoc = await Brand.findOne({
        name: { $regex: brand, $options: "i" },
      });
      if (brandDoc) {
        updates.brand = brandDoc._id;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy thương hiệu" });
      }
    }

    if (category) {
      const categoryDoc = await Category.findOne({
        name: { $regex: category, $options: "i" },
      });
      if (categoryDoc) {
        updates.category = categoryDoc._id;
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy danh mục" });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
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
  createProduct: [upload.single("image"), createProduct],
  getProductById,
  getAllProducts,
  updateProduct: [upload.single("image"), updateProduct],
  deleteProduct,
};
