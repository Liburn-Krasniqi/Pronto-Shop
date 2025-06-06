import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { CheckCircle } from 'lucide-react';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="container">
      <div className="success-container">
        <CheckCircle className="success-icon" />
        <h1>Order Successful!</h1>
        <p>Thank you for your purchase. Your order has been received and is being processed.</p>
        <div className="button-group">
          <button 
            className="continue-shopping"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
          <button 
            className="view-orders"
            onClick={() => navigate('/orders')}
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
} 