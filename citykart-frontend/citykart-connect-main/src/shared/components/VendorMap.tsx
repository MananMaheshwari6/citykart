import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { useCity } from "@/features/marketplace/city-context";

// Vite + Leaflet workaround: the default icon resolves to a non-existent
// path because Leaflet detects its own URL via a script tag that doesn't
// exist in a bundled build. Override the URLs with the bundler-resolved
// asset paths.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Vendor {
  name: string;
  lat: number;
  lng: number;
  category: string;
}

const vendors: Vendor[] = [
  { name: "Rajpur Road Organics", lat: 30.3433, lng: 78.0527, category: "Vegetables & Fruits" },
  { name: "Sahastradhara Dairy", lat: 30.378, lng: 78.102, category: "Dairy" },
  { name: "Astley Hall Bakehouse", lat: 30.3204, lng: 78.0289, category: "Bakery" },
  { name: "Paltan Bazaar Handicrafts", lat: 30.3247, lng: 78.0413, category: "Handicrafts" },
  { name: "Clock Tower Electronics", lat: 30.3251, lng: 78.0421, category: "Electronics" },
  { name: "Doon Valley Clothing", lat: 30.318, lng: 78.035, category: "Clothing" },
  { name: "Garhwal Tea & Spices", lat: 30.309, lng: 78.028, category: "Organic" },
  { name: "Mussoorie Diversion Flowers", lat: 30.352, lng: 78.068, category: "Flowers & Plants" },
];

export function VendorMap() {
  const { selectedCity } = useCity();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (selectedCity !== "dehradun") return;
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(containerRef.current).setView([30.3165, 78.0322], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    for (const vendor of vendors) {
      L.marker([vendor.lat, vendor.lng])
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 140px;">
            <strong style="font-size: 13px;">${vendor.name}</strong><br/>
            <span style="font-size: 11px; color: #666;">${vendor.category}</span><br/>
            <span style="font-size: 11px; color: #f97316; margin-top: 4px; display:block;">📍 Dehradun</span>
          </div>
        `);
    }

    mapRef.current = map;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [selectedCity]);

  if (selectedCity !== "dehradun") return null;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold text-base">Vendors near you in Dehradun</h3>
        <span className="text-sm text-muted-foreground ml-1">— click a pin for details</span>
      </div>
      <div
        ref={containerRef}
        style={{
          height: "380px",
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid hsl(var(--border))",
        }}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Showing {vendors.length} verified vendors · Map data © OpenStreetMap
      </p>
    </div>
  );
}
