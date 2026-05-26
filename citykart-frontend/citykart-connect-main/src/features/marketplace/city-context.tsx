import React, { createContext, useContext, useEffect, useState } from "react";

const CITY_STORAGE_KEY = "citykart_city";

interface CityContextValue {
  selectedCity: string | null;
  setSelectedCity: (cityId: string | null) => void;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(CITY_STORAGE_KEY) ?? "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof selectedCity === "string" && selectedCity) {
      localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(selectedCity));
    } else {
      localStorage.removeItem(CITY_STORAGE_KEY);
    }
  }, [selectedCity]);

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within CityProvider");
  return ctx;
}
