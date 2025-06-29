import { Outlet, useLocation } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";
import { AdminMainNavigation } from "./AdminMainNavigation/AdminMainNavigation";
import { Footer } from "./Footer";
import { HelpAI } from "../UI/HelpAI";
import { useAuth } from "../../hooks/useAuth";

const Layout = () => {
  const { userType } = useAuth();
  const location = useLocation();
  
  const renderNavigation = () => {
    // Check if we're on vendor auth pages (signin/signup) - these should use regular navigation
    const isVendorAuthPage = location.pathname === '/vendor/signin' || location.pathname === '/vendor/signup';
    
    // If we're on vendor auth pages, always show regular navigation
    if (isVendorAuthPage) {
      return <MainNavigation />;
    }
    
    // Otherwise, use the user type to determine navigation
    switch (userType) {
      case 'admin':
        return <AdminMainNavigation />;
      default:
        return <MainNavigation />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {renderNavigation()}
      <main className="flex-grow-1 px-5 py-5">
        <Outlet />
      </main>
      <Footer />
      <HelpAI />
    </div>
  );
};

export default Layout;
