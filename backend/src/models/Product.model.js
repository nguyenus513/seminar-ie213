const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    discountPercent: Number,
    stock: Number,
    rating: Number,
    reviewCount: Number,
    sold: Number,
    shortDescription: String,
    description: String,
    imageUrl: String,
    images: [String],
    tags: [String],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true, autoIndex: false }
);

module.exports = mongoose.model("Product", productSchema);
