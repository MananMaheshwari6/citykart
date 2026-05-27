import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { Package } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

import { useAuth } from "@/features/auth/auth-context";
import { apiFetch, parseJsonError } from "@/lib/api";

import { Button } from "@/components/ui/button";

interface OrderRow {
  id: string;
  status: string;
  total: number;
  createdAt?: string;
  cityId: string;
  items: { productId: string; quantity: number; name: string; price: number; image?: string; category?: string }[];
}

async function fetchOrders(): Promise<OrderRow[]> {
  const res = await apiFetch("/orders");
  if (!res.ok) throw new Error(await parseJsonError(res));
  const data = (await res.json()) as { orders: OrderRow[] };
  return data.orders ?? [];
}

export default function OrdersRoute() {
  const { user, ready } = useAuth();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: fetchOrders,
    enabled: ready && !!user,
  });

  if (!ready) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        <p>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold font-display text-foreground mb-2">Your orders</h1>
      <p className="text-muted-foreground mb-8">Orders placed from your account</p>

      {isLoading && <p className="text-muted-foreground">Loading orders…</p>}
      {error && <p className="text-destructive">{error instanceof Error ? error.message : "Could not load orders"}</p>}

      {!isLoading && !error && orders && orders.length === 0 && (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-card-foreground font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground mt-2">Browse products and check out from your cart.</p>
          <Link to="/">
            <Button className="mt-6">Start shopping</Button>
          </Link>
        </div>
      )}

      {!isLoading && orders && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border bg-card p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="font-semibold text-card-foreground font-mono text-sm">#{order.id.slice(-8)}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">Status: {order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold text-foreground">₹{order.total.toLocaleString()}</p>
                  {order.createdAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")}
                    </p>
                  )}
                </div>
              </div>
              <ul className="divide-y border-t pt-4">
                {order.items.map((it) => (
                  <li key={`${order.id}-${it.productId}`} className="flex justify-between gap-4 py-3 text-sm">
                    <span className="text-card-foreground">
                      {it.name} × {it.quantity}
                    </span>
                    <span className="text-muted-foreground shrink-0">₹{(it.price * it.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
