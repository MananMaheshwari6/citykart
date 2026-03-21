import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, ShoppingCart, Star, Store } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useCart } from "@/features/cart/cart-context";
import { products, shops } from "@/features/marketplace/data/mock";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductDetailRoute() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === id);
  if (!product) return <div className="container py-20 text-center text-muted-foreground">Product not found</div>;

  const shop = shops.find((s) => s.id === product.shopId);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-square overflow-hidden rounded-2xl border bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <Badge variant="secondary" className="w-fit">
            {product.category}
          </Badge>
          <h1 className="mt-3 text-3xl md:text-4xl font-bold font-display text-foreground">{product.name}</h1>

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1 text-primary">
              <Star className="h-5 w-5 fill-primary" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            {product.inStock ? (
              <Badge variant="outline" className="text-success border-success">
                <Check className="h-3 w-3 mr-1" /> In Stock
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive">
                Out of Stock
              </Badge>
            )}
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {shop && (
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-secondary p-4">
              <Store className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-semibold text-secondary-foreground">{shop.name}</p>
                <p className="text-sm text-muted-foreground">{shop.description}</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm text-muted-foreground">Price</span>
                <p className="text-4xl font-bold text-foreground">₹{product.price.toLocaleString()}</p>
              </div>
              <Button size="lg" onClick={handleAdd} disabled={!product.inStock}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold font-display text-foreground mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="group rounded-xl border bg-card shadow-card hover:shadow-card-hover transition-all overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-card-foreground line-clamp-1">{p.name}</h3>
                  <p className="text-primary font-bold mt-1">₹{p.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

