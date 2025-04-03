import { Outlet } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="layout-container">
      <MainNavigation />
      <main className="content">
        <Outlet /> {/* This renders the current route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
