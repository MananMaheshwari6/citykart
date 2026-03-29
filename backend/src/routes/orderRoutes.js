import { Router } from "express";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

function orderToClient(doc) {
  const o = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(o._id),
    status: o.status,
    total: o.total,
    createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : undefined,
    cityId: o.cityId,
    items: (o.items || []).map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
      name: it.name,
      price: it.price,
      image: it.image,
      category: it.category,
    })),
  };
}

router.post("/", async (req, res) => {
  try {
    const { items, cityId } = req.body || {};
    if (!cityId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "cityId and non-empty items array are required" });
    }
    const lines = [];
    let total = 0;
    for (const line of items) {
      if (!line.productId || !line.quantity) {
        return res.status(400).json({ error: "Each item needs productId and quantity" });
      }
      const qty = parseInt(String(line.quantity), 10);
      if (Number.isNaN(qty) || qty < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
      const p = await Product.findById(String(line.productId)).lean();
      if (!p || p.status !== "active" || !p.inStock) {
        return res.status(400).json({ error: `Product unavailable: ${line.productId}` });
      }
      lines.push({
        productId: p._id,
        quantity: qty,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
      });
      total += p.price * qty;
    }
    const order = await Order.create({
      userId: req.userId,
      cityId: String(cityId),
      items: lines,
      total,
      status: "confirmed",
    });
    res.status(201).json({ order: orderToClient(order) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not create order" });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  res.json({ orders: orders.map((o) => orderToClient(o)) });
});

router.get("/:orderId", async (req, res) => {
  const order = await Order.findOne({ _id: req.params.orderId, userId: req.userId }).lean();
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order: orderToClient(order) });
});

export default router;
