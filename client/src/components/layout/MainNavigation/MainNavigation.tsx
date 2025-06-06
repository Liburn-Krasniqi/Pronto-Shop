import { Col, Row, Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { NavItemWithIcon, CustomNavDropdown, SearchBar } from "../../UI";
import classes from "./MainNavigation.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MainNavigation: React.FC = () => {
  const { isAuthenticated, userData, userType, logout } = useAuth();

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
                        <CustomNavDropdown
                          title={
                            <span className="text-start text-white">
                              Returns & {""}
                              <span className="d-md-none"> </span>
                              <br className="d-none d-md-inline" />
                              <strong>{"Orders"}</strong>
                            </span>
                          }
                          items={[
                            { to: "/orders", label: "Your Orders" },
                            { to: "/returns", label: "Returns" },
                            { to: "/orders/history", label: "Order History" },
                          ]}
                          className="text-md-center text-start"
                        />
                      </Nav.Item>
                    )}

                    <Nav.Item className="d-flex align-items-center">
                      <Link
                        to="/cart"
                        className="d-flex align-items-center"
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
                      </Link>
                    </Nav.Item>

                    <Nav.Item className="d-flex align-items-center">
                      <CustomNavDropdown
                        title={
                          <span className="text-start text-white">
                            {isAuthenticated ? (
                              <span>
                                Hello, {userType === "user" ? userData.firstName: userData.name}  {""}
                                <span className="d-md-none"> </span>
                                <br className="d-none d-md-inline" />
                                <strong>{"Account"}</strong>
                              </span>
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
                          { to: "/", label: "Log Out", onClick: logout },
                        ] : [
                          { to: "/", label: "Add Product" },
                          { to: "/", label: "Your Business" },
                          { to: "/", label: "Log Out", onClick: logout },
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
    </Navbar>
  );
};
