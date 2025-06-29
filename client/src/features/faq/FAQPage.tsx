import React, { useState } from 'react';
import './FAQPage.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What is Pronto-Shop?",
    answer: "Pronto-Shop is an online marketplace specializing in quality refurbished products. We connect customers with trusted vendors who offer certified refurbished items at affordable prices, helping reduce electronic waste while making quality products accessible to everyone.",
    category: "General"
  },
  {
    id: 2,
    question: "Are refurbished products reliable?",
    answer: "Yes! All products on our platform undergo rigorous testing and quality assurance processes. Our vendors are carefully vetted and must meet strict standards. Refurbished products often come with warranties and are thoroughly tested to ensure they work like new.",
    category: "Product Quality"
  },
  {
    id: 3,
    question: "What warranty do refurbished products come with?",
    answer: "Warranty terms vary by product and vendor, but most refurbished items come with at least a 90-day warranty. Some products may have longer warranty periods. All warranty information is clearly displayed on each product page.",
    category: "Product Quality"
  },
  {
    id: 4,
    question: "How do I return a product?",
    answer: "We offer a 30-day return policy for most items. To initiate a return, go to your order history in your account dashboard and select the 'Return' option. You'll receive a prepaid shipping label and instructions for returning the item.",
    category: "Returns & Refunds"
  },
  {
    id: 5,
    question: "How long does shipping take?",
    answer: "Shipping times vary by location and product availability. Standard shipping typically takes 3-5 business days, while expedited shipping options are available for faster delivery. You'll receive tracking information once your order ships.",
    category: "Shipping"
  },
  {
    id: 6,
    question: "Do you ship internationally?",
    answer: "Currently, we ship to most countries. Shipping costs and delivery times vary by location. You can check shipping availability and costs during checkout by entering your shipping address.",
    category: "Shipping"
  },
  {
    id: 7,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our encrypted payment system.",
    category: "Payment"
  },
  {
    id: 8,
    question: "Is my payment information secure?",
    answer: "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers, and all transactions are processed through secure payment gateways.",
    category: "Payment"
  },
  {
    id: 9,
    question: "How do I become a vendor on Pronto-Shop?",
    answer: "To become a vendor, visit our vendor signup page and complete the application process. We'll review your business credentials and quality standards. Once approved, you can start listing your refurbished products on our platform.",
    category: "Vendors"
  },
  {
    id: 10,
    question: "What makes Pronto-Shop different from other marketplaces?",
    answer: "Pronto-Shop focuses exclusively on quality refurbished products, ensuring every item meets our strict standards. We work with carefully vetted vendors and provide transparent information about each product's condition and warranty.",
    category: "General"
  },
  {
    id: 11,
    question: "Can I track my order?",
    answer: "Yes! Once your order ships, you'll receive an email with tracking information. You can also track your order through your account dashboard by visiting the order history section.",
    category: "Shipping"
  },
  {
    id: 12,
    question: "What if I receive a damaged item?",
    answer: "If you receive a damaged item, please contact our customer support team immediately. Take photos of the damage and we'll arrange for a replacement or refund. We cover return shipping costs for damaged items.",
    category: "Returns & Refunds"
  }
];

const categories = ['All', 'General', 'Product Quality', 'Returns & Refunds', 'Shipping', 'Payment', 'Vendors'];

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQs = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="faq-page">
      <div className="faq-hero">
        <div className="container">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about Pronto-Shop
          </p>
        </div>
      </div>

      <div className="container">
        <div className="faq-content">
          {/* Category Filter */}
          <div className="category-filter">
            <div className="filter-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="faq-accordion">
            {filteredFAQs.map(faq => (
              <div key={faq.id} className="faq-item">
                <button
                  className={`faq-question ${openItems.includes(faq.id) ? 'active' : ''}`}
                  onClick={() => toggleItem(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    {openItems.includes(faq.id) ? '−' : '+'}
                  </span>
                </button>
                <div className={`faq-answer ${openItems.includes(faq.id) ? 'open' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="faq-contact">
            <div className="contact-card">
              <h3>Still have questions?</h3>
              <p>
                Can't find what you're looking for? Our customer support team is here to help!
              </p>
              <div className="contact-options">
                <div className="contact-option">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email Support</h4>
                    <p>support@pronto-shop.com</p>
                  </div>
                </div>
                <div className="contact-option">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h4>Phone Support</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="contact-option">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h4>Support Hours</h4>
                    <p>Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 