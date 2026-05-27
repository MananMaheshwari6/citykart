import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Shop } from "../models/Shop.js";
import { City } from "../models/City.js";
import { attachUser, signToken, userPublic } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, cityId } = req.body || {};
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "name, email, password, and role are required" });
    }
    if (!["buyer", "vendor"].includes(role)) {
      return res.status(400).json({ error: "role must be buyer or vendor" });
    }
    if (role === "vendor") {
      if (!cityId) {
        return res.status(400).json({ error: "Please select a city for your shop" });
      }
      const cityExists = await City.findById(String(cityId));
      if (!cityExists) {
        return res.status(400).json({ error: "Selected city does not exist" });
      }
    }
    const existing = await User.findOne({ email: String(email).toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }
    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      role,
    });

    if (role === "vendor") {
      const shopCityId = String(cityId);
      await Shop.create({
        _id: `shop_${user._id.toString()}`,
        name: `${user.name}'s Shop`,
        cityId: shopCityId,
        description: "",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
        rating: 0,
        vendorId: user._id,
      });
      await City.updateOne({ _id: shopCityId }, { $inc: { shopCount: 1 } });
    }

    const token = signToken(user);
    return res.status(201).json({ user: userPublic(user), token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = signToken(user);
    return res.json({ user: userPublic(user), token });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Login failed" });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ ok: true });
});

router.get("/me", attachUser, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return res.json({ user: req.user });
});

export default router;
