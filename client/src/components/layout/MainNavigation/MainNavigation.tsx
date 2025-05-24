import { Col, Row, Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { NavItemWithIcon, CustomNavDropdown, SearchBar } from "../../UI";
import classes from "./MainNavigation.module.css";
import { useAuth } from "../../../hooks/useAuth";

export const MainNavigation: React.FC = () => {
  const { isAuthenticated, userData, userType, logout } = useAuth();

  return (
    <Navbar
      expand="md"
      className={`background-2 rounded-bottom-4 ${classes.navbar}`}
    >
      <Container fluid className="pe-0">
        <Row className="w-100">
          <Col xs={2} md={1} className="d-flex align-items-center">
            <Navbar.Brand className={`ms-3 ${classes.logo}`} href="#">
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
                  className={`w-100 d-flex flex-md-row flex-column ${classes.offcanvasNav}`}
                >
                  {/* Search Bar first in mobile */}
                  <Nav.Item className="flex-grow-1 align-items-center my-2 d-md-none">
                    <SearchBar />
                  </Nav.Item>
                  <Nav.Item className="my-2 my-md-0">
                    <Nav.Link
                      href="#action1"
                      className={`text-nowrap d-flex align-items-md-center text-white ${classes.navLink}`}
                    >
                      <NavItemWithIcon
                        iconSrc="/Map-pin.svg"
                        text={
                          <span className="text-start">
                            Deliver to{""}
                            <span className="d-md-none"> </span>
                            <br className="d-none d-md-inline" />
                            <strong>{"Kosovo"}</strong>
                          </span>
                        }
                      />
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="flex-grow-1 align-items-center my-2 d-none d-md-block">
                    <SearchBar />
                  </Nav.Item>

                  <Nav.Item
                    className="flex-grow-1 my-2 my-md-0"
                    style={{ maxWidth: "200px" }}
                  >
                    <CustomNavDropdown
                      title={
                        <span className="text-start text-white">
                          {isAuthenticated ? (
                            <span>
                              Hello, {userType === "user" ? userData.firstName: userData.name}  {""}
                              <span className="d-md-none"> </span>
                              <br className="d-none d-md-inline" />
                              <strong>{"Accounts & Lists"}</strong>
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
                        { to: "/", label: "Buy" },
                        { to: "/profilePage", label: "Your Profile" },
                        { to: "/", label: "Log Out", onClick: logout },
                      ] : [
                        { to: "/", label: "Add Product" },
                        { to: "/", label: "Your Business" },
                        { to: "/", label: "Log Out", onClick: logout },
                        
                      ]: [
                        { to: "/login", label: "Sign In as Client" },
                        { to: "/vendor/signin", label: "Sign In as Business" },
                      ]}
                      className="text-md-center text-start"
                    />
                    {/* <Nav.Link onClick={logout}>Log Out</Nav.Link> */}
                  </Nav.Item>

                  <Nav.Item
                    className="flex-grow-1 my-2 my-md-0"
                    style={{ maxWidth: "200px" }}
                  >
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
                        { to: "#action3", label: "Action" },
                        { to: "#action4", label: "Another action" },
                        { to: "#action5", label: "Something else here" },
                      ]}
                      className="text-md-center text-start"
                    />
                  </Nav.Item>
                  <Nav.Item className="flex-grow-0 my-2 my-md-0">
                    <Nav.Link
                      href="#action1"
                      className="d-flex justify-content-md-end justify-content-start align-items-center"
                      style={{ width: "fit-content" }}
                    >
                      <img
                        alt="cart"
                        src="/Shopping-cart.svg"
                        style={{ width: "48px", height: "48px" }}
                        className={classes.cartIcon}
                      />
                      <span className={`ms-2 ${classes.cartText}`}>
                        Your Cart
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};
