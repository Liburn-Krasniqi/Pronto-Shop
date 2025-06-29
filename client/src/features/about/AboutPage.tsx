import React from 'react';
import './AboutPage.css';

export function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-title">About Pronto-Shop</h1>
          <p className="about-subtitle">
            Your trusted destination for quality refurbished products
          </p>
        </div>
      </div>

      <div className="container">
        <div className="about-content">
          <section className="about-section">
            <div className="row">
              <div className="col-lg-6">
                <h2>Our Story</h2>
                <p>
                  Pronto-Shop was born from a simple yet powerful idea: everyone deserves access to 
                  quality products without breaking the bank. We believe that refurbished doesn't mean 
                  compromised - it means smart, sustainable, and accessible.
                </p>
                <p>
                  Founded with a mission to reduce electronic waste while making premium technology 
                  accessible to more people, we've built a platform that connects conscientious 
                  consumers with trusted vendors who share our values.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="about-image">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=600&q=80" 
                    alt="Our mission" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <div className="row">
              <div className="col-lg-6 order-lg-2">
                <h2>Our Mission</h2>
                <p>
                  We're committed to creating a sustainable future by giving quality products a second 
                  life. Our platform makes it easy for customers to find reliable refurbished items 
                  while supporting vendors who maintain the highest standards of quality and service.
                </p>
                <ul className="mission-list">
                  <li>Reduce electronic waste through responsible refurbishment</li>
                  <li>Make quality technology accessible to everyone</li>
                  <li>Support local vendors and small businesses</li>
                  <li>Provide transparent, trustworthy shopping experiences</li>
                </ul>
              </div>
              <div className="col-lg-6 order-lg-1">
                <div className="about-image">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80" 
                    alt="Our values" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2 className="text-center mb-5">Why Choose Pronto-Shop?</h2>
            <div className="row">
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h3>Quality Assured</h3>
                  <p>
                    Every product on our platform meets strict quality standards. 
                    We work with trusted vendors who thoroughly test and certify 
                    all refurbished items.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h3>Eco-Friendly</h3>
                  <p>
                    By choosing refurbished products, you're helping reduce 
                    electronic waste and supporting sustainable consumption 
                    practices.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <h3>Great Value</h3>
                  <p>
                    Get premium products at a fraction of the original price. 
                    Our refurbished items offer exceptional value without 
                    compromising on quality.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="about-section">
            <div className="row">
              <div className="col-lg-6">
                <h2>Our Team</h2>
                <p>
                  We're a passionate team of technology enthusiasts, environmental advocates, 
                  and customer service experts. Our diverse backgrounds come together with 
                  one shared goal: making quality products accessible to everyone.
                </p>
                <p>
                  From our developers who build seamless shopping experiences to our 
                  customer support team who ensures your satisfaction, every member 
                  of our team is committed to your success.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="about-image">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" 
                    alt="Our team" 
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="about-section text-center">
            <h2>Get in Touch</h2>
            <p className="mb-4">
              Have questions about our products or services? We'd love to hear from you!
            </p>
            <div className="contact-info">
              <div className="row">
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <h4>Email</h4>
                    <p>support@pronto-shop.com</p>
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
        </div>
      </div>
    </div>
  );
} 