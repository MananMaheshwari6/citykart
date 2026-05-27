import type { PropsWithChildren } from "react";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/features/auth/auth-context";
import { CartProvider } from "@/features/cart/cart-context";
import { CityProvider } from "@/features/marketplace/city-context";
import { WishlistProvider } from "@/features/wishlist/wishlist-context";

import { queryClient } from "@/app/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <CityProvider>
              <CartProvider>
                <WishlistProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </WishlistProvider>
              </CartProvider>
            </CityProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

