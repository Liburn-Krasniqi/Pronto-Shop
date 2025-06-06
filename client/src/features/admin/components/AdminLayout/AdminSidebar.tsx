import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faUsers, 
  faStore, 
  faBox, 
  faShoppingCart,
  faTags,
  faSignOutAlt,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import classes from "./AdminSidebar.module.css";

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={`${classes.sidebar} d-flex flex-column`}>
      <div className={classes.logoContainer}>
        <img alt="Pronto Admin" src="/letter-p.svg" className={classes.logo} />
      </div>
      <Nav className={`flex-column ${classes.nav}`}>
        <Nav.Item>
          <Link
            to="/admin/dashboard"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/dashboard') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Dashboard
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/admin/users"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/users') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Clients
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/admin/vendors"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/vendors') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faStore} className="me-2" />
            Vendors
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/admin/products"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/products') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faBox} className="me-2" />
            Products
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/admin/categories"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/categories') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faTags} className="me-2" />
            Categories
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/admin/orders"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/orders') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Orders
          </Link>
        </Nav.Item>
      </Nav>

      <div className="mt-auto">
        <Link
          to="/admin/profile"
          className={`d-flex align-items-center ${classes.navLink} ${isActive('/admin/profile') ? classes.active : ''}`}
        >
          <FontAwesomeIcon icon={faUserCircle} className="me-2" />
          Admin Profile
        </Link>
        <button 
          onClick={handleLogout}
          className={`d-flex align-items-center ${classes.logoutButton}`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
}; 