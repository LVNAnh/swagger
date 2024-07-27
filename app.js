const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const userRoutes = require("./Routes/user");
const productRoutes = require("./Routes/product");
const brandRoutes = require("./Routes/brand");
const categoryRoutes = require("./Routes/category");
const orderRoutes = require("./Routes/order");
const typeDefs = require("./typeDef");
const resolvers = require("./resolvers");

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
  .then(async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(port, () => {
      console.log(`REST API server is running on http://localhost:${port}`);
    });

    const graphqlApp = express();
    server.applyMiddleware({ app: graphqlApp });

    const graphqlPort = 4000;
    graphqlApp.listen(graphqlPort, () => {
      console.log(
        `GraphQL server is running on http://localhost:${graphqlPort}${server.graphqlPath}`
      );
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
