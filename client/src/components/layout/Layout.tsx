import { Outlet } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";
import {VendorMainNavigation} from "./VendorMainNavigation";
import { Footer } from "./Footer";
import { useAuth } from "../../hooks/useAuth";

const Layout = () => {

  const { userType } = useAuth();
  return (
    <div className="layout-container background-4">
      {userType === "vendor" ? <VendorMainNavigation /> : <MainNavigation />}
      
      <main className="content px-5 py-5">
        
        <Outlet /> {/* This renders the current route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
