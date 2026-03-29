import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

function getBearerToken(req) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  return h.slice(7).trim() || null;
}

export function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export async function attachUser(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    req.userId = payload.sub;
    req.userRole = payload.role;
  } catch {
    req.user = null;
  }
  next();
}

export function requireVendor(req, res, next) {
  if (req.userRole !== "vendor") {
    return res.status(403).json({ error: "Vendor access required" });
  }
  next();
}

export function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign({ sub: String(user._id), role: user.role }, secret, { expiresIn: "7d" });
}

export function userPublic(userDoc) {
  return {
    id: String(userDoc._id),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };
}
