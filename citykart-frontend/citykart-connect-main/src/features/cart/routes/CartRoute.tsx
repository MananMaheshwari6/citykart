import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { useCity } from "@/features/marketplace/city-context";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SmartImage } from "@/shared/components/SmartImage";

import { apiFetch, parseJsonError } from "@/lib/api";

export default function CartRoute() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { user, ready } = useAuth();
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  // If city-context hasn't surfaced a value yet but localStorage has one
  // saved, render a skeleton for one tick so we don't flash an empty-state
  // before context catches up.
  const savedCity =
    typeof window !== "undefined" ? localStorage.getItem("citykart_city") : null;
  const cityRehydrating = !selectedCity && !!savedCity;

  const handleCheckout = async () => {
    if (!ready) return;
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate("/auth");
      return;
    }
    if (!selectedCity) {
      toast.error("Choose a city on the home page before checkout");
      navigate("/");
      return;
    }
    if (items.length === 0) return;

    setCheckingOut(true);
    try {
      const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          cityId: selectedCity,
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error(await parseJsonError(res));
      await clearCart();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  if (!ready || cartLoading || cityRehydrating) {
    return (
      <div className="container py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold font-display text-foreground">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Start shopping to add items to your cart</p>
        <Link to="/">
          <Button className="mt-6">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-display text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-xl border bg-card p-4"
            >
              <Link to={`/product/${item.product.id}`}>
                <SmartImage
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-semibold text-card-foreground hover:text-primary transition-colors">{item.product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.product.category}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => void updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => void updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => void removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold font-display text-card-foreground">Order Summary</h2>
          <Separator className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-card-foreground">Total</span>
              <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
          <Button className="w-full mt-6" size="lg" onClick={() => void handleCheckout()} disabled={checkingOut}>
            {checkingOut ? "Placing order…" : "Checkout"} <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
