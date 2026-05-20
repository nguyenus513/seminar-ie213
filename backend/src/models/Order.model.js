const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, required: true },
    paymentMethod: String,
    totalAmount: Number,
    itemCount: Number
  },
  { timestamps: true, autoIndex: false }
);

module.exports = mongoose.model("Order", orderSchema);
