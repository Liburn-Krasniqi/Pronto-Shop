import React from 'react';
import './privacy.css';

export function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="privacy-hero">
        <div className="container">
          <h1 className="privacy-title">Privacy Notice</h1>
          <p className="privacy-subtitle">
            How we collect, use, and protect your personal information
          </p>
        </div>
      </div>

      <div className="container">
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              At Pronto-Shop, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Notice explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p>
              By using Pronto-Shop, you consent to the data practices described in this notice. If you do not agree with our policies and practices, please do not use our platform.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            <div className="privacy-list">
              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
                <li><strong>Profile Information:</strong> Profile picture, address, and preferences</li>
                <li><strong>Payment Information:</strong> Payment method details (processed securely by our payment partners)</li>
                <li><strong>Communication Data:</strong> Messages, reviews, and feedback you provide</li>
              </ul>

              <h3>2.2 Usage Information</h3>
              <p>We automatically collect certain information when you use our platform:</p>
              <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, search queries</li>
                <li><strong>Cookies and Tracking:</strong> Information stored on your device to enhance your experience</li>
                <li><strong>Location Data:</strong> General location information (with your consent)</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <div className="privacy-list">
              <h3>3.1 Primary Uses</h3>
              <ul>
                <li>Provide and maintain our platform services</li>
                <li>Process transactions and manage your account</li>
                <li>Connect you with vendors and facilitate purchases</li>
                <li>Send order confirmations and updates</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>

              <h3>3.2 Improvement and Personalization</h3>
              <ul>
                <li>Improve our platform functionality and user experience</li>
                <li>Personalize content and recommendations</li>
                <li>Analyze usage patterns and trends</li>
                <li>Develop new features and services</li>
              </ul>

              <h3>3.3 Communication</h3>
              <ul>
                <li>Send important service updates and notifications</li>
                <li>Provide marketing communications (with your consent)</li>
                <li>Respond to your questions and feedback</li>
                <li>Send security alerts and account notifications</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <div className="privacy-list">
              <h3>4.1 With Vendors</h3>
              <p>When you make a purchase, we share necessary information with vendors:</p>
              <ul>
                <li>Order details and shipping information</li>
                <li>Contact information for order fulfillment</li>
                <li>Payment information (processed securely)</li>
              </ul>

              <h3>4.2 Service Providers</h3>
              <p>We may share information with trusted third-party service providers:</p>
              <ul>
                <li>Payment processors for secure transactions</li>
                <li>Shipping carriers for order delivery</li>
                <li>Cloud storage providers for data hosting</li>
                <li>Analytics services for platform improvement</li>
              </ul>

              <h3>4.3 Legal Requirements</h3>
              <p>We may disclose your information when required by law:</p>
              <ul>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and property</li>
                <li>To prevent fraud and ensure security</li>
                <li>In response to lawful requests from authorities</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="privacy-list">
              <h3>5.1 Security Measures</h3>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Secure payment processing through trusted partners</li>
                <li>Employee training on data protection practices</li>
              </ul>

              <h3>5.2 Data Retention</h3>
              <p>We retain your personal information only as long as necessary:</p>
              <ul>
                <li>To provide our services and maintain your account</li>
                <li>To comply with legal obligations</li>
                <li>To resolve disputes and enforce agreements</li>
                <li>For legitimate business purposes</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>6. Your Rights and Choices</h2>
            <div className="privacy-list">
              <h3>6.1 Access and Control</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h3>6.2 Cookie Preferences</h3>
              <p>You can control cookie settings through your browser:</p>
              <ul>
                <li>Disable or delete cookies</li>
                <li>Set preferences for different types of cookies</li>
                <li>Manage tracking and analytics cookies</li>
              </ul>

              <h3>6.3 Account Settings</h3>
              <p>Manage your privacy preferences through your account:</p>
              <ul>
                <li>Update communication preferences</li>
                <li>Control data sharing settings</li>
                <li>Manage notification preferences</li>
              </ul>
            </div>
          </section>

          <section className="privacy-section">
            <h2>7. Children's Privacy</h2>
            <p>
              Pronto-Shop is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Third-Party Links and Services</h2>
            <p>
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. Changes to This Privacy Notice</h2>
            <p>
              We may update this Privacy Notice from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated notice on our platform and updating the "Last Updated" date.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Notice or our data practices, please contact us:
            </p>
            <div className="contact-info">
              <div className="row">
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <h4>Email</h4>
                    <p>privacy@pronto-shop.com</p>
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

          <section className="privacy-section text-center">
            <p className="last-updated">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 