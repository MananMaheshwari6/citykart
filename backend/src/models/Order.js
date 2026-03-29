import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cityId: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
