import "./index.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from "react";
import axios from 'axios';
import { cartService } from '../../../../services/CartService';

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [selectedLoginOption, setSelectedLoginOption] = useState('guest');
  const [cartItems, setCartItems] = useState(cartService.getCart());
  const [guestEmail, setGuestEmail] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    phone: ''
  });
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartItems(cartService.getCart());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const steps = [
    { number: 1, title: "Account" },
    { number: 2, title: "Address" }, 
    { number: 3, title: "Shipping" },
    { number: 4, title: "Payment" },
    { number: 5, title: "Review" }
  ];

  const handleShippingMethodChange = (method: string) => {
    setSelectedShipping(method);
  };

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPayment(method);
  };

  const handleCardInfoChange = (field: string, value: string) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingInfoChange = (field: string, value: string) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (sameAsBilling) {
      setBillingInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleBillingInfoChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked);
    if (checked) {
      setBillingInfo(shippingInfo);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (!termsAccepted) {
        toast.error('Please accept the terms and conditions');
        return;
      }

      const guestEmailInput = document.getElementById('guest-email') as HTMLInputElement;
      const guestNewsletterInput = document.getElementById('guest-newsletter') as HTMLInputElement;
      
      const subtotal = cartService.getTotal();
      const shippingCost = selectedShipping === 'standard' ? 4.99 : 
                          selectedShipping === 'express' ? 9.99 : 14.99;
      const tax = subtotal * 0.085; // 8.5% tax
      const total = subtotal + shippingCost + tax;
      
      const checkoutData = {
        email: guestEmail || '',
        isGuest: selectedLoginOption === 'guest',
        newsletter: guestNewsletterInput?.checked || false,
        shippingAddress: shippingInfo,
        billingAddress: sameAsBilling ? shippingInfo : billingInfo,
        sameAsBilling,
        shippingMethod: selectedShipping.toUpperCase() as 'STANDARD' | 'EXPRESS' | 'NEXT_DAY',
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        payment: {
          method: selectedPayment === 'card' ? 'CREDIT_CARD' : 'PAYPAL',
          cardLastFour: selectedPayment === 'card' ? cardInfo.number.slice(-4) : undefined,
          cardBrand: selectedPayment === 'card' ? 'VISA' : undefined,
          paypalEmail: selectedPayment === 'paypal' ? guestEmailInput?.value : undefined
        },
        subtotal,
        shippingCost,
        tax,
        total
      };

      const response = await axios.post('http://localhost:3333/checkout', checkoutData);
      
      if (response.data) {
        alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
        cartService.clearCart();
        // Redirect to order status page with order ID
        window.location.href = `/order_status/${response.data.orderId}`;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1 className="page-title">Checkout</h1>
      </div>

      <div className="checkout-steps">
        {steps.map(step => (
          <div 
            key={step.number}
            className={`checkout-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
            onClick={() => step.number < currentStep && setCurrentStep(step.number)}
          >
            <span className="checkout-step-number">{step.number}</span>
            {step.title}
          </div>
        ))}
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {currentStep === 1 && (
            <div className="checkout-section">
              <h2 className="section-title">Account Options</h2>
              <div className="login-options">
                <div 
                  className={`login-option ${selectedLoginOption === 'guest' ? 'active' : ''}`}
                  onClick={() => setSelectedLoginOption('guest')}
                >
                  <div className="login-option-title">
                    <span>👤</span> Guest Checkout
                  </div>
                  <div className="login-option-description">
                    Checkout without creating an account
                  </div>
                </div>

                <div 
                  className={`login-option ${selectedLoginOption === 'login' ? 'active' : ''}`}
                  onClick={() => setSelectedLoginOption('login')}
                >
                  <div className="login-option-title">
                    <span>🔑</span> Login
                  </div>
                  <div className="login-option-description">
                    Already have an account? Login here
                  </div>
                </div>

                <div 
                  className={`login-option ${selectedLoginOption === 'register' ? 'active' : ''}`}
                  onClick={() => setSelectedLoginOption('register')}
                >
                  <div className="login-option-title">
                    <span>✏️</span> Register
                  </div>
                  <div className="login-option-description">
                    Create an account for faster checkout
                  </div>
                </div>
              </div>

              {selectedLoginOption === 'guest' && (
                <div className="login-form active">
                  <div className="form-row">
                    <label htmlFor="guest-email" className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      id="guest-email" 
                      className="form-input" 
                      placeholder="Enter your email address"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="guest-newsletter" />
                    <label htmlFor="guest-newsletter">Subscribe to our newsletter</label>
                  </div>
                </div>
              )}

              {selectedLoginOption === 'login' && (
                <div className="login-form active">
                  <div className="form-row">
                    <label htmlFor="login-email" className="form-label">Email Address *</label>
                    <input type="email" id="login-email" className="form-input" placeholder="Enter your email address" required />
                  </div>
                  <div className="form-row">
                    <label htmlFor="login-password" className="form-label">Password *</label>
                    <input type="password" id="login-password" className="form-input" placeholder="Enter your password" required />
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="remember-me" />
                    <label htmlFor="remember-me">Remember me</label>
                  </div>
                  <button className="form-button">Login</button>
                </div>
              )}

              {selectedLoginOption === 'register' && (
                <div className="login-form active">
                  <div className="form-row-inline">
                    <div>
                      <label htmlFor="register-firstname" className="form-label">First Name *</label>
                      <input type="text" id="register-firstname" className="form-input" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <label htmlFor="register-lastname" className="form-label">Last Name *</label>
                      <input type="text" id="register-lastname" className="form-input" placeholder="Enter your last name" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <label htmlFor="register-email" className="form-label">Email Address *</label>
                    <input type="email" id="register-email" className="form-input" placeholder="Enter your email address" required />
                  </div>
                  <div className="form-row">
                    <label htmlFor="register-password" className="form-label">Password *</label>
                    <input type="password" id="register-password" className="form-input" placeholder="Create a password" required />
                  </div>
                  <div className="form-row">
                    <label htmlFor="register-confirm" className="form-label">Confirm Password *</label>
                    <input type="password" id="register-confirm" className="form-input" placeholder="Confirm your password" required />
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="register-newsletter" />
                    <label htmlFor="register-newsletter">Subscribe to our newsletter</label>
                  </div>
                  <div className="form-checkbox">
                    <input type="checkbox" id="register-terms" required />
                    <label htmlFor="register-terms">I agree to the Terms and Conditions</label>
                  </div>
                  <button className="form-button">Create Account</button>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="checkout-section">
              <h2 className="section-title">Shipping Address</h2>
              <div className="address-form active">
                <div className="form-row-inline">
                  <div>
                    <label htmlFor="shipping-firstname" className="form-label">First Name *</label>
                    <input 
                      type="text" 
                      id="shipping-firstname" 
                      className="form-input" 
                      placeholder="Enter your first name"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleShippingInfoChange('firstName', e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-lastname" className="form-label">Last Name *</label>
                    <input 
                      type="text" 
                      id="shipping-lastname" 
                      className="form-input" 
                      placeholder="Enter your last name"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleShippingInfoChange('lastName', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="shipping-company" className="form-label">Company (Optional)</label>
                  <input 
                    type="text" 
                    id="shipping-company" 
                    className="form-input" 
                    placeholder="Enter your company name"
                    value={shippingInfo.company}
                    onChange={(e) => handleShippingInfoChange('company', e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="shipping-address1" className="form-label">Address Line 1 *</label>
                  <input 
                    type="text" 
                    id="shipping-address1" 
                    className="form-input" 
                    placeholder="Enter your street address"
                    value={shippingInfo.address1}
                    onChange={(e) => handleShippingInfoChange('address1', e.target.value)}
                    required 
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="shipping-address2" className="form-label">Address Line 2 (Optional)</label>
                  <input 
                    type="text" 
                    id="shipping-address2" 
                    className="form-input" 
                    placeholder="Apartment, suite, unit, etc."
                    value={shippingInfo.address2}
                    onChange={(e) => handleShippingInfoChange('address2', e.target.value)}
                  />
                </div>

                <div className="form-row-inline">
                  <div>
                    <label htmlFor="shipping-city" className="form-label">City *</label>
                    <input 
                      type="text" 
                      id="shipping-city" 
                      className="form-input" 
                      placeholder="Enter your city"
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingInfoChange('city', e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-state" className="form-label">State/Province *</label>
                    <input 
                      type="text" 
                      id="shipping-state" 
                      className="form-input" 
                      placeholder="Enter your state"
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingInfoChange('state', e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row-inline">
                  <div>
                    <label htmlFor="shipping-zip" className="form-label">Zip/Postal Code *</label>
                    <input 
                      type="text" 
                      id="shipping-zip" 
                      className="form-input" 
                      placeholder="Enter your zip code"
                      value={shippingInfo.zip}
                      onChange={(e) => handleShippingInfoChange('zip', e.target.value)}
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="shipping-country" className="form-label">Country *</label>
                    <select 
                      id="shipping-country" 
                      className="form-input"
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingInfoChange('country', e.target.value)}
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <label htmlFor="shipping-phone" className="form-label">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="shipping-phone" 
                    className="form-input" 
                    placeholder="Enter your phone number"
                    value={shippingInfo.phone}
                    onChange={(e) => handleShippingInfoChange('phone', e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="same-address-checkbox">
                <input 
                  type="checkbox" 
                  id="same-address" 
                  checked={sameAsBilling}
                  onChange={(e) => handleSameAsBillingChange(e.target.checked)}
                />
                <label htmlFor="same-address">Billing address is the same as shipping address</label>
              </div>

              {!sameAsBilling && (
                <div className="checkout-section">
                  <h2 className="section-title">Billing Address</h2>
                  <div className="address-form active">
                    <div className="form-row-inline">
                      <div>
                        <label htmlFor="billing-firstname" className="form-label">First Name *</label>
                        <input 
                          type="text" 
                          id="billing-firstname" 
                          className="form-input" 
                          placeholder="Enter your first name"
                          value={billingInfo.firstName}
                          onChange={(e) => handleBillingInfoChange('firstName', e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="billing-lastname" className="form-label">Last Name *</label>
                        <input 
                          type="text" 
                          id="billing-lastname" 
                          className="form-input" 
                          placeholder="Enter your last name"
                          value={billingInfo.lastName}
                          onChange={(e) => handleBillingInfoChange('lastName', e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="billing-company" className="form-label">Company (Optional)</label>
                      <input 
                        type="text" 
                        id="billing-company" 
                        className="form-input" 
                        placeholder="Enter your company name"
                        value={billingInfo.company}
                        onChange={(e) => handleBillingInfoChange('company', e.target.value)}
                      />
                    </div>

                    <div className="form-row">
                      <label htmlFor="billing-address1" className="form-label">Address Line 1 *</label>
                      <input 
                        type="text" 
                        id="billing-address1" 
                        className="form-input" 
                        placeholder="Enter your street address"
                        value={billingInfo.address1}
                        onChange={(e) => handleBillingInfoChange('address1', e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-row">
                      <label htmlFor="billing-address2" className="form-label">Address Line 2 (Optional)</label>
                      <input 
                        type="text" 
                        id="billing-address2" 
                        className="form-input" 
                        placeholder="Apartment, suite, unit, etc."
                        value={billingInfo.address2}
                        onChange={(e) => handleBillingInfoChange('address2', e.target.value)}
                      />
                    </div>

                    <div className="form-row-inline">
                      <div>
                        <label htmlFor="billing-city" className="form-label">City *</label>
                        <input 
                          type="text" 
                          id="billing-city" 
                          className="form-input" 
                          placeholder="Enter your city"
                          value={billingInfo.city}
                          onChange={(e) => handleBillingInfoChange('city', e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="billing-state" className="form-label">State/Province *</label>
                        <input 
                          type="text" 
                          id="billing-state" 
                          className="form-input" 
                          placeholder="Enter your state"
                          value={billingInfo.state}
                          onChange={(e) => handleBillingInfoChange('state', e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row-inline">
                      <div>
                        <label htmlFor="billing-zip" className="form-label">Zip/Postal Code *</label>
                        <input 
                          type="text" 
                          id="billing-zip" 
                          className="form-input" 
                          placeholder="Enter your zip code"
                          value={billingInfo.zip}
                          onChange={(e) => handleBillingInfoChange('zip', e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="billing-country" className="form-label">Country *</label>
                        <select 
                          id="billing-country" 
                          className="form-input"
                          value={billingInfo.country}
                          onChange={(e) => handleBillingInfoChange('country', e.target.value)}
                          required
                        >
                          <option value="">Select a country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="billing-phone" className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="billing-phone" 
                        className="form-input" 
                        placeholder="Enter your phone number"
                        value={billingInfo.phone}
                        onChange={(e) => handleBillingInfoChange('phone', e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="checkout-section">
              <h2 className="section-title">Shipping Method</h2>
              <div className="shipping-methods">
                <div 
                  className={`shipping-method ${selectedShipping === 'standard' ? 'active' : ''}`}
                  onClick={() => handleShippingMethodChange('standard')}
                >
                  <input 
                    type="radio" 
                    name="shipping-method" 
                    id="shipping-standard" 
                    className="shipping-method-radio"
                    checked={selectedShipping === 'standard'}
                    onChange={() => handleShippingMethodChange('standard')}
                  />
                  <div className="shipping-method-details">
                    <div className="shipping-method-title">Standard Shipping</div>
                    <div className="shipping-method-description">Delivery in 3-5 business days</div>
                  </div>
                  <div className="shipping-method-price">$4.99</div>
                </div>

                <div 
                  className={`shipping-method ${selectedShipping === 'express' ? 'active' : ''}`}
                  onClick={() => handleShippingMethodChange('express')}
                >
                  <input 
                    type="radio" 
                    name="shipping-method" 
                    id="shipping-express" 
                    className="shipping-method-radio"
                    checked={selectedShipping === 'express'}
                    onChange={() => handleShippingMethodChange('express')}
                  />
                  <div className="shipping-method-details">
                    <div className="shipping-method-title">Express Shipping</div>
                    <div className="shipping-method-description">Delivery in 1-2 business days</div>
                  </div>
                  <div className="shipping-method-price">$9.99</div>
                </div>

                <div 
                  className={`shipping-method ${selectedShipping === 'next-day' ? 'active' : ''}`}
                  onClick={() => handleShippingMethodChange('next-day')}
                >
                  <input 
                    type="radio" 
                    name="shipping-method" 
                    id="shipping-next-day" 
                    className="shipping-method-radio"
                    checked={selectedShipping === 'next-day'}
                    onChange={() => handleShippingMethodChange('next-day')}
                  />
                  <div className="shipping-method-details">
                    <div className="shipping-method-title">Next Day Delivery</div>
                    <div className="shipping-method-description">Order before 2pm for next day delivery</div>
                  </div>
                  <div className="shipping-method-price">$14.99</div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="checkout-section">
              <h2 className="section-title">Payment Method</h2>
              <div className="payment-methods">
                <div 
                  className={`payment-method ${selectedPayment === 'card' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('card')}
                >
                  <input 
                    type="radio" 
                    name="payment-method" 
                    id="payment-card" 
                    className="payment-method-radio"
                    checked={selectedPayment === 'card'}
                    onChange={() => handlePaymentMethodChange('card')}
                  />
                  <div className="payment-method-details">
                    <div className="payment-method-title">
                      <span>💳</span> Credit/Debit Card
                    </div>
                    <div className="payment-method-description">Pay securely with your credit or debit card</div>
                  </div>
                </div>

                {selectedPayment === 'card' && (
                  <div className="payment-form active">
                    <div className="card-icons">
                      <div className="card-icon">Visa</div>
                      <div className="card-icon">MC</div>
                      <div className="card-icon">Amex</div>
                      <div className="card-icon">Disc</div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="card-number" className="form-label">Card Number *</label>
                      <input 
                        type="text" 
                        id="card-number" 
                        className="form-input" 
                        placeholder="1234 5678 9012 3456"
                        value={cardInfo.number}
                        onChange={(e) => handleCardInfoChange('number', e.target.value)}
                        required 
                      />
                    </div>

                    <div className="form-row-inline">
                      <div>
                        <label htmlFor="card-expiry" className="form-label">Expiration Date *</label>
                        <input 
                          type="text" 
                          id="card-expiry" 
                          className="form-input" 
                          placeholder="MM/YY"
                          value={cardInfo.expiry}
                          onChange={(e) => handleCardInfoChange('expiry', e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label htmlFor="card-cvv" className="form-label">CVV *</label>
                        <input 
                          type="text" 
                          id="card-cvv" 
                          className="form-input" 
                          placeholder="123"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardInfoChange('cvv', e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <label htmlFor="card-name" className="form-label">Name on Card *</label>
                      <input 
                        type="text" 
                        id="card-name" 
                        className="form-input" 
                        placeholder="John Doe"
                        value={cardInfo.name}
                        onChange={(e) => handleCardInfoChange('name', e.target.value)}
                        required 
                      />
                    </div>
                  </div>
                )}

                <div 
                  className={`payment-method ${selectedPayment === 'paypal' ? 'active' : ''}`}
                  onClick={() => handlePaymentMethodChange('paypal')}
                >
                  <input 
                    type="radio" 
                    name="payment-method" 
                    id="payment-paypal" 
                    className="payment-method-radio"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => handlePaymentMethodChange('paypal')}
                  />
                  <div className="payment-method-details">
                    <div className="payment-method-title">
                      <span>P</span> PayPal
                    </div>
                    <div className="payment-method-description">Pay with your PayPal account</div>
                  </div>
                </div>

                {selectedPayment === 'paypal' && (
                  <div className="payment-form active">
                    <p style={{ marginBottom: '15px' }}>You will be redirected to PayPal to complete your payment.</p>
                    <button className="form-button">Continue to PayPal</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="checkout-section">
              <h2 className="section-title">Order Review</h2>
              <div className="review-section">
                <h3 className="review-title">Contact Information</h3>
                <div className="review-content">
                  <p>Phone: {shippingInfo.phone}</p>
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-title">Shipping Address</h3>
                <div className="review-content">
                  <p className="review-address">{`${shippingInfo.firstName} ${shippingInfo.lastName}`}</p>
                  <p className="review-address">{shippingInfo.address1}</p>
                  {shippingInfo.address2 && <p className="review-address">{shippingInfo.address2}</p>}
                  <p className="review-address">{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zip}`}</p>
                  <p className="review-address">{shippingInfo.country}</p>
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-title">Billing Address</h3>
                <div className="review-content">
                  <p className="review-address">
                    {sameAsBilling ? 'Same as shipping address' : `${billingInfo.firstName} ${billingInfo.lastName}`}
                  </p>
                  {!sameAsBilling && (
                    <>
                      <p className="review-address">{billingInfo.address1}</p>
                      {billingInfo.address2 && <p className="review-address">{billingInfo.address2}</p>}
                      <p className="review-address">{`${billingInfo.city}, ${billingInfo.state} ${billingInfo.zip}`}</p>
                      <p className="review-address">{billingInfo.country}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-title">Shipping Method</h3>
                <div className="review-content">
                  <p>{selectedShipping === 'standard' ? 'Standard Shipping - $4.99' :
                      selectedShipping === 'express' ? 'Express Shipping - $9.99' :
                      'Next Day Delivery - $14.99'}</p>
                </div>
              </div>

              <div className="review-section">
                <h3 className="review-title">Payment Method</h3>
                <div className="review-content">
                  <p>{selectedPayment === 'card' ? `Credit Card (${cardInfo.number.slice(-4)})` : 'PayPal'}</p>
                </div>
              </div>

              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terms-agree" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required 
                />
                <label htmlFor="terms-agree">
                  I have read and agree to the Terms and Conditions
                </label>
              </div>
            </div>
          )}

          <div className="checkout-actions">
            {currentStep > 1 && (
              <button 
                className="back-button"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                ← Back
              </button>
            )}
            
            {currentStep < totalSteps && (
              <button 
                className="continue-button"
                onClick={() => {
                  setCurrentStep(prev => prev + 1);
                }}
              >
                Continue →
              </button>
            )}

            {currentStep === totalSteps && (
              <button 
                className="continue-button"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            )}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="checkout-section">
            <h2 className="section-title">Order Summary</h2>
            <div className="order-summary-items">
              <div className="summary-item">
                <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/localhost_3000_-K6Shssc0rwyQSC9ozZ0kjD2agQnn2E.png" alt="School supplies bundle" className="summary-item-image" />
                <div className="summary-item-details">
                  <div className="summary-item-name">New School Year Supplies Bundle</div>
                  <div className="summary-item-variant">Complete Set</div>
                  <div className="summary-item-price">$49.99</div>
                  <div className="summary-item-quantity">Qty: 1</div>
                </div>
              </div>
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartService.getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>$4.99</span>
              </div>
              <div className="summary-row">
                <span>Tax (8.5%)</span>
                <span>${(cartService.getTotal() * 0.085).toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${(cartService.getTotal() + 4.99 + cartService.getTotal() * 0.085).toFixed(2)}</span>
              </div>
            </div>

            <div className="promo-code">
              <h3 className="promo-title">Promo Code</h3>
              <div className="promo-input">
                <input type="text" placeholder="Enter code" className="promo-code-input" />
                <button className="apply-btn">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
