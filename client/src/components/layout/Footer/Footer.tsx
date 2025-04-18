import { Container, Row, Col, Nav, NavLink } from "react-bootstrap";
import classes from "./Footer.module.css";

export function Footer() {
  return (
    <footer className="footer background-2 rounded-top-4 pt-2 mt-4">
      <Container fluid>
        <Row className="text-white mt-4 ms-3 pb-4">
          <Col>
            <Nav className="flex-column fs-5">
              <h4>Get to know us</h4>
              <NavLink className="text-white">Careers</NavLink>
              <NavLink className="text-white">Blog</NavLink>
              <NavLink className="text-white">About us</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5">
              <h4>Get to know us</h4>
              <NavLink className="text-white">Careers</NavLink>
              <NavLink className="text-white">Blog</NavLink>
              <NavLink className="text-white">About us</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5">
              <h4>Get to know us</h4>
              <NavLink className="text-white">Careers</NavLink>
              <NavLink className="text-white">Blog</NavLink>
              <NavLink className="text-white">About us</NavLink>
            </Nav>
          </Col>
          <Col>
            <Nav className="flex-column fs-5">
              <h4>Get to know us</h4>
              <NavLink className="text-white">Careers</NavLink>
              <NavLink className="text-white">Blog</NavLink>
              <NavLink className="text-white">About us</NavLink>
            </Nav>
          </Col>
        </Row>
        <Row
          className={`background-1 rounded-top-4 pt-4 ps-4 d-flex justify-content-center align-items-center ${classes.lower_footer}`}
        >
          <p className="text-white text-center fs-4">
            © 2025, ProntoShop.com, Inc.
          </p>
        </Row>
      </Container>
    </footer>
  );
}
