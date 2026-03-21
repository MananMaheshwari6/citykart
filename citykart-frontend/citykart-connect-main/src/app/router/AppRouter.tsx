import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Header } from "@/shared/components/Header";

import LandingRoute from "@/features/marketplace/routes/LandingRoute";
import ProductsRoute from "@/features/marketplace/routes/ProductsRoute";
import ProductDetailRoute from "@/features/marketplace/routes/ProductDetailRoute";
import AuthRoute from "@/features/auth/routes/AuthRoute";
import CartRoute from "@/features/cart/routes/CartRoute";
import OrdersRoute from "@/features/orders/routes/OrdersRoute";
import VendorDashboardRoute from "@/features/vendor/routes/VendorDashboardRoute";
import NotFoundRoute from "@/app/router/NotFoundRoute";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/auth" element={<AuthRoute />} />
        <Route path="/products" element={<ProductsRoute />} />
        <Route path="/product/:id" element={<ProductDetailRoute />} />
        <Route path="/cart" element={<CartRoute />} />
        <Route path="/orders" element={<OrdersRoute />} />
        <Route path="/vendor" element={<VendorDashboardRoute />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

