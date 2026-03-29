import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    image: { type: String, default: "" },
    shopCount: { type: Number, default: 0 },
  },
  { _id: false }
);

export const City = mongoose.model("City", citySchema);
