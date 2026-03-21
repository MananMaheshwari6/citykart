import { CheckCircle, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export default function OrdersRoute() {
  return (
    <div className="container py-16 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 h-20 w-20 rounded-full bg-success flex items-center justify-center"
      >
        <CheckCircle className="h-10 w-10 text-success-foreground" />
      </motion.div>
      <h1 className="text-3xl font-bold font-display text-foreground">Order Confirmed!</h1>
      <p className="mt-3 text-muted-foreground max-w-md mx-auto">
        Thank you for your purchase. Your order has been placed successfully and will be delivered soon.
      </p>
      <div className="mt-8 rounded-2xl border bg-card p-6 max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <span className="font-semibold text-card-foreground">Order #CK{Date.now().toString().slice(-6)}</span>
        </div>
        <p className="text-sm text-muted-foreground">Estimated delivery: 3-5 business days</p>
      </div>
      <Link to="/">
        <Button className="mt-8">Continue Shopping</Button>
      </Link>
    </div>
  );
}

