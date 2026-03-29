import { Router } from "express";
import { City } from "../models/City.js";
import { Shop } from "../models/Shop.js";

const router = Router();

router.get("/", async (_req, res) => {
  const cities = await City.find().sort({ name: 1 }).lean();
  const payload = cities.map((c) => ({
    id: c._id,
    name: c.name,
    state: c.state,
    image: c.image,
    shopCount: c.shopCount,
  }));
  res.json({ cities: payload });
});

router.get("/:cityId/shops", async (req, res) => {
  const { cityId } = req.params;
  const city = await City.findById(cityId).lean();
  if (!city) {
    return res.status(404).json({ error: "City not found" });
  }
  const shops = await Shop.find({ cityId }).lean();
  const payload = shops.map((s) => ({
    id: s._id,
    name: s.name,
    cityId: s.cityId,
    description: s.description,
    image: s.image,
    rating: s.rating,
    vendorId: s.vendorId ? String(s.vendorId) : undefined,
  }));
  res.json({ shops: payload });
});

export default router;
