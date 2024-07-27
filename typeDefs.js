const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    firstname: String!
    lastname: String!
    email: String!
    mobile: String!
    password: String!
    address: String
    role: Int
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    quantity: Int!
    category: Category!
    brand: Brand!
    image: String
    description: String
  }

  type Category {
    id: ID!
    name: String!
  }

  type Brand {
    id: ID!
    name: String!
  }

  type Order {
    id: ID!
    user: User!
    products: [Product!]!
    total: Float!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
    brands: [Brand!]!
    brand(id: ID!): Brand
    orders: [Order!]!
    order(id: ID!): Order
  }

  type Mutation {
    createUser(
      firstname: String!
      lastname: String!
      email: String!
      mobile: String!
      password: String!
      role: Int
      address: String
    ): User!
    createProduct(
      name: String!
      price: Float!
      quantity: Int!
      category: String!
      brand: String!
      image: String
      description: String
    ): Product!
    createCategory(name: String!): Category!
    createBrand(name: String!): Brand!
    createOrder(userId: ID!, products: [ID!]!, total: Float!): Order!
    updateUser(
      id: ID!
      firstname: String
      lastname: String
      email: String
      mobile: String
      password: String
      role: Int
      address: String
    ): User!
    updateProduct(
      id: ID!
      name: String
      price: Float
      quantity: Int
      category: String
      brand: String
      image: String
      description: String
    ): Product!
    deleteUser(id: ID!): User!
    deleteProduct(id: ID!): Product!
  }
`;

module.exports = typeDefs;
