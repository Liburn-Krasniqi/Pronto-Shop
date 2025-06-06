import { Col, Row, Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { CustomNavDropdown } from "../../UI";
import classes from "./AdminMainNavigation.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faChartLine, 
  faUsers, 
  faStore, 
  faBox, 
  faShoppingCart,
  faTags
} from "@fortawesome/free-solid-svg-icons";

export const AdminMainNavigation: React.FC = () => {
  const { isAuthenticated, userData, logout } = useAuth();

  return (
    <Navbar
      expand="md"
      className={`background-2 rounded-bottom-4 ${classes.navbar}`}
    >
      <Container fluid className="pe-0">
        <Row className="w-100">
          <Col xs={2} md={1} className="d-flex align-items-center">
            <Navbar.Brand className={`ms-3 ${classes.logo}`} href="/admin">
              <img alt="Pronto Admin" src="/letter-p.svg" />
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
                  Admin Menu
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body
                className={`d-flex flex-column ${classes.offcanvasBody}`}
              >
                <Nav
                  fill
                  className={`w-100 d-flex flex-md-row flex-column ${classes.offcanvasNav}`}
                >
                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/dashboard"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faChartLine} className="me-2" />
                      Dashboard
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/users"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faUsers} className="me-2" />
                      Clients
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/vendors"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faStore} className="me-2" />
                      Vendors
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/products"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faBox} className="me-2" />
                      Products
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/categories"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faTags} className="me-2" />
                      Categories
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="my-2 my-md-0 d-flex align-items-center">
                    <Nav.Link
                      href="/admin/orders"
                      className={`text-nowrap d-flex align-items-center justify-content-center text-white ${classes.navLink}`}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Orders
                    </Nav.Link>
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
                              Hello, {userData.name}
                              <br className="d-none d-md-inline" />
                              <strong>{"Admin Panel"}</strong>
                            </span>
                          ) : (
                            <span>
                              Hello, Guest
                              <br className="d-none d-md-inline" />
                              <strong>{"Sign In"}</strong>
                            </span>
                          )}
                        </span>
                      }
                      items={[
                        { to: "/admin/profile", label: "Admin Profile" },
                        { to: "/admin/settings", label: "Settings" },
                        { to: "/", label: "Log Out", onClick: logout },
                      ]}
                      className="text-md-center text-start"
                    />
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