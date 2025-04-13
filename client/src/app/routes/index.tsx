import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { LandingPage } from "../../features/landing/components/LandingPage";
import { SuppliesPage } from "../../features/SuppliesPage";
import { Users } from "../../features/users/Users";
import { Cart } from "../../features/Cart";
import { LoginRegister } from "../../features/LoginRegister";
import { Checkout } from "../../features/Checkout";
import { OrderStatus } from "../../features/OrderStatus";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="/supplies/:id" element={<SuppliesPage />} />
        <Route path="/products/:id" element={<SuppliesPage />} />
        <Route path="/order_status/:orderId" element={<OrderStatus />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account/auth" element={<LoginRegister />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}

