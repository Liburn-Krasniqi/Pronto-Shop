import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { LandingPage } from "../../features/landing/components/LandingPage";
import { SignupPage, SigninPage } from "../../features/users/components/auth";
import { ProfilePage } from "../../features/users/components/profile";
import { EditProfilePage } from "../../features/users/components/editProfile";
import { VendorSignupForm } from "../../features/vendors/components/SignUp";
import { ShowVendor } from "../../features/vendors/components/Show";
import { EditVendor } from "../../features/vendors/components/Edit";
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
import { TestFeature } from "../../features/testFeatures/TestFeature";
import withAuth from "../../components/auth/withAuth";
import { TestFeature1 } from "../../features/testFeatures/TestFeature1";
import { ProductsIndex } from "../../features/products";

const ProtectedEditProfile = withAuth(EditProfilePage);
const ProtectedProfilePage = withAuth(ProfilePage);

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<SigninPage />} />
        <Route path="profilePage" element={<ProtectedProfilePage />} />
        <Route path="editProfilePage" element={<ProtectedEditProfile />} />
        <Route path="vendor/signup" element={<VendorSignupForm />} />
        <Route path="vendor/show" element={<ShowVendor />} />
        <Route path="vendor/edit/:id" element={<EditVendor />} />
        <Route path="category/create" element={<CreateCategory />} />
        <Route path="category/show" element={<ShowCategory />} />
        <Route path="category/edit/:id" element={<EditCategory />} />
        <Route path="subcategory/create" element={<CreateSubcategory />} />
        <Route path="subcategory/show" element={<ShowSubcategories />} />
        <Route path="subcategory/edit/:id" element={<EditSubcategory />} />
        <Route path="TestFeature" element={<TestFeature />} />
        <Route path="TestFeature1" element={<TestFeature1 />} />
        <Route path="product" element={<ProductsIndex />} />
      </Route>
    </Routes>
  );
}
