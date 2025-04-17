import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./MainNavigation.module.css";
import { NavItemWithIcon, CustomNavDropdown } from "../../UI";
import { Col, Row } from "react-bootstrap";
import { SearchBar } from "../../UI/SearchBar/SearchBar";

export const MainNavigation: React.FC = () => {
  return (
    <Navbar className={`background-2 rounded-bottom-4 ${classes.navbar}`}>
      <Container fluid className="pe-0">
        <Row className="w-100">
          <Col xs={1} md={1} className="d-flex align-items-center">
            <Navbar.Brand className="ms-3" href="#">
              <img alt="Pronto Logo" src="/letter-p.svg" />
            </Navbar.Brand>
          </Col>

          <Col xs={11} md={11} className="flex-grow-1">
            <Nav
              fill
              className="w-100 d-flex justify-content-center align-items-center"
            >
              <Nav.Item>
                <Nav.Link
                  href="#action1"
                  className="text-nowrap d-flex align-items-center text-white"
                >
                  <NavItemWithIcon
                    iconSrc="/Map-pin.svg"
                    text={
                      <span>
                        Deliver to <br />
                        <strong>{"Kosovo"}</strong>
                      </span>
                    }
                  />
                </Nav.Link>
              </Nav.Item>

              <Nav.Item className="flex-grow-1 align-items-center">
                <SearchBar></SearchBar>
              </Nav.Item>

              <Nav.Item className="flex-grow-1" style={{ maxWidth: "200px" }}>
                <CustomNavDropdown
                  title={
                    <span className="text-white">
                      Hello, sign in <br />
                      <strong>Accounts & Lists</strong>
                    </span>
                  }
                  items={[
                    { to: "/", label: "Bookmarks" },
                    { to: "/Users", label: "Users (temporarily here)" },
                    { to: "/", label: "Sign In" },
                  ]}
                  className="text-center"
                ></CustomNavDropdown>
              </Nav.Item>

              <Nav.Item className="flex-grow-1" style={{ maxWidth: "200px" }}>
                <CustomNavDropdown
                  title={
                    <span className="text-white">
                      Returns & <br />
                      <strong>Orders</strong>
                    </span>
                  }
                  items={[
                    { to: "#action3", label: "Action" },
                    { to: "#action4", label: "Another action" },
                    { to: "#action5", label: "Something else here" },
                  ]}
                  className="text-center"
                />
              </Nav.Item>

              <Nav.Item className="flex-grow-0">
                <Nav.Link
                  href="#action1"
                  className="d-flex justify-content-end"
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
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};
