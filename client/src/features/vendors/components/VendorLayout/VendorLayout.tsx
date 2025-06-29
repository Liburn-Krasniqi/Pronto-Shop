import { Outlet } from "react-router-dom";
import { VendorSidebar } from "./VendorSidebar";
import { Footer } from "../../../../components/layout/Footer";
import { HelpAI } from "../../../../components/UI/HelpAI";
import classes from "./VendorLayout.module.css";

export function VendorLayout() {
  return (
    <div className={classes.layout}>
      <VendorSidebar />
      <div className={classes.content}>
        <main className={classes.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
      <HelpAI />
    </div>
  );
} 