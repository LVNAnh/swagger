const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/user");
const setupSwagger = require("./swagger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api", userRoutes); // Đảm bảo rằng đường dẫn đúng

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
