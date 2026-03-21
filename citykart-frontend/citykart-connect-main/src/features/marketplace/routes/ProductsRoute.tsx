import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";

import { cities, products, shops } from "@/features/marketplace/data/mock";
import { useCity } from "@/features/marketplace/city-context";
import { ProductCard } from "@/shared/components/ProductCard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductsRoute() {
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const cityName = cities.find((c) => c.id === selectedCity)?.name;

  const cityProducts = useMemo(() => {
    if (!selectedCity) return [];
    return products.filter((p) => {
      if (p.cityId !== selectedCity) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedCity, search, selectedCategory]);

  const categories = useMemo(() => {
    if (!selectedCity) return [];
    const cats = new Set(products.filter((p) => p.cityId === selectedCity).map((p) => p.category));
    return Array.from(cats);
  }, [selectedCity]);

  const cityShops = shops.filter((s) => s.cityId === selectedCity);

  useEffect(() => {
    if (!selectedCity) navigate("/", { replace: true });
  }, [navigate, selectedCity]);

  if (!selectedCity) return null;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">Shop in {cityName}</h1>
        <p className="mt-2 text-muted-foreground">
          {cityProducts.length} products from {cityShops.length} local shops
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <Button variant={selectedCategory === null ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(null)}>
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant="secondary">City</Badge>
        <span className="text-sm text-muted-foreground">{cityName}</span>
      </div>

      {cityProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cityProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}

