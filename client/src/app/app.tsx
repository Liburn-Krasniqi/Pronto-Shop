import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./global.css";
import { AppProvider } from "./provider";
import { AppRouter } from "./router";
import { AppRoutes } from "./routes";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <AppRouter>
      <AppRoutes />
    </AppRouter>
  </AppProvider>
);
