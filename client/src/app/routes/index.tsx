import { Route, Routes } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { LandingPage } from "../../features/landing/components/LandingPage";
import { Users } from "../../features/users/Users";
import { SigninPage } from "../../features/users/Signin";
import { SignupPage } from "../../features/users/Signup";
import { ProfilePage } from "../../features/users/ProfilePage"
import { EditProfilePage } from "../../features/users/UpdateProfile";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="users" element={<Users />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="signin" element={<SigninPage />} />
        <Route path="ProfilePage" element={<ProfilePage />} />
        <Route path="EditProfilePage" element={<EditProfilePage />} />


      </Route>
    </Routes>
  );
}
