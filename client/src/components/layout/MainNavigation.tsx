import { NavLink } from "react-router-dom";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div>NavBar</div>
      <nav>
        <ul>
          <li>
            <NavLink to={"/"}>Users</NavLink>
          </li>
          <li>
            <NavLink to={"/bookmarks"}>Bookmarks</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
