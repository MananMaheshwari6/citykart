import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/auth-context";
import type { Product } from "@/features/marketplace/types";
import { apiFetch, parseJsonError } from "@/lib/api";

const GUEST_CART_KEY = "citykart_guest_cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function mapCartResponse(data: { items?: { product: Product; quantity: number }[] }): CartItem[] {
  return (data.items ?? []).map((row) => ({
    product: row.product,
    quantity: row.quantity,
  }));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(async () => {
    const res = await apiFetch("/cart");
    if (!res.ok) return;
    const data = (await res.json()) as { items?: { product: Product; quantity: number }[] };
    setItems(mapCartResponse(data));
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CartItem[];
          setItems(Array.isArray(parsed) ? parsed : []);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      }
      return;
    }

    (async () => {
      try {
        const raw = localStorage.getItem(GUEST_CART_KEY);
        if (raw) {
          const guest = JSON.parse(raw) as CartItem[];
          localStorage.removeItem(GUEST_CART_KEY);
          if (Array.isArray(guest)) {
            for (const line of guest) {
              const res = await apiFetch("/cart/items", {
                method: "POST",
                body: JSON.stringify({ productId: line.product.id, quantity: line.quantity }),
              });
              if (!res.ok) {
                await parseJsonError(res);
              }
            }
          }
        }
      } catch {
        /* ignore merge errors */
      }
      await loadCart();
    })();
  }, [ready, user, loadCart]);

  useEffect(() => {
    if (!ready || user) return;
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready, user]);

  const addToCart = useCallback(
    async (product: Product) => {
      if (user) {
        const res = await apiFetch("/cart/items", {
          method: "POST",
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        if (!res.ok) throw new Error(await parseJsonError(res));
        await loadCart();
        return;
      }
      setItems((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        }
        return [...prev, { product, quantity: 1 }];
      });
    },
    [user, loadCart]
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (user) {
        const res = await apiFetch(`/cart/items/${encodeURIComponent(productId)}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await parseJsonError(res));
        await loadCart();
        return;
      }
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    },
    [user, loadCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (quantity <= 0) {
        if (user) {
          const res = await apiFetch(`/cart/items/${encodeURIComponent(productId)}`, { method: "DELETE" });
          if (!res.ok) throw new Error(await parseJsonError(res));
          await loadCart();
        } else {
          setItems((prev) => prev.filter((i) => i.product.id !== productId));
        }
        return;
      }
      if (user) {
        const res = await apiFetch(`/cart/items/${encodeURIComponent(productId)}`, {
          method: "PATCH",
          body: JSON.stringify({ quantity }),
        });
        if (!res.ok) throw new Error(await parseJsonError(res));
        await loadCart();
        return;
      }
      setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
    },
    [user, loadCart]
  );

  const clearCart = useCallback(async () => {
    if (user) {
      const res = await apiFetch("/cart", { method: "DELETE" });
      if (!res.ok) throw new Error(await parseJsonError(res));
    }
    setItems([]);
    try {
      localStorage.removeItem(GUEST_CART_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
