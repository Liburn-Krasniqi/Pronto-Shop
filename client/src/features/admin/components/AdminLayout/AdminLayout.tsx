import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Footer } from "../../../../components/layout/Footer";
import { HelpAI } from "../../../../components/UI/HelpAI";
import classes from "./AdminLayout.module.css";

export function AdminLayout() {
  return (
    <div className={classes.layout}>
      <AdminSidebar />
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