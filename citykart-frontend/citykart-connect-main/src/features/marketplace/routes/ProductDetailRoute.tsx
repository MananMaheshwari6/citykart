import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, PackageX, ShoppingCart, Star, Store } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { useCart } from "@/features/cart/cart-context";
import type { Product, Shop } from "@/features/marketplace/types";
import { apiFetch, parseJsonError } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { ProductCard } from "@/shared/components/ProductCard";

export default function ProductDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data, isLoading, error } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () =>
      apiFetch(`/products/${id}`).then((r) =>
        r.ok
          ? r.json().then((j: { product: Product }) => j.product)
          : r.json().then((e: { error?: string }) => Promise.reject(e.error ?? "Not found"))
      ),
    enabled: !!id,
  });

  const { data: shop } = useQuery<Shop | undefined>({
    queryKey: ["shop-for-product", data?.cityId, data?.shopId],
    enabled: !!data,
    queryFn: async () => {
      const res = await apiFetch(`/cities/${encodeURIComponent(data!.cityId)}/shops`);
      if (!res.ok) throw new Error(await parseJsonError(res));
      const j = (await res.json()) as { shops: Shop[] };
      return (j.shops ?? []).find((s) => s.id === data!.shopId);
    },
  });

  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ["related", data?.cityId, data?.category],
    enabled: !!data,
    queryFn: async () => {
      const qs = new URLSearchParams();
      qs.set("cityId", data!.cityId);
      qs.set("category", data!.category);
      qs.set("limit", "5");
      const res = await apiFetch(`/products?${qs.toString()}`);
      if (!res.ok) throw new Error(await parseJsonError(res));
      const j = (await res.json()) as { items: Product[] };
      return (j.items ?? []).filter((p) => p.id !== data!.id).slice(0, 4);
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-5 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="mt-auto pt-8 flex items-end justify-between">
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-12 w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-20 flex items-center justify-center">
        <div className="rounded-2xl border bg-card p-10 text-center max-w-md w-full">
          <PackageX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-display text-card-foreground">Product not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This product may have been removed or is unavailable.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to products
          </Button>
        </div>
      </div>
    );
  }

  const product = data;

  const handleAdd = () => {
    void addToCart(product)
      .then(() => toast.success(`${product.name} added to cart`))
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not add to cart"));
  };

  const related = relatedProducts ?? [];

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
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
