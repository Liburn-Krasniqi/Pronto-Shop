import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faBox, 
  faShoppingCart,
  faSignOutAlt,
  faUserCircle,
  faStore
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../hooks/useAuth";
import { ConfirmationDialog } from "../../../../components/UI";
import classes from "./VendorSidebar.module.css";

export const VendorSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    logoutWithConfirmation,
    showLogoutConfirm,
    handleLogoutConfirm,
    handleLogoutCancel
  } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logoutWithConfirmation();
  };

  const onConfirmLogout = () => {
    handleLogoutConfirm();
    navigate('/');
  };

  return (
    <div className={`${classes.sidebar} d-flex flex-column`}>
      <div className={classes.logoContainer}>
        <img alt="Pronto Vendor" src="/letter-p-2.svg" className={classes.logo} />
      </div>
      
      <Nav className={classes.nav}>
        <Nav.Item>
          <Link
            to="/vendor/dashboard"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/dashboard') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Dashboard
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/vendor/products"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/products') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faBox} className="me-2" />
            My Products
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/vendor/orders"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/orders') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Orders
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/vendor/inventory"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/inventory') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faStore} className="me-2" />
            Inventory
          </Link>
        </Nav.Item>

        <Nav.Item>
          <Link
            to="/vendor/gift-cards"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/gift-cards') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faBox} className="me-2" />
            Gift Cards
          </Link>
        </Nav.Item>
      </Nav>

      <div className="mt-auto">
        <Nav.Item>
          <Link
            to="/vendor/profile"
            className={`d-flex align-items-center ${classes.navLink} ${isActive('/vendor/profile') ? classes.active : ''}`}
          >
            <FontAwesomeIcon icon={faUserCircle} className="me-2" />
            Vendor Profile
          </Link>
        </Nav.Item>
        <button 
          onClick={handleLogout}
          className={`d-flex align-items-center ${classes.logoutButton}`}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
          Logout
        </button>
      </div>

      <ConfirmationDialog
        show={showLogoutConfirm}
        onHide={handleLogoutCancel}
        onConfirm={onConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="success"
      />
    </div>
  );
}; 