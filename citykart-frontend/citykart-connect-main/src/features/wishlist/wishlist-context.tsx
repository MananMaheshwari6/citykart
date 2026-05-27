import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

import type { Product } from "@/features/marketplace/types";

const WISHLIST_STORAGE_KEY = "citykart_wishlist";

export type WishlistItem = Product;

interface WishlistContextValue {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: WishlistItem) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

function readInitial(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WishlistItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / serialization errors */
    }
  }, [items]);

  const isWishlisted = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items]
  );

  const addToWishlist = useCallback((product: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [product, ...prev];
    });
    toast.success("Added to wishlist ♥");
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    let removed = false;
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== productId);
      removed = next.length !== prev.length;
      return next;
    });
    if (removed) toast.message("Removed from wishlist");
  }, []);

  const toggleWishlist = useCallback(
    (product: WishlistItem) => {
      if (items.some((i) => i.id === product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    },
    [items, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
      totalItems: items.length,
    }),
    [items, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, clearWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
