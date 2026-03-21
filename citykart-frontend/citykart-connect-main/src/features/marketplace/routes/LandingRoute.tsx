import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Shield, TrendingUp, Truck } from "lucide-react";
import { motion } from "framer-motion";

import { cities } from "@/features/marketplace/data/mock";
import { useCity } from "@/features/marketplace/city-context";

export default function LandingRoute() {
  const { setSelectedCity } = useCity();
  const navigate = useNavigate();

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    navigate("/products");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="relative overflow-hidden bg-hero-gradient py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="container relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-primary-foreground leading-tight"
          >
            Your City,<br />
            Your Marketplace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto font-body"
          >
            Discover local shops, unique products, and support businesses in your city.
          </motion.p>
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Choose Your City</h2>
          <p className="mt-3 text-muted-foreground">Browse products from local vendors near you</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, i) => (
            <motion.button
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => handleCitySelect(city.id)}
              className="group relative overflow-hidden rounded-2xl h-56 shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary-foreground" />
                  <span className="text-sm text-primary-foreground/80">{city.state}</span>
                </div>
                <h3 className="text-2xl font-bold font-display text-primary-foreground">{city.name}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-primary-foreground/70">{city.shopCount} shops</span>
                  <ArrowRight className="h-5 w-5 text-primary-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Support Local", desc: "Every purchase supports a local business in your city" },
              { icon: Truck, title: "Fast Delivery", desc: "Same-city delivery ensures you get products quickly" },
              { icon: Shield, title: "Secure Payments", desc: "All transactions are protected and verified" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="h-14 w-14 rounded-2xl bg-hero-gradient flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-secondary-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">© 2026 CityKart. All rights reserved.</div>
      </footer>
    </div>
  );
}

