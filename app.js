const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/user");
const productRoutes = require("./Routes/product");
const brandRoutes = require("./Routes/brand");
const categoryRoutes = require("./Routes/category");
const orderRoutes = require("./Routes/order");

const setupSwagger = require("./swagger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", brandRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);

setupSwagger(app);

mongoose
  .connect(
    "mongodb+srv://NHATANH:WMGaAVaGCtsPnC1k@cluster0.6z5yhqo.mongodb.net/Swagger"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
