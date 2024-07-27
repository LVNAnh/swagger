const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Product = require("../model/Product");
const {
  generrateAccessToken,
  generrateRefreshToken,
} = require("../middlewares/jwt");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               mobile:
 *                 type: string
 *               role:
 *                 type: number
 *                 enum: [1945, 1979]
 *                 example: 1979
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *               - address
 *               - mobile
 *               - role
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, address, mobile, role } =
    req.body;

  if (
    !email ||
    !password ||
    !lastname ||
    !firstname ||
    !address ||
    !mobile ||
    !role
  ) {
    return res.status(400).json({
      success: false,
      mes: "Nhập thiếu, vui lòng nhập đầy đủ",
    });
  }

  // Check email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      mes: "Định dạng email không hợp lệ",
    });
  }

  // Check password requirements
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      mes: "Mật khẩu phải có ít nhất 8 ký tự bao gồm ít nhất 1 ký tự thường, 1 ký tự in hoa và 1 ký tự đặc biệt",
    });
  }

  const userByEmail = await User.findOne({ email });
  if (userByEmail) {
    return res.status(400).json({
      success: false,
      mes: "Email đã tồn tại trong hệ thống, vui lòng thử email khác",
    });
  }

  const userByMobile = await User.findOne({ mobile });
  if (userByMobile) {
    return res.status(400).json({
      success: false,
      mes: "Số điện thoại đã thuộc về 1 tài khoản khác",
    });
  }

  const newUser = await User.create(req.body);
  return res.status(200).json({
    success: true,
    mes: "Đăng ký thành công, vui lòng đăng nhập",
    user: newUser,
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 * /api/login:
 *   post:
 *     summary: Login to user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 userData:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Vui lòng nhập thông tin đăng nhập",
    });
  const user = await User.findOne({ email: email });
  if (user && (await user.isConrectPassword(password))) {
    const { password, role, refreshToken, ...userData } = user.toObject();
    const accessToken = generrateAccessToken(user._id, role);
    const newRefreshToken = generrateRefreshToken(user._id);
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    return res.status(400).json({ success: false, mes: "Invalid credentials" });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       500:
 *         description: Server error
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
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
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
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
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (updatedUser) {
    res.status(200).json(updatedUser);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const deleteUser = asyncHandler(async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (deletedUser) {
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update the user's cart
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product
 *                 default: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id, quantity = 1 } = req.body;
  if (!id) throw new Error("Missing input");

  const user = await User.findById(_id).select("cart");
  const product = await Product.findById(id);

  if (!product) {
    return res.status(400).json({
      success: false,
      mes: "Product not found",
    });
  }

  const alreadyProduct = user?.cart?.find(
    (el) => el.product && el.product.toString() === id
  );

  if (alreadyProduct) {
    const response = await User.updateOne(
      { _id, "cart.product": id },
      {
        $set: {
          "cart.$.quantity": quantity,
          "cart.$.price": product.price,
          "cart.$.name": product.title,
          "cart.$.image": product.image,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Something went wrong",
    });
  } else {
    const response = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          cart: {
            product: id,
            quantity,
            price: product.price,
            title: product.title,
            image: product.image,
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Updated your cart" : "Something went wrong",
    });
  }
});

module.exports = {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateCart,
};
