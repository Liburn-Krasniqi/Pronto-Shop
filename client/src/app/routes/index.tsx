import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { LandingPage } from "../../features/landing/components/LandingPage";
import { SignupPage, SigninPage } from "../../features/users/components/auth";
import { ProfilePage } from "../../features/users/components/profile";
import { VendorSignupForm } from "../../features/vendors/components/auth/SignUp";
import { VendorSigninForm } from "../../features/vendors/components/auth/SignIn";
import { VendorProfile } from "../../features/vendors/components/Profile/VendorProfile";
import { EditVendor } from "../../features/vendors/components/Profile/Edit";
import { VendorLayout, VendorDashboard, VendorProductsPage, VendorOrdersPage, VendorInventoryPage } from "../../features/vendors/components";
import { PublicVendorPage } from "../../features/vendors/components/PublicVendorPage";
import {
  CreateCategory,
  ShowCategory,
  EditCategory,
} from "../../features/categories/components/index";
import {
  CreateSubcategory,
  EditSubcategory,
  ShowSubcategories,
} from "../../features/subcategories/components/index";
import { AdminLayout } from "../../features/admin/components/AdminLayout/AdminLayout";
import { Dashboard } from "../../features/admin/components/Dashboard/Dashboard";
import { AdminLoginPage } from "../../features/admin/components/auth/AdminLoginPage";
import { UsersPage } from "../../features/admin/components/Users/UsersPage";
import { VendorsPage } from "../../features/admin/components/Vendors/VendorsPage";
import { ProductsPage } from "../../features/admin/components/Products/ProductsPage";
import { OrdersPage } from "../../features/admin/components/Orders/OrdersPage";
import { AdminProfile } from "../../features/admin/components/Profile/AdminProfile";
import { CategoriesPage } from "../../features/admin/components/Categories/CategoriesPage";
import { ProductDetail } from "../../features/product/components/ProductDetail/ProductDetail";
import { SearchResults } from "../../features/search/SearchResults";
import CartPage from "../../features/cart/CartPage";
import { WishlistPage } from "../../features/wishlist";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import PaymentPage from "../../features/payment/PaymentPage";
import OrderSuccessPage from "../../features/payment/OrderSuccessPage";
import { UserOrdersPage } from "../../features/orders/UserOrdersPage";
import { AboutPage } from "../../features/about";
import { ContactPage } from "../../features/contact";
import { FAQPage } from "../../features/faq";
import { ConditionsPage } from "../../features/conditions";
import { PrivacyPage } from "../../features/privacy";
import { ProductReviewsPage } from '../../features/product/components/ProductReviewsPage';
import { NotFoundPage } from "../../components/UI/NotFoundPage";

import withAuth from "../../components/auth/withAuth";
import { ProductsIndex } from "../../features/product";
import { GiftCardsPage } from "../../features/admin/components/GiftCards/GiftCardsPage";
import { GiftCardsPage as VendorGiftCardsPage } from "../../features/vendors/components/GiftCards/GiftCardsPage";

const ProtectedProfilePage = withAuth(ProfilePage, 'user');
const ProtectedCheckoutPage = withAuth(CheckoutPage, 'user');
const ProtectedPaymentPage = withAuth(PaymentPage, 'user');
const ProtectedUserOrdersPage = withAuth(UserOrdersPage, 'user');

const ProtectedVendorProfilePage = withAuth(VendorProfile, 'vendor');
const ProtectedVendorEditProfile = withAuth(EditVendor, 'vendor');
const ProtectedVendorLayout = withAuth(VendorLayout, 'vendor');

const ProtectedAdminLayout = withAuth(AdminLayout, 'admin');
const ProtectedOrdersPage = withAuth(OrdersPage, 'admin');
const ProtectedAdminProfile = withAuth(AdminProfile, 'admin');

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="conditions" element={<ConditionsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<SigninPage />} />
        <Route path="user/profile" element={<ProtectedProfilePage />} />
        <Route path="vendor/signup" element={<VendorSignupForm />} />
        <Route path="vendor/signin" element={<VendorSigninForm />} />
        <Route path="vendor/edit" element={<ProtectedVendorEditProfile />} />
        <Route path="category/create" element={<CreateCategory />} />
        <Route path="category/show" element={<ShowCategory />} />
        <Route path="category/edit" element={<EditCategory />} />
        <Route path="subcategory/create" element={<CreateSubcategory />} />
        <Route path="subcategory/show" element={<ShowSubcategories />} />
        <Route path="subcategory/edit/:id" element={<EditSubcategory />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="product/:id/reviews" element={<ProductReviewsPage />} />
        <Route path="store/:id" element={<PublicVendorPage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="checkout" element={<ProtectedCheckoutPage />} />
        <Route path="payment/:orderId" element={<ProtectedPaymentPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="orders" element={<ProtectedUserOrdersPage />} />
      </Route>

      {/* Vendor routes */}
      <Route path="/vendor" element={<ProtectedVendorLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="products" element={<VendorProductsPage />} />
        <Route path="orders" element={<VendorOrdersPage />} />
        <Route path="inventory" element={<VendorInventoryPage />} />
        <Route path="profile" element={<ProtectedVendorProfilePage />} />
        <Route path="gift-cards" element={<VendorGiftCardsPage />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<ProtectedAdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<ProtectedOrdersPage />} />
        <Route path="profile" element={<ProtectedAdminProfile />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="gift-cards" element={<GiftCardsPage />} />
      </Route>

      {/* 404 - Catch all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
