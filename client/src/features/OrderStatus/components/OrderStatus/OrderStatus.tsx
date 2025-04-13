import "./index.css"
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface OrderDetails {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  email: string;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
}

export function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/order-status/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateDeliveryDate = () => {
    if (!order) return null;
    
    const orderDate = new Date(order.orderDate);
    const shippingDays = order.shippingMethod === 'STANDARD' ? 5 : 
                        order.shippingMethod === 'EXPRESS' ? 2 : 1;
    
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
    
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="success-container">
      <div className="success-header">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Your Order Has Been Placed!</h1>
        <p className="success-message">Thank you for your purchase. We've received your order and are getting it ready to ship.</p>
        <p className="success-message">A confirmation email has been sent to <strong>{order.email}</strong></p>
        <p className="order-number">Order #{order.orderId}</p>
        <p className="order-date">{new Date(order.orderDate).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}</p>
      </div>

      <div className="success-content">
        <div className="success-main">
          <div className="success-section">
            <h2 className="section-title">Order Details</h2>
            
            <div className="order-details-grid">
              <div className="order-detail-item">
                <div className="order-detail-label">Order ID</div>
                <div className="order-detail-value">{order.orderId}</div>
              </div>
              
              <div className="order-detail-item">
                <div className="order-detail-label">Order Number</div>
                <div className="order-detail-value">#{order.orderNumber}</div>
              </div>
              
              <div className="order-detail-item">
                <div className="order-detail-label">Order Date</div>
                <div className="order-detail-value">{new Date(order.orderDate).toLocaleDateString()}</div>
              </div>
              
              <div className="order-detail-item">
                <div className="order-detail-label">Payment Method</div>
                <div className="order-detail-value">{order.paymentMethod}</div>
              </div>
              
              <div className="order-detail-item">
                <div className="order-detail-label">Shipping Method</div>
                <div className="order-detail-value">{order.shippingMethod}</div>
              </div>
            </div>

            <div className="address-box">
              <div className="address-title">Shipping Address</div>
              <div className="address-line">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
              <div className="address-line">{order.shippingAddress.address1}</div>
              {order.shippingAddress.address2 && <div className="address-line">{order.shippingAddress.address2}</div>}
              <div className="address-line">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
              <div className="address-line">{order.shippingAddress.country}</div>
              <div className="address-line">{order.shippingAddress.phone}</div>
            </div>

            <div className="address-box">
              <div className="address-title">Billing Address</div>
              <div className="address-line">{order.billingAddress.firstName} {order.billingAddress.lastName}</div>
              <div className="address-line">{order.billingAddress.address1}</div>
              {order.billingAddress.address2 && <div className="address-line">{order.billingAddress.address2}</div>}
              <div className="address-line">{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}</div>
              <div className="address-line">{order.billingAddress.country}</div>
            </div>
          </div>

          <div className="success-section">
            <h2 className="section-title">Order Summary</h2>
            
            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-price">${item.price.toFixed(2)}</div>
                    <div className="order-item-quantity">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="success-section">
            <h2 className="section-title">What's Next?</h2>
            
            <div className="next-steps">
              <div className="next-step-item">
                <div className="next-step-icon">📧</div>
                <div className="next-step-content">
                  <div className="next-step-title">Check Your Email</div>
                  <div className="next-step-description">
                    We've sent a confirmation email to your inbox with all the details of your order.
                  </div>
                </div>
              </div>
              
              <div className="next-step-item">
                <div className="next-step-icon">📦</div>
                <div className="next-step-content">
                  <div className="next-step-title">Track Your Order</div>
                  <div className="next-step-description">
                    Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.
                  </div>
                </div>
              </div>
              
              <div className="next-step-item">
                <div className="next-step-icon">❓</div>
                <div className="next-step-content">
                  <div className="next-step-title">Need Help?</div>
                  <div className="next-step-description">
                    If you have any questions about your order, please contact our customer support team.
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <a href="/" className="action-button primary">
                <span>🛒</span> Continue Shopping
              </a>
              <a href="#" className="action-button secondary">
                <span>📋</span> Track Order
              </a>
              <button onClick={() => window.print()} className="action-button secondary">
                <span>🖨️</span> Print Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="success-sidebar">
          <div className="success-section">
            <h2 className="section-title">Shipping Information</h2>
            
            <div className="shipping-info">
              <div className="shipping-method">{order.shippingMethod}</div>
              <div className="shipping-details">
                {order.shippingMethod === 'STANDARD' ? 'Delivery in 3-5 business days' :
                 order.shippingMethod === 'EXPRESS' ? 'Delivery in 1-2 business days' :
                 'Next day delivery'}
              </div>
              <div className="delivery-date">
                <span>📅</span> Estimated delivery: {calculateDeliveryDate()}
              </div>
            </div>
          </div>

          <div className="success-section">
            <h2 className="section-title">Payment Information</h2>
            
            <div className="payment-info">
              <div className="payment-method">{order.paymentMethod}</div>
              <div className="payment-details">
                <p>Amount charged: ${order.total.toFixed(2)}</p>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
