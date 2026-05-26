import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useCity } from "@/features/marketplace/city-context";
import type { City, Product, Shop } from "@/features/marketplace/types";
import { apiFetch, parseJsonError } from "@/lib/api";
import { ProductCard } from "@/shared/components/ProductCard";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductsResponse {
  items: Product[];
  page: number;
  total: number;
}

async function fetchCities(): Promise<City[]> {
  const res = await apiFetch("/cities");
  if (!res.ok) throw new Error(await parseJsonError(res));
  const data = (await res.json()) as { cities: City[] };
  return data.cities ?? [];
}

async function fetchShopsByCity(cityId: string): Promise<Shop[]> {
  const res = await apiFetch(`/cities/${encodeURIComponent(cityId)}/shops`);
  if (!res.ok) throw new Error(await parseJsonError(res));
  const data = (await res.json()) as { shops: Shop[] };
  return data.shops ?? [];
}

async function fetchProducts(params: {
  cityId: string;
  search: string;
  category: string | null;
}): Promise<ProductsResponse> {
  const qs = new URLSearchParams();
  qs.set("cityId", params.cityId);
  if (params.search.trim()) qs.set("search", params.search.trim());
  if (params.category) qs.set("category", params.category);
  qs.set("page", "1");
  qs.set("limit", "20");
  const res = await apiFetch(`/products?${qs.toString()}`);
  if (!res.ok) throw new Error(await parseJsonError(res));
  return (await res.json()) as ProductsResponse;
}

export default function ProductsRoute() {
  const { selectedCity } = useCity();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });

  const { data: shops } = useQuery({
    queryKey: ["shops", selectedCity],
    queryFn: () => fetchShopsByCity(selectedCity as string),
    enabled: !!selectedCity,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCity, debouncedSearch, selectedCategory],
    queryFn: () =>
      fetchProducts({
        cityId: selectedCity as string,
        search: debouncedSearch,
        category: selectedCategory,
      }),
    enabled: !!selectedCity,
  });

  useEffect(() => {
    if (!selectedCity) navigate("/", { replace: true });
  }, [navigate, selectedCity]);

  const cityName = useMemo(
    () => cities?.find((c) => c.id === selectedCity)?.name,
    [cities, selectedCity]
  );

  const items = productsData?.items ?? [];
  const cityShopsCount = shops?.length ?? 0;

  // Categories are derived from the current product results so the chip set
  // reflects what the API actually exposed for this city/search.
  const categories = useMemo(() => {
    const cats = new Set<string>();
    for (const p of items) cats.add(p.category);
    if (selectedCategory) cats.add(selectedCategory);
    return Array.from(cats);
  }, [items, selectedCategory]);

  if (!selectedCity) return null;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">
          Shop in {cityName ?? "your city"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {productsLoading
            ? "Loading products…"
            : `${productsData?.total ?? items.length} products from ${cityShopsCount} local shops`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
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
        <span className="text-sm text-muted-foreground">{cityName ?? selectedCity}</span>
      </div>

      {productsLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productsError && !productsLoading && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
          <p className="text-lg font-semibold text-destructive">Could not load products</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {productsError instanceof Error ? productsError.message : "Please try again in a moment."}
          </p>
        </div>
      )}

      {!productsLoading && !productsError && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {!productsLoading && !productsError && items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground mt-2">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
