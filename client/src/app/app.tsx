import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./global.css";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";
import { AppRoutes } from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <AppRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AppRouter>
  </AppProvider>
);
