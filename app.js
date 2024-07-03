const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/user");
const productRoutes = require("./Routes/product");
const brandRoutes = require("./Routes/brand");
const categoryRoutes = require("./Routes/category");

const setupSwagger = require("./swagger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", userRoutes); // Routes cho Users
app.use("/api", productRoutes); // Routes cho Products
app.use("/api", brandRoutes); // Routes cho Brands
app.use("/api", categoryRoutes); // Routes cho Categories

setupSwagger(app);

mongoose
  .connect("mongodb://localhost:27017/nomydatabase")
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
