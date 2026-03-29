import { Router } from "express";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";
import { productToClient } from "../utils/productDto.js";

const router = Router();

router.use(requireAuth);

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

router.get("/", async (req, res) => {
  const cart = await getOrCreateCart(req.userId);
  const productIds = cart.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const byId = Object.fromEntries(products.map((p) => [p._id, p]));
  const items = cart.items
    .map((line) => {
      const p = byId[line.productId];
      if (!p) return null;
      return { product: productToClient(p), quantity: line.quantity };
    })
    .filter(Boolean);
  res.json({ items });
});

router.post("/items", async (req, res) => {
  const { productId, quantity = 1 } = req.body || {};
  if (!productId) {
    return res.status(400).json({ error: "productId is required" });
  }
  const product = await Product.findById(String(productId)).lean();
  if (!product || product.status !== "active") {
    return res.status(404).json({ error: "Product not found" });
  }
  const qty = Math.max(1, parseInt(String(quantity), 10) || 1);
  const cart = await getOrCreateCart(req.userId);
  const idx = cart.items.findIndex((i) => i.productId === String(productId));
  if (idx >= 0) {
    cart.items[idx].quantity += qty;
  } else {
    cart.items.push({ productId: String(productId), quantity: qty });
  }
  await cart.save();
  res.status(201).json({ ok: true });
});

router.patch("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body || {};
  if (quantity === undefined) {
    return res.status(400).json({ error: "quantity is required" });
  }
  const q = parseInt(String(quantity), 10);
  if (Number.isNaN(q) || q < 1) {
    return res.status(400).json({ error: "quantity must be a positive integer" });
  }
  const cart = await getOrCreateCart(req.userId);
  const idx = cart.items.findIndex((i) => i.productId === productId);
  if (idx < 0) {
    return res.status(404).json({ error: "Item not in cart" });
  }
  cart.items[idx].quantity = q;
  await cart.save();
  res.json({ ok: true });
});

router.delete("/items/:productId", async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.userId);
  cart.items = cart.items.filter((i) => i.productId !== productId);
  await cart.save();
  res.json({ ok: true });
});

router.delete("/", async (req, res) => {
  const cart = await getOrCreateCart(req.userId);
  cart.items = [];
  await cart.save();
  res.json({ ok: true });
});

export default router;
