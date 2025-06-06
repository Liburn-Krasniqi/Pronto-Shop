import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/api/client';
import { toast } from 'react-toastify';
import { loadStripe, Appearance } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './PaymentPage.css';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface OrderDetails {
  id: number;
  total: number;
  status: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    product: {
      name: string;
    };
  }[];
}

function PaymentForm({ order }: { order: OrderDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        navigate('/order-success');
      } else {
        // Handle other payment states
        toast.info('Processing your payment...');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        className="pay-button"
        disabled={loading || !stripe || !elements}
      >
        {loading ? 'Processing...' : `Pay $${order.total.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await apiClient.get(`/orders/${orderId}`);
        console.log('Order response:', response);
        setOrder(response);
        const orderTotal = Number(response.total);
        console.log('Setting total to:', orderTotal, typeof orderTotal);
        setTotal(orderTotal);
      } catch (error: any) {
        toast.error('Failed to fetch order details');
        navigate('/cart');
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const amount = Number(total);
        const response = await apiClient.post(`/orders/${orderId}/payment`, {
          amount: amount,
          paymentDetails: {}
        });
        
        if (response?.clientSecret) {
          setClientSecret(response.clientSecret);
        } else if (response?.data?.clientSecret) {
          setClientSecret(response.data.clientSecret);
        } else {
          throw new Error('No client secret received');
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message;
        
        if (errorMessage?.includes('minimum payment amount')) {
          navigate('/cart');
        } else {
          toast.error(errorMessage || 'Failed to process payment');
        }
      }
    };

    if (orderId && total > 0) {
      createPaymentIntent();
    }
  }, [orderId, total, navigate]);

  if (!order || !clientSecret) {
    return <div className="loading">Loading...</div>;
  }

  const appearance: Appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container">
      <h1 className="title">Payment</h1>
      <div className="payment-layout">
        <div className="payment-form">
          <h2>Payment Details</h2>
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm order={order} />
          </Elements>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {order.items.map((item) => (
              <div key={item.productId} className="summary-item">
                <div className="item-details">
                  <span className="item-name">{item.product.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-total">
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 