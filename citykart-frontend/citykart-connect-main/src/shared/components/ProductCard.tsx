import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import type { Product } from "@/features/marketplace/types";
import { useCart } from "@/features/cart/cart-context";
import { Button } from "@/components/ui/button";

interface Props {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-card-foreground line-clamp-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-0.5 text-sm text-primary shrink-0">
            <Star className="h-3.5 w-3.5 fill-primary" />
            {product.rating}
          </div>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">₹{product.price.toLocaleString()}</span>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              void addToCart(product).catch((err) => toast.error(err instanceof Error ? err.message : "Could not add to cart"));
            }}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.inStock ? "Add" : "Out"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

