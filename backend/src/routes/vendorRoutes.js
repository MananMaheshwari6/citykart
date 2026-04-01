import { Router } from "express";
import { Product } from "../models/Product.js";
import { Shop } from "../models/Shop.js";
import { requireAuth, requireVendor } from "../middleware/auth.js";
import { productToClient } from "../utils/productDto.js";

const router = Router();

/** Parses booleans from JSON bodies; rejects ambiguous values so "false" is not treated as true. */
function parseInStockPatch(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0") return false;
  }
  if (typeof value === "number" && !Number.isNaN(value)) return value !== 0;
  return null;
}

router.use(requireAuth, requireVendor);

router.get("/products", async (req, res) => {
  const products = await Product.find({ vendorId: req.userId }).sort({ name: 1 }).lean();
  const payload = products.map((p) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    category: p.category,
    status: p.status === "draft" ? "draft" : "active",
    description: p.description,
    inStock: p.inStock,
    image: p.image,
    shopId: p.shopId,
    cityId: p.cityId,
  }));
  res.json({ products: payload });
});

router.post("/products", async (req, res) => {
  const { name, price, category, description, status } = req.body || {};
  if (!name || price === undefined || !category) {
    return res.status(400).json({ error: "name, price, and category are required" });
  }
  const shop = await Shop.findOne({ vendorId: req.userId });
  if (!shop) {
    return res.status(400).json({ error: "No shop found for this vendor" });
  }
  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }
  const st = status === "draft" ? "draft" : "active";
  const id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const product = await Product.create({
    _id: id,
    name: String(name).trim(),
    price: priceNum,
    category: String(category).trim(),
    description: description != null ? String(description) : "",
    status: st,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    shopId: shop._id,
    cityId: shop.cityId,
    rating: 0,
    inStock: true,
    vendorId: req.userId,
  });
  res.status(201).json({ product: productToClient(product) });
});

router.patch("/products/:productId", async (req, res) => {
  const product = await Product.findOne({ _id: req.params.productId, vendorId: req.userId });
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  const { name, price, category, description, status, inStock } = req.body || {};
  if (name !== undefined) product.name = String(name).trim();
  if (price !== undefined) {
    const priceNum = Number(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "Invalid price" });
    }
    product.price = priceNum;
  }
  if (category !== undefined) product.category = String(category).trim();
  if (description !== undefined) product.description = String(description);
  if (status !== undefined) {
    if (!["active", "draft"].includes(status)) {
      return res.status(400).json({ error: "status must be active or draft" });
    }
    product.status = status;
  }
  if (inStock !== undefined) {
    const parsed = parseInStockPatch(inStock);
    if (parsed === null) {
      return res.status(400).json({ error: "inStock must be a boolean true/false or a boolean string" });
    }
    product.inStock = parsed;
  }
  await product.save();
  res.json({ product: productToClient(product) });
});

router.delete("/products/:productId", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.productId, vendorId: req.userId });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ ok: true });
});

export default router;
