import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./MainNavigation.module.css";
import { NavItemWithIcon, CustomNavDropdown } from "../../UI";
import { Col } from "react-bootstrap";
import { SearchBar } from "../../UI/SearchBar/SearchBar";

export const MainNavigation: React.FC = () => {
  return (
    // using the NavBar component, expand='lg' probaly means that the collapse thingy expands on large(lg) viewports
    <Navbar expand="md" className={`rounded-bottom-4 ${classes.navbar}`}>
      {/* container fluid means this will take up 100% of the viewports width */}
      <Container fluid>
        {/* Col without specification takes most possible amount of space (width) */}
        <Col xs={1}>
          <Navbar.Brand href="/" className="ms-2">
            <img alt="Pronto Logo" src="/letter-p.svg" />
          </Navbar.Brand>
        </Col>

        {/* Everything inside the collapse dissapears when the viewport width is small enough (i dont know what is considered small enough) */}
        {/* Also all the elements appear in a dropdown after, will add a toggle but not now */}
        <Navbar.Collapse>
          <Col xs={3}>
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
          </Col>

          <Col xs={3}>
            <SearchBar />
          </Col>

          <Col xs={2} className="d-flex justify-content-end">
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
            ></CustomNavDropdown>
          </Col>

          <Col xs={2} className="d-flex justify-content-end">
            <CustomNavDropdown
              title={
                <span className="text-white">
                  Returns & <br />
                  <strong>Orders</strong>
                </span>
              }
              items={[
                { to: "/", label: "Bookmarks" },
                { to: "/Users", label: "Users (temporarily here)" },
                { to: "/", label: "Sign In" },
              ]}
            ></CustomNavDropdown>
          </Col>

          <Col xs={1} className="d-flex justify-content-end">
            <Nav.Link href="#action1">
              <img alt="cart" src="/Shopping-cart.svg" />
            </Nav.Link>
          </Col>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
