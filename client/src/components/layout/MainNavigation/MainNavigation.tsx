import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./MainNavigation.module.css";
import { NavItemWithIcon, CustomNavDropdown } from "../../UI";
import { Cart } from "../../../features/Cart";
import { LoginRegister } from "../../../features/LoginRegister";
import { useState, useEffect } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { cartService } from "../../../services/CartService";

export const MainNavigation: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Initial cart count
    updateCartCount();

    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Custom event listener for cart updates
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = cartService.getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(count);
  };

  const handleCartClose = () => setShowCart(false);
  const handleCartShow = () => {
    updateCartCount(); // Update count when opening cart
    setShowCart(true);
  };
  
  const handleAuthClose = () => setShowAuth(false);
  const handleAuthShow = () => setShowAuth(true);

  return (
    <Navbar expand="lg" className={`rounded-bottom-4 ${classes.navbar}`}>
      <Container fluid>
        <Navbar.Brand className="ms-3" href="/">
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
              <Nav.Link
                onClick={handleAuthShow}
                className="me-4 text-white"
                style={{cursor: 'pointer'}}
              >
                <span>
                  Hello, sign in <br />
                  <strong>Accounts & Lists</strong>
                </span>
              </Nav.Link>

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

              <Nav.Link 
                onClick={handleCartShow}
                className="me-2 position-relative"
                style={{cursor: 'pointer'}}
              >
                <img alt="cart" src="/Shopping-cart.svg" className="me-2" />
                {cartItemCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartItemCount}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <Offcanvas show={showCart} onHide={handleCartClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Shopping Cart ({cartItemCount} items)</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Cart />
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showAuth} onHide={handleAuthClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Sign In or Register</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <LoginRegister />
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
};
