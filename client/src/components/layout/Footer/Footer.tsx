import { Container, Row, Col, Nav, NavLink } from "react-bootstrap";
import classes from "./Footer.module.css";
import { useAuth } from "../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export function Footer() {
  const { userType } = useAuth();
  const isVendor = userType === "vendor";
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isVendorRoute = location.pathname.startsWith('/vendor');
  const isVendorAuthPage = location.pathname === '/vendor/signin' || location.pathname === '/vendor/signup';

  return (
    <footer className={`${isVendor ? 'background-1' : 'background-2'} footer rounded-top-4 pt-2 mt-4`}>
      <Container fluid>
        {!isAdminRoute && (!isVendorRoute || isVendorAuthPage) && (
          <Row className="text-white mt-2 ms-3 pb-2">
            <Col>
              <Nav className="flex-column fs-6">
                <h5>Get to know us</h5>
                <NavLink as={Link} to="/about" className="text-white">About us</NavLink>
                <NavLink className="text-white">Careers</NavLink>
                <NavLink as={Link} to="/faq" className="text-white">FAQ</NavLink>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column fs-6">
                <h5>Make money with us</h5>
                <NavLink as={Link} to="/vendor/signup" className="text-white">Sell on Pronto-Shop</NavLink>
                <NavLink as={Link} to="/vendor/signup" className="text-white">Become an Affiliate</NavLink>
                <NavLink as={Link} to="/vendor/signup" className="text-white">Advertise Your Products</NavLink>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column fs-6">
                <h5>Let us help you</h5>
                <NavLink as={Link} to="/contact" className="text-white">Help & Contact</NavLink>
                <NavLink as={Link} to="/conditions" className="text-white">Conditions of Use</NavLink>
                <NavLink as={Link} to="/privacy" className="text-white">Privacy Notice</NavLink>
              </Nav>
            </Col>
            <Col>
              <Nav className="flex-column fs-6">
                <h5>Connect with us</h5>
                <NavLink className="text-white">Facebook</NavLink>
                <NavLink className="text-white">Twitter</NavLink>
                <NavLink className="text-white">Instagram</NavLink>
              </Nav>
            </Col>
          </Row>
        )}
        <Row
          className={`${isVendor ? 'background-2' : 'background-1'} rounded-top-4 pt-4 ps-4 d-flex justify-content-center align-items-center ${classes.lower_footer}`}
        >
          <p className="text-white text-center fs-4">
            © 2025, ProntoShop.com, Inc.
          </p>
        </Row>
      </Container>
    </footer>
  );
}
