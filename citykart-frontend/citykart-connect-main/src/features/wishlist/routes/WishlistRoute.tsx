import { Link, useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { toast } from "sonner";

import { useWishlist } from "@/features/wishlist/wishlist-context";
import { useCart } from "@/features/cart/cart-context";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/shared/components/SmartImage";

export default function WishlistRoute() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">My Wishlist</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearWishlist}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="rounded-2xl border bg-card p-12 text-center">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-card-foreground">
              Your wishlist is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Save products you love and come back to them anytime.
            </p>
            <Button className="mt-6" onClick={() => navigate("/")}>
              Browse products
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl border bg-card overflow-hidden group"
              >
                <Link to={`/product/${item.id}`}>
                  <div className="aspect-square bg-muted overflow-hidden">
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="p-4">
                  <Link to={`/product/${item.id}`}>
                    <p className="font-medium text-sm line-clamp-2 hover:text-orange-500 transition-colors">
                      {item.name}
                    </p>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-semibold text-orange-500">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      disabled={!item.inStock}
                      className="h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs disabled:opacity-50"
                      onClick={() => {
                        void addToCart(item)
                          .then(() => {
                            removeFromWishlist(item.id);
                          })
                          .catch((err) =>
                            toast.error(
                              err instanceof Error ? err.message : "Could not move to cart"
                            )
                          );
                      }}
                    >
                      Move to cart
                    </Button>
                  </div>
                  {!item.inStock && (
                    <p className="text-xs text-destructive mt-2">Out of stock</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
