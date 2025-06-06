import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI/button';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import './CartPage.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const { isAuthenticated } = useAuth();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to proceed with checkout', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const total = getTotal();
  const isMinimumAmount = total >= 1.00;

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="title">Shopping Cart</h1>
        <div className="empty-cart">
          <ShoppingCart className="empty-icon" />
          <h2 className="empty-title">Your cart is empty</h2>
          <p className="empty-text">Add some items to your cart to see them here</p>
          <Button
            onClick={() => navigate('/')}
            className="continue-shopping-button"
            variant="ghost"
            style={{ 
              marginTop: '1rem',
              backgroundColor: '#206a5d',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              border: 'none'
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Shopping Cart</h1>
      <div className="layout">
        <div className="cart-items">
          {items.map((item: CartItem) => (
            <div key={item.id} className="card">
              <div className="card-content">
                {/* Image */}
                <div className="image-container">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="image"
                  />
                </div>
                
                {/* Name */}
                <h3 
                  className="product-name"
                  onClick={() => handleProductClick(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </h3>

                {/* Right side controls */}
                <div className="right-controls">
                  {/* Price and Delete Button Container */}
                  <div className="price-delete-container">
                    <p className="product-price">${item.price.toFixed(2)}</p>
                    <button
                      className="delete-button"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 style={{ height: '1rem', width: '1rem' }} />
                    </button>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="quantity-text">{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="summary-section">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>
            <div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-divider">
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            {!isMinimumAmount && (
              <div className="minimum-amount-warning">
                Minimum order amount is $1.00. Please add more items to your cart.
              </div>
            )}
            <button 
              className="checkout-button"
              onClick={handleCheckout}
              disabled={!isMinimumAmount}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 