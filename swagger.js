const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for managing Users and Products",
    },
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            firstname: {
              type: "string",
              example: "John",
            },
            lastname: {
              type: "string",
              example: "Doe",
            },
            email: {
              type: "string",
              example: "john.doe@example.com",
            },
            mobile: {
              type: "string",
              example: "+1234567890",
            },
            password: {
              type: "string",
              example: "password123",
            },
            address: {
              type: "string",
              example: "",
            },
            role: {
              type: "string",
              enum: [1945, 1979],
              example: 1979,
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            category: {
              type: "string",
              example: "Electronics",
            },
            brand: {
              type: "string",
              example: "Sony",
            },
            image: {
              type: "string",
              example: "http://example.com/image.jpg",
            },
            name: {
              type: "string",
              example: "Smartphone",
            },
            price: {
              type: "number",
              example: 299.99,
            },
            quantity: {
              type: "number",
              example: 100,
            },
            description: {
              type: "string",
              example: "A high-quality smartphone with advanced features.",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "User management API",
      },
      {
        name: "Products",
        description: "Product management API",
      },
    ],
  },
  apis: ["./controllers/*.js", "./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
