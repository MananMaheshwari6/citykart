import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertCircle,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Star,
  Store,
  Truck,
} from "lucide-react";

import { useCity } from "@/features/marketplace/city-context";
import type { City } from "@/features/marketplace/types";
import { apiFetch, parseJsonError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchCities(): Promise<City[]> {
  const res = await apiFetch("/cities");
  if (!res.ok) throw new Error(await parseJsonError(res));
  const data = (await res.json()) as { cities: City[] };
  return data.cities ?? [];
}

const cityGradients = [
  "bg-gradient-to-br from-orange-400 to-rose-500",
  "bg-gradient-to-br from-green-400 to-teal-500",
  "bg-gradient-to-br from-blue-400 to-indigo-500",
  "bg-gradient-to-br from-purple-400 to-pink-500",
  "bg-gradient-to-br from-amber-400 to-orange-500",
  "bg-gradient-to-br from-teal-400 to-cyan-500",
];

const categoryCards: Array<{
  emoji: string;
  name: string;
  count: string;
  bg: string;
  text: string;
  muted: string;
}> = [
  {
    emoji: "🌿",
    name: "Fresh Produce",
    count: "2,400",
    bg: "bg-green-50 dark:bg-green-950/40",
    text: "text-green-900 dark:text-green-100",
    muted: "text-green-600 dark:text-green-400",
  },
  {
    emoji: "🥛",
    name: "Dairy & Eggs",
    count: "840",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-900 dark:text-amber-100",
    muted: "text-amber-600 dark:text-amber-400",
  },
  {
    emoji: "🧺",
    name: "Handicrafts",
    count: "1,200",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-900 dark:text-purple-100",
    muted: "text-purple-600 dark:text-purple-400",
  },
  {
    emoji: "📱",
    name: "Electronics",
    count: "680",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-900 dark:text-blue-100",
    muted: "text-blue-600 dark:text-blue-400",
  },
];

const heroStats: Array<{ icon: typeof Store; value: string; label: string }> = [
  { icon: Store, value: "340+", label: "local vendors" },
  { icon: Package, value: "12k+", label: "products" },
  { icon: Star, value: "4.8★", label: "avg rating" },
];

const howItWorksSteps: Array<{
  icon: typeof MapPin;
  iconBg: string;
  iconText: string;
  number: string;
  title: string;
  body: string;
}> = [
  {
    icon: MapPin,
    iconBg: "bg-orange-100 dark:bg-orange-950/40",
    iconText: "text-orange-600 dark:text-orange-400",
    number: "01",
    title: "Pick your city",
    body: "Choose from 6 cities across India and browse local vendors near you.",
  },
  {
    icon: ShoppingBag,
    iconBg: "bg-green-100 dark:bg-green-950/40",
    iconText: "text-green-600 dark:text-green-400",
    number: "02",
    title: "Browse & add to cart",
    body: "Explore thousands of products from verified local shops. Filter by category, price, and distance.",
  },
  {
    icon: Truck,
    iconBg: "bg-blue-100 dark:bg-blue-950/40",
    iconText: "text-blue-600 dark:text-blue-400",
    number: "03",
    title: "Fast local delivery",
    body: "Get your order delivered same-day or schedule a pickup directly from the vendor.",
  },
];

const footerLinkGroups: Array<{ heading: string; links: string[] }> = [
  { heading: "Product", links: ["Browse Cities", "All Products", "Vendors", "Deals"] },
  { heading: "Vendors", links: ["Start Selling", "Vendor Dashboard", "Pricing", "Support"] },
  { heading: "Company", links: ["About", "Blog", "Careers", "Privacy Policy"] },
];

export default function LandingRoute() {
  const { selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const { data: cities, isLoading, error } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });

  const handleCitySelect = (city: City) => {
    setSelectedCity(city.id);
    navigate("/products");
  };

  const handleHeroSearch = () => {
    if (!selectedCity) {
      toast.info("Pick a city below to start shopping");
      document.getElementById("city-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const q = heroSearch.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <div className="bg-background">
      {/* SECTION 2 — HERO */}
      <section className="bg-background pt-20 pb-16 border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6 lg:w-3/5"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 dark:bg-green-950/40 px-4 py-1.5 text-sm font-medium text-green-700 dark:text-green-300">
                <MapPin className="h-3.5 w-3.5" />
                Serving 6 Indian cities
              </div>

              <h1 className="font-display text-5xl lg:text-6xl font-semibold leading-[1.15] tracking-tight">
                Shop local.<br />
                Support your{" "}
                <span className="text-orange-500">city's vendors.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                Discover fresh produce, handmade goods, and everyday essentials from verified local sellers in your city.
              </p>

              <div className="flex max-w-xl rounded-2xl border bg-background shadow-sm overflow-hidden">
                <div className="flex items-center pl-4 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  className="flex-1 px-3 py-3.5 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                  placeholder="Search products, vendors, categories..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                />
                <div className="flex items-center gap-1.5 border-l px-3 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" />
                  5 km
                </div>
                <button
                  type="button"
                  onClick={handleHeroSearch}
                  className="m-1.5 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm"
                  >
                    <stat.icon className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">{stat.value}</span>
                    <span className="text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
              className="grid grid-cols-2 gap-3 hidden lg:grid lg:w-2/5"
            >
              {categoryCards.map((cat) => (
                <motion.div
                  key={cat.name}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-2xl p-5 cursor-pointer ${cat.bg}`}
                >
                  <div className="text-3xl mb-3">{cat.emoji}</div>
                  <div className={`font-semibold text-sm ${cat.text}`}>{cat.name}</div>
                  <div className={`text-xs ${cat.muted} mt-0.5`}>{cat.count} products</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CITY GRID */}
      <section id="city-grid" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-sm font-medium text-orange-500 mb-1">Choose your city</p>
              <h2 className="font-display text-3xl font-semibold">Where are you shopping today?</h2>
            </div>
            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors hidden md:block">
              All cities →
            </span>
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-2xl" />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
              <p className="text-lg font-semibold text-destructive">Could not load cities</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Please try again in a moment."}
              </p>
            </div>
          )}

          {!isLoading && !error && cities && cities.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No cities available yet.</p>
            </div>
          )}

          {!isLoading && !error && cities && cities.length > 0 && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden"
              animate="show"
            >
              {cities.map((city, i) => (
                <motion.div
                  key={city.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleCitySelect(city)}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer h-52 ${cityGradients[i % cityGradients.length]} group`}
                >
                  <div className="absolute -top-2 -right-2 text-8xl font-bold text-white/20 select-none leading-none">
                    {city.name[0]}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="text-white font-semibold text-sm">{city.name}</div>
                    <div className="text-white/70 text-xs">{city.state}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                      <Store className="h-3 w-3" />
                      {city.shopCount} shops
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION 4 — HOW IT WORKS */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-orange-500 mb-2">Simple as 1-2-3</p>
            <h2 className="font-display text-3xl font-semibold">How CityKart works</h2>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {howItWorksSteps.map((step) => (
              <div key={step.number} className="text-center">
                <div
                  className={`flex h-14 w-14 mx-auto mb-5 items-center justify-center rounded-2xl ${step.iconBg}`}
                >
                  <step.icon className={`h-7 w-7 ${step.iconText}`} />
                </div>
                <p className="text-orange-500 text-xs font-medium mb-1">{step.number}</p>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — VENDOR CTA BANNER */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-rose-500 p-10 md:p-14"
          >
            <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 flex-shrink-0">
                <Store className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="font-display text-3xl font-semibold text-white mb-2">
                  Are you a local vendor?
                </h2>
                <p className="text-white/80 text-lg max-w-lg">
                  List your products for free and reach thousands of buyers in your city today. No commission on your first 100 orders.
                </p>
              </div>
              <div className="md:ml-auto flex-shrink-0">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-orange-50 font-semibold rounded-2xl px-8"
                >
                  Start selling free →
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 6 — FOOTER */}
      <footer className="border-t bg-muted/20 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl font-semibold tracking-tight">CityKart</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3 max-w-xs">
                Connecting local vendors with buyers across Indian cities. Shop local, support local.
              </p>
            </div>

            {footerLinkGroups.map((group) => (
              <div key={group.heading}>
                <h3 className="text-sm font-semibold mb-3">{group.heading}</h3>
                {group.links.map((link) => (
                  <span
                    key={link}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5 cursor-pointer"
                  >
                    {link}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-muted-foreground">© 2026 CityKart. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for local vendors across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
