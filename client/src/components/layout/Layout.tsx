import { Outlet } from "react-router-dom";
import { MainNavigation } from "./MainNavigation";
import { Footer } from "./Footer";

const Layout = () => {
  return (
    <div className="layout-container background-4">
      <MainNavigation />
      <main className="content px-5 py-5">
        <Outlet /> {/* This renders the current route's component */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
