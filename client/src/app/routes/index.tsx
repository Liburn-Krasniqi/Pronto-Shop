import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { LandingPage } from "../../features/landing/components/LandingPage";
import { SignupPage, SigninPage } from "../../features/users/components/auth";
import { ProfilePage } from "../../features/users/components/profile";
import { EditProfilePage } from "../../features/users/components/editProfile";
import { VendorSignupForm } from "../../features/vendors/components/auth/SignUp";
import { VendorSigninForm } from "../../features/vendors/components/auth/SignIn";
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
import withAuth from "../../components/auth/withAuth";
import { ProductsIndex } from "../../features/product";


const ProtectedEditProfile = withAuth(EditProfilePage, 'user');
const ProtectedProfilePage = withAuth(ProfilePage, 'user');

const ProtectedVendorProfilePage = withAuth(ShowVendor, 'vendor');
const ProtectedVendorEditProfile = withAuth(EditVendor, 'vendor');

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
        <Route path="vendor/signin" element={<VendorSigninForm />} />
        <Route path="vendor/show" element={<ProtectedVendorProfilePage />} />
        <Route path="vendor/edit/:id" element={<ProtectedVendorEditProfile />} />
        <Route path="category/create" element={<CreateCategory />} />
        <Route path="category/show" element={<ShowCategory />} />
        <Route path="category/edit/:id" element={<EditCategory />} />
        <Route path="subcategory/create" element={<CreateSubcategory />} />
        <Route path="subcategory/show" element={<ShowSubcategories />} />
        <Route path="subcategory/edit/:id" element={<EditSubcategory />} />
        <Route path="product" element={<ProductsIndex />} />
      </Route>
    </Routes>
  );
}
