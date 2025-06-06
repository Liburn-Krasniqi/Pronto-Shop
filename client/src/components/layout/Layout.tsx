import { Outlet } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";
import {VendorMainNavigation} from "./VendorMainNavigation";
import { AdminMainNavigation } from "./AdminMainNavigation/AdminMainNavigation";
import { Footer } from "./Footer";
import { useAuth } from "../../hooks/useAuth";

const Layout = () => {
  const { userType } = useAuth();
  
  const renderNavigation = () => {
    switch (userType) {
      case 'vendor':
        return <VendorMainNavigation />;
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
    </div>
  );
};

export default Layout;
