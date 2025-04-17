import { Col, Row, Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { NavItemWithIcon, CustomNavDropdown, SearchBar } from "../../UI";
import classes from "./MainNavigation.module.css";

export const MainNavigation: React.FC = () => {
  return (
    <Navbar
      expand="md"
      className={`background-2 rounded-bottom-4 ${classes.navbar}`}
    >
      <Container fluid className="pe-0">
        <Row className="w-100">
          <Col xs={2} md={1} className="d-flex align-items-center">
            <Navbar.Brand className="ms-3" href="#">
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
                  <Nav.Item className="my-2 my-md-0">
                    <Nav.Link
                      href="#action1"
                      className={`text-nowrap d-flex align-items-md-center text-white ${classes.navLink}`}
                    >
                      <NavItemWithIcon
                        iconSrc="/Map-pin.svg"
                        text={
                          <span className="text-start">
                            Deliver to <br />
                            <strong>{"Kosovo"}</strong>
                          </span>
                        }
                      />
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="flex-grow-1 align-items-center my-2">
                    <SearchBar />
                  </Nav.Item>

                  <Nav.Item
                    className="flex-grow-1 my-2 my-md-0"
                    style={{ maxWidth: "200px" }}
                  >
                    <CustomNavDropdown
                      title={
                        <span className="text-white text-start">
                          Hello, sign in <br />
                          <strong>Accounts & Lists</strong>
                        </span>
                      }
                      items={[
                        { to: "/", label: "Bookmarks" },
                        { to: "/Users", label: "Users (temporarily here)" },
                        { to: "/", label: "Sign In" },
                      ]}
                      className="text-md-center text-start"
                    />
                  </Nav.Item>

                  <Nav.Item
                    className="flex-grow-1 my-2 my-md-0"
                    style={{ maxWidth: "200px" }}
                  >
                    <CustomNavDropdown
                      title={
                        <span className="text-white text-start">
                          Returns & <br />
                          <strong>Orders</strong>
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
                      className="d-flex justify-content-md-end justify-content-start"
                      style={{ width: "fit-content" }}
                    >
                      <img
                        alt="cart"
                        src="/Shopping-cart.svg"
                        style={{ width: "48px", height: "48px" }}
                      />
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
