import { Router } from "express";
import { Product } from "../models/Product.js";
import { productToClient } from "../utils/productDto.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { cityId, search, category, page = "1", limit = "20" } = req.query;
    const filter = { status: "active" };
    if (cityId) filter.cityId = String(cityId);
    if (category) filter.category = new RegExp(`^${escapeRegex(String(category))}$`, "i");
    if (search) {
      const q = escapeRegex(String(search));
      filter.$or = [{ name: new RegExp(q, "i") }, { description: new RegExp(q, "i") }];
    }
    const p = Math.max(1, parseInt(String(page), 10) || 1);
    const l = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 20));
    const skip = (p - 1) * l;
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ name: 1 }).skip(skip).limit(l).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({
      items: items.map((doc) => productToClient(doc)),
      page: p,
      total,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const doc = await Product.findOne({ _id: req.params.productId, status: "active" }).lean();
    if (!doc) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product: productToClient(doc) });
  } catch (err) {
    next(err);
  }
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;
