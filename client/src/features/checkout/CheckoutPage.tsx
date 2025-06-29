import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/api/client';
import { toast } from 'react-toastify';
import { GiftCardInput } from '@/components/UI';
import './CheckoutPage.css';

interface ShippingDetails {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotal } = useCartStore();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [giftCardApplied, setGiftCardApplied] = useState(0);
  const [giftCardCode, setGiftCardCode] = useState<string>('');
  const [orderId, setOrderId] = useState<number | null>(null);

  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    const checkAndProcessAddress = async () => {
      if (userData?.addresses) {
        const hasCompleteAddress = 
          userData.addresses.street &&
          userData.addresses.city &&
          userData.addresses.state &&
          userData.addresses.postalCode &&
          userData.addresses.country;

        // Pre-fill the shipping details with existing address data
        setShippingDetails({
          street: userData.addresses.street || '',
          city: userData.addresses.city || '',
          state: userData.addresses.state || '',
          postalCode: userData.addresses.postalCode || '',
          country: userData.addresses.country || '',
        });
      }
      setInitialLoading(false);
    };

    checkAndProcessAddress();
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGiftCardApplied = async (amount: number, code: string) => {
    // Check if shipping details are complete
    const hasCompleteAddress = 
      shippingDetails.street &&
      shippingDetails.city &&
      shippingDetails.state &&
      shippingDetails.postalCode &&
      shippingDetails.country;

    if (!hasCompleteAddress) {
      toast.error('Please complete shipping details first');
      return;
    }

    // For now, just update the local state
    // The actual gift card application will happen when the order is created
    setGiftCardApplied(amount);
    setGiftCardCode(code);
    toast.success(`Gift card applied! Discount: $${amount.toFixed(2)}`);
  };

  const handleOrderCreation = async (addressDetails: ShippingDetails) => {
    if (!userData?.id) {
      toast.error('Please log in to proceed with checkout');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: String(userData.id),
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotal() - giftCardApplied,
        status: 'pending',
        shippingAddress: JSON.stringify(addressDetails)
      };

      const response = await apiClient.post('/orders', orderData);
      
      if (!response?.id) {
        throw new Error('Invalid order response from server');
      }

      const newOrderId = response.id;
      setOrderId(newOrderId);

      // Apply gift card to the order if one was applied
      if (giftCardApplied > 0) {
        try {
          // Get the gift card code from the GiftCardInput component
          // For now, we'll need to store this information
          await apiClient.post(`/orders/${newOrderId}/gift-card`, {
            giftCardCode: giftCardCode,
            amountToUse: giftCardApplied
          });
        } catch (giftCardError: any) {
          console.error('Gift card application error:', giftCardError);
          // Don't fail the entire order if gift card application fails
          toast.warning('Order created but gift card application failed. Please contact support.');
        }
      }

      navigate(`/payment/${newOrderId}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create order');
      setIsTransitioning(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userData?.id) {
      toast.error('Please log in to proceed with checkout');
      return;
    }

    setLoading(true);
    setIsTransitioning(true);

    try {
      toast.info('Saving shipping details...', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // First save the shipping details
      await apiClient.put('/users/me', {
        addresses: shippingDetails
      });

      toast.success('Shipping details saved!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Add a small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then create the order
      await handleOrderCreation(shippingDetails);
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to process checkout');
      setIsTransitioning(false);
    } finally {
      setLoading(false);
    }
  };

  const total = getTotal();
  const finalTotal = total - giftCardApplied;
  const isMinimumAmount = total >= 1.00;

  if (initialLoading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading checkout information...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="title">Checkout</h1>
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart to proceed with checkout</p>
          <button 
            className="continue-shopping"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${isTransitioning ? 'fade-out' : ''}`}>
      <h1 className="title">Checkout</h1>
      <div className="checkout-layout">
        <div className="shipping-form">
          <h2>Shipping Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={shippingDetails.street}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingDetails.postalCode}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <GiftCardInput
              onGiftCardApplied={handleGiftCardApplied}
              orderTotal={total}
              disabled={loading}
            />

            {!isMinimumAmount && (
              <div className="minimum-amount-warning">
                Minimum order amount is $1.00. Please add more items to your cart.
              </div>
            )}

            <button 
              type="submit" 
              className={`proceed-button ${loading ? 'loading' : ''}`}
              disabled={loading || !isMinimumAmount}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {giftCardApplied > 0 && (
              <div className="total-row discount">
                <span>Gift Card Discount</span>
                <span>-${giftCardApplied.toFixed(2)}</span>
              </div>
            )}
            <div className="total-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 