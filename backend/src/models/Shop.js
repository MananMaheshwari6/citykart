import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    cityId: { type: String, ref: "City", required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { _id: false }
);

export const Shop = mongoose.model("Shop", shopSchema);
