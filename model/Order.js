const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const OrderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        name: String,
        image: String,
      },
    ],
    status: {
      type: String,
      default: "Successed",
      enum: ["Cancelled", "Successed"], // npm stripe if you use pay online
    },
    total: Number,
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Order", OrderSchema);
