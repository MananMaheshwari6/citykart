import { Link, useNavigate } from "react-router-dom";
import { Heart, LogOut, MapPin, Menu, ShoppingCart, Store, User, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/features/auth/auth-context";
import { useCart } from "@/features/cart/cart-context";
import { useCity } from "@/features/marketplace/city-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import type { City } from "@/features/marketplace/types";
import { apiFetch } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

export function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { user, logout, isVendor } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: cities } = useQuery<City[]>({
    queryKey: ["cities"],
    queryFn: async () => {
      const res = await apiFetch("/cities");
      if (!res.ok) throw new Error("Failed to load cities");
      const data = (await res.json()) as { cities: City[] };
      return data.cities ?? [];
    },
    staleTime: Infinity,
  });

  const cityName =
    cities?.find((c) => c.id === selectedCity)?.name ?? selectedCity ?? undefined;

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => setSelectedCity(null)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-gradient">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display text-foreground">CityKart</span>
          </Link>

          {cityName && (
            <button
              onClick={() => {
                setSelectedCity(null);
                navigate("/");
              }}
              className="hidden md:flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground hover:bg-accent/80 transition-colors"
            >
              <MapPin className="h-3 w-3" />
              {cityName}
              <X className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {selectedCity && (
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Products
              </Button>
            </Link>
          )}
          {isVendor && (
            <Link to="/vendor">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-medium">
                {wishlistCount}
              </span>
            )}
          </Button>
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                <User className="h-4 w-4 mr-1" /> Sign In
              </Button>
            </Link>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 flex flex-col gap-2">
          {selectedCity && (
            <Link to="/products" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Products
              </Button>
            </Link>
          )}
          {isVendor && (
            <Link to="/vendor" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/wishlist" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-2" /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
            </Button>
          </Link>
          <Link to="/cart" onClick={() => setMobileOpen(false)}>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" /> Cart{totalItems > 0 ? ` (${totalItems})` : ""}
            </Button>
          </Link>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-accent">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)}>
              <Button variant="default" className="w-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

