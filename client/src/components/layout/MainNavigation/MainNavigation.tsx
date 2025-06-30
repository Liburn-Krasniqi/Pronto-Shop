import { Col, Row, Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { NavItemWithIcon, CustomNavDropdown, SearchBar, ConfirmationDialog } from "../../UI";
import classes from "./MainNavigation.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { useWishlistStore } from "../../../stores/wishlistStore";
import { useCartStore } from "../../../stores/cartStore";
import { ShoppingCart, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const MainNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    userData, 
    userType, 
    logoutWithConfirmation,
    showLogoutConfirm,
    handleLogoutConfirm,
    handleLogoutCancel
  } = useAuth();
  const { getCount: getWishlistCount } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const wishlistCount = getWishlistCount();
  const cartCount = cartItems.length;

  const handleConfirmLogout = () => {
    handleLogoutConfirm();
    navigate('/');
  };

  return (
    <Navbar
      expand="md"
      className={`background-2 rounded-bottom-4 ${classes.navbar}`}
    >
      <Container fluid className="pe-0">
        <Row className="w-100 align-items-center">
          {/* Logo section - Left */}
          <Col xs={2} md={1} className="d-flex align-items-center">
            <Navbar.Brand className={`ms-3 ${classes.logo}`} as={Link} to="/">
              <img alt="Pronto Logo" src="/letter-p.svg" />
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="offcanvasNavbar-expand-md"
              className={`position-absolute end-0 top-50 translate-middle-y ${classes.toggleButton}`}
            />
          </Col>

          <Col xs={10} md={11}>
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-md"
              aria-labelledby="offcanvasNavbarLabel-expand-md"
              placement="end"
              className={classes.offcanvas}
            >
              <Offcanvas.Header closeButton className={classes.offcanvasHeader}>
                <Offcanvas.Title
                  id="offcanvasNavbarLabel-expand-md"
                  className="text-white"
                >
                  Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body
                className={`d-flex flex-column ${classes.offcanvasBody}`}
              >
                <Nav
                  fill
                  className={`w-100 d-flex flex-md-row flex-column align-items-center justify-content-between ${classes.offcanvasNav}`}
                >
                  {/* About Us and Contact Us Links - Left */}
                  <div className="d-flex align-items-center gap-3 me-3">
                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/about"
                        className="d-flex align-items-center text-decoration-none"
                        style={{ marginRight: "15px" }}
                      >
                        <span className="text-start text-white">
                          About Us
                        </span>
                      </Link>
                    </Nav.Item>

                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/contact"
                        className="d-flex align-items-center text-decoration-none"
                        style={{ marginRight: "15px" }}
                      >
                        <span className="text-start text-white">
                          Contact Us
                        </span>
                      </Link>
                    </Nav.Item>

                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/faq"
                        className="d-flex align-items-center text-decoration-none"
                        style={{ marginRight: "15px" }}
                      >
                        <span className="text-start text-white">
                          FAQ
                        </span>
                      </Link>
                    </Nav.Item>
                  </div>

                  {/* Search Bar - Center */}
                  <Nav.Item className="flex-grow-1 d-flex justify-content-center align-items-center mx-4">
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                      <SearchBar />
                    </div>
                  </Nav.Item>

                  {/* Right section - Orders, Cart, Account */}
                  <div className="d-flex align-items-center gap-3">
                    {isAuthenticated && (
                      <Nav.Item className="d-flex align-items-center">
                        <Link
                          to="/orders"
                          className="d-flex align-items-center text-decoration-none"
                          style={{ marginRight: "20px" }}
                        >
                          <span className="text-start text-white">
                            Orders & {""}
                            <span className="d-md-none"> </span>
                            <br className="d-none d-md-inline" />
                            <strong>{"History"}</strong>
                          </span>
                        </Link>
                      </Nav.Item>
                    )}

                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/cart"
                        className="d-flex align-items-center position-relative"
                        style={{ marginRight: "20px" , marginLeft: "20px"}}
                      >
                        <img
                          alt="cart"
                          src="/Shopping-cart.svg"
                          style={{ width: "32px", height: "32px" }}
                          className={classes.cartIcon}
                        />
                        <span className={`ms-2 ${classes.cartText}`}>
                          Your Cart
                        </span>
                        {cartCount > 0 && (
                          <span 
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                            style={{ 
                              fontSize: '0.7rem', 
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: '#206a5d',
                              color: 'white'
                            }}
                          >
                            {cartCount}
                          </span>
                        )}
                      </Link>
                    </Nav.Item>

                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/wishlist"
                        className="d-flex align-items-center position-relative"
                        style={{ marginRight: "20px" }}
                      >
                        <Heart
                          size={32}
                          className={classes.cartIcon}
                          style={{ color: "white" }}
                        />
                        <span className={`ms-2 ${classes.cartText}`}>
                          Wishlist
                        </span>
                        {wishlistCount > 0 && (
                          <span 
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                            style={{ 
                              fontSize: '0.7rem', 
                              transform: 'translate(-50%, -50%)',
                              backgroundColor: '#206a5d',
                              color: 'white'
                            }}
                          >
                            {wishlistCount}
                          </span>
                        )}
                      </Link>
                    </Nav.Item>

                    <Nav.Item className="d-flex align-items-center">
                      <CustomNavDropdown
                        title={
                          <span className="text-start text-white d-flex align-items-center">
                            {isAuthenticated ? (
                              <>
                                {userType === "vendor" && userData?.profilePicture && (
                                  <img 
                                    src={`http://localhost:3333${userData.profilePicture}`}
                                    alt="Profile"
                                    className="rounded-circle me-2"
                                    style={{
                                      width: '32px',
                                      height: '32px',
                                      objectFit: 'cover',
                                      border: '2px solid #81b214'
                                    }}
                                  />
                                )}
                                <span>
                                  Hello, {userType === "user" ? userData.firstName: userData.name}  {""}
                                  <span className="d-md-none"> </span>
                                  <br className="d-none d-md-inline" />
                                  <strong>{"Account"}</strong>
                                </span>
                              </>
                            ) : (
                              <span>
                                Hello, Guest  {""}
                                <span className="d-md-none"> </span>
                                <br className="d-none d-md-inline" />
                                <strong>{"Sign In"}</strong>
                              </span>
                            )}
                          </span>
                        }
                        items={isAuthenticated ? userType === "user" ? [
                          { to: "user/profile", label: "Your Profile" },
                          { label: "Log Out", onClick: logoutWithConfirmation },
                        ] : [
                          { to: "/", label: "Add Product" },
                          { to: "/", label: "Your Business" },
                          { label: "Log Out", onClick: logoutWithConfirmation },
                        ]: [
                          { to: "/login", label: "Sign In as Client" },
                          { to: "/vendor/signin", label: "Sign In as Business" },
                        ]}
                        className="text-md-end text-start"
                      />
                    </Nav.Item>
                  </div>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Col>
        </Row>
      </Container>

      <ConfirmationDialog
        show={showLogoutConfirm}
        onHide={handleLogoutCancel}
        onConfirm={handleConfirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="success"
      />
    </Navbar>
  );
};
