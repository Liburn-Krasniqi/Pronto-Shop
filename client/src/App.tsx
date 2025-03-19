import { Route, Routes } from "react-router-dom";

import Users from "./pages/users/Users";
import Bookmarks from "./pages/bookmarks/Bookmarks";
import MainNavigation from "./components/layout/MainNavigation";

function App() {
  return (
    <div>
      <MainNavigation />
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/Bookmarks" element={<Bookmarks />} />
      </Routes>
    </div>
  );
}

export default App;
