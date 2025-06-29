import React from 'react';
import './conditions.css';

export function ConditionsPage() {
  return (
    <div className="conditions-page">
      <div className="conditions-hero">
        <div className="container">
          <h1 className="conditions-title">Conditions of Use</h1>
          <p className="conditions-subtitle">
            Please read these terms carefully before using Pronto-Shop
          </p>
        </div>
      </div>

      <div className="container">
        <div className="conditions-content">
          <section className="conditions-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Pronto-Shop ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="conditions-section">
            <h2>2. Description of Service</h2>
            <p>
              Pronto-Shop is an online marketplace that connects customers with vendors offering refurbished products. Our platform facilitates the sale and purchase of quality refurbished items while providing a secure and user-friendly shopping experience.
            </p>
          </section>

          <section className="conditions-section">
            <h2>3. User Accounts</h2>
            <div className="conditions-list">
              <h3>3.1 Account Creation</h3>
              <p>To access certain features of the Platform, you must create an account. You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>

              <h3>3.2 Account Types</h3>
              <p>We offer different account types:</p>
              <ul>
                <li><strong>Customer Accounts:</strong> For purchasing products</li>
                <li><strong>Vendor Accounts:</strong> For selling products (requires approval)</li>
                <li><strong>Admin Accounts:</strong> For platform management</li>
              </ul>
            </div>
          </section>

          <section className="conditions-section">
            <h2>4. Product Information and Quality</h2>
            <p>
              All products listed on Pronto-Shop are refurbished items. While we strive to ensure accurate product descriptions and quality standards, we cannot guarantee that all information is complete, accurate, or up-to-date.
            </p>
            <div className="conditions-list">
              <h3>4.1 Product Descriptions</h3>
              <ul>
                <li>Vendors are responsible for accurate product descriptions</li>
                <li>Images should represent the actual product condition</li>
                <li>Pricing must be transparent and include all applicable fees</li>
              </ul>

              <h3>4.2 Quality Standards</h3>
              <ul>
                <li>All refurbished products must meet our quality guidelines</li>
                <li>Products should be fully functional and tested</li>
                <li>Cosmetic imperfections should be clearly disclosed</li>
              </ul>
            </div>
          </section>

          <section className="conditions-section">
            <h2>5. Purchases and Payments</h2>
            <div className="conditions-list">
              <h3>5.1 Order Process</h3>
              <ul>
                <li>Orders are subject to vendor acceptance and availability</li>
                <li>Payment is processed securely through our payment partners</li>
                <li>Order confirmations will be sent via email</li>
              </ul>

              <h3>5.2 Pricing and Fees</h3>
              <ul>
                <li>All prices are listed in the local currency</li>
                <li>Taxes and shipping costs are calculated at checkout</li>
                <li>Platform fees may apply to vendor transactions</li>
              </ul>
            </div>
          </section>

          <section className="conditions-section">
            <h2>6. Shipping and Delivery</h2>
            <p>
              Shipping is handled by vendors or third-party carriers. Delivery times may vary based on location and shipping method selected. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.
            </p>
          </section>

          <section className="conditions-section">
            <h2>7. Returns and Refunds</h2>
            <div className="conditions-list">
              <h3>7.1 Return Policy</h3>
              <ul>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Products must be in original condition</li>
                <li>Return shipping costs may apply</li>
                <li>Some items may not be eligible for return</li>
              </ul>

              <h3>7.2 Refund Process</h3>
              <ul>
                <li>Refunds are processed within 5-10 business days</li>
                <li>Original payment method will be credited</li>
                <li>Platform fees are non-refundable</li>
              </ul>
            </div>
          </section>

          <section className="conditions-section">
            <h2>8. Prohibited Activities</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any illegal or unauthorized purpose</li>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Platform</li>
              <li>Provide false or misleading information</li>
              <li>Engage in fraudulent activities</li>
            </ul>
          </section>

          <section className="conditions-section">
            <h2>9. Intellectual Property</h2>
            <p>
              The Platform and its original content, features, and functionality are owned by Pronto-Shop and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="conditions-section">
            <h2>10. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Notice, which also governs your use of the Platform, to understand our practices regarding the collection and use of your personal information.
            </p>
          </section>

          <section className="conditions-section">
            <h2>11. Disclaimers and Limitations</h2>
            <div className="conditions-list">
              <h3>11.1 Service Availability</h3>
              <p>We strive to maintain the Platform's availability but cannot guarantee uninterrupted access due to maintenance, technical issues, or other factors.</p>

              <h3>11.2 Product Warranties</h3>
              <p>We do not provide warranties for products sold by vendors. Any warranties are provided by the vendor or manufacturer.</p>

              <h3>11.3 Limitation of Liability</h3>
              <p>Pronto-Shop shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform.</p>
            </div>
          </section>

          <section className="conditions-section">
            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Platform immediately, without prior notice, for any reason, including breach of these Terms of Use.
            </p>
          </section>

          <section className="conditions-section">
            <h2>13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Platform constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="conditions-section">
            <h2>14. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Pronto-Shop operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="conditions-section">
            <h2>15. Contact Information</h2>
            <p>
              If you have any questions about these Conditions of Use, please contact us:
            </p>
            <div className="contact-info">
              <div className="row">
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <h4>Email</h4>
                    <p>legal@pronto-shop.com</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <h4>Hours</h4>
                    <p>Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="conditions-section text-center">
            <p className="last-updated">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 