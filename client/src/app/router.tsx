import { BrowserRouter } from "react-router-dom";

export function AppRouter({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
