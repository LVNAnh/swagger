const User = require("./model/User");
const Product = require("./model/Product");
const Category = require("./model/Category");
const Brand = require("./model/Brand");
const Order = require("./model/Order");

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
    products: async () =>
      await Product.find().populate("category").populate("brand"),
    product: async (_, { id }) =>
      await Product.findById(id).populate("category").populate("brand"),
    categories: async () => await Category.find(),
    category: async (_, { id }) => await Category.findById(id),
    brands: async () => await Brand.find(),
    brand: async (_, { id }) => await Brand.findById(id),
    orders: async () => await Order.find(),
    order: async (_, { id }) => await Order.findById(id),
  },
  Mutation: {
    createUser: async (
      _,
      { firstname, lastname, email, mobile, password, role, address }
    ) => {
      const newUser = new User({
        firstname,
        lastname,
        email,
        mobile,
        password,
        role,
        address,
      });
      return await newUser.save();
    },
    createProduct: async (
      _,
      { name, price, quantity, category, brand, image, description }
    ) => {
      // Chuyển đổi category và brand thành chữ thường
      const categoryLower = category.toLowerCase();
      const brandLower = brand.toLowerCase();

      // Tìm category và brand không phân biệt chữ hoa chữ thường
      const categoryDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${categoryLower}$`, "i") },
      });
      if (!categoryDoc) {
        throw new Error("Category not found");
      }

      const brandDoc = await Brand.findOne({
        name: { $regex: new RegExp(`^${brandLower}$`, "i") },
      });
      if (!brandDoc) {
        throw new Error("Brand not found");
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

      // Populate và trả về kết quả
      return await Product.findById(savedProduct._id)
        .populate("category")
        .populate("brand");
    },
    createCategory: async (_, { name }) => {
      const newCategory = new Category({ name });
      return await newCategory.save();
    },
    createBrand: async (_, { name }) => {
      const newBrand = new Brand({ name });
      return await newBrand.save();
    },
    createOrder: async (_, { userId, products, total }) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const productDocs = await Product.find({ _id: { $in: products } });
      if (productDocs.length !== products.length) {
        throw new Error("One or more products not found");
      }

      const newOrder = new Order({
        user: user._id,
        products: productDocs.map((product) => product._id),
        total,
      });
      return await newOrder.save();
    },
    updateUser: async (
      _,
      { id, firstname, lastname, email, mobile, password, role, address }
    ) => {
      return await User.findByIdAndUpdate(
        id,
        {
          firstname,
          lastname,
          email,
          mobile,
          password,
          role,
          address,
        },
        { new: true }
      );
    },
    updateProduct: async (
      _,
      { id, name, price, quantity, category, brand, image, description }
    ) => {
      const updates = {};
      if (name) updates.name = name;
      if (price) updates.price = price;
      if (quantity) updates.quantity = quantity;
      if (category) {
        const categoryDoc = await Category.findOne({
          name: { $regex: new RegExp(`^${category}$`, "i") },
        });
        if (categoryDoc) updates.category = categoryDoc._id;
      }
      if (brand) {
        const brandDoc = await Brand.findOne({
          name: { $regex: new RegExp(`^${brand}$`, "i") },
        });
        if (brandDoc) updates.brand = brandDoc._id;
      }
      if (image) updates.image = image;
      if (description) updates.description = description;

      return await Product.findByIdAndUpdate(id, updates, { new: true })
        .populate("category")
        .populate("brand");
    },
    deleteUser: async (_, { id }) => await User.findByIdAndDelete(id),
    deleteProduct: async (_, { id }) => await Product.findByIdAndDelete(id),
  },
  Product: {
    category: async (parent) => {
      const category = await Category.findById(parent.category);
      return {
        id: category._id.toString(),
        name: category.name,
      };
    },
    brand: async (parent) => {
      const brand = await Brand.findById(parent.brand);
      return {
        id: brand._id.toString(),
        name: brand.name,
      };
    },
  },
};

module.exports = resolvers;
