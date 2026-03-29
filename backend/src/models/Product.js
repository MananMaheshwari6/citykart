import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, required: true },
    shopId: { type: String, ref: "Shop", required: true },
    cityId: { type: String, ref: "City", required: true },
    rating: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["active", "draft"], default: "active" },
  },
  { _id: false }
);

export const Product = mongoose.model("Product", productSchema);
