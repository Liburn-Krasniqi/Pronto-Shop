import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./MainNavigation.module.css";
import CustomNavDropdown from "../custom/CustomNavDropdown";
import NavItemWithIcon from "../custom/NavItemWithIcon";

const MainNavigation: React.FC = () => {
  return (
    <Navbar expand="lg" className={`rounded-bottom-4 ${classes.navbar}`}>
      <Container fluid>
        <Navbar.Brand className="ms-3" href="#">
          <img alt="Pronto Logo" src="/letter-p.svg" />
        </Navbar.Brand>

        <Form className="d-flex position-absolute top-50 start-50 translate-middle">
          <Form.Control
            type="search"
            placeholder="Search"
            className={`rounded-4 ${classes.search}`}
            aria-label="Search"
          />
        </Form>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link
              href="#action1"
              className="ms-4 d-flex align-items-center text-white"
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

            <div className="d-flex justify-content-end position-absolute top-50 end-0 translate-middle-y">
              <CustomNavDropdown
                title={
                  <span className="text-white">
                    Hello, sign in <br />
                    <strong>Accounts & Lists</strong>
                  </span>
                }
                items={[
                  { to: "/Bookmarks", label: "Bookmarks" },
                  { to: "/", label: "Users (temporarily here)" },
                  { to: "/", label: "Sign In" },
                ]}
                className="me-4 text-white"
              />

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
                className="me-4 text-white"
              />

              <Nav.Link href="#action1" className="me-2">
                <img alt="cart" src="/Shopping-cart.svg" className="me-2" />
              </Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavigation;
