import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Starting to fetch orders...');
      const response = await apiClient.get('/orders');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting orders state with data:', response);
        setOrders(response);
      } else {
        console.log('Response is not an array, setting empty array');
        setOrders([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
      setLoading(false);
    }
  };

  const formatOrderItems = (items: OrderItem[]) => {
    return items.map(item => 
      `${item.product.name} (${item.quantity} x $${item.price.toFixed(2)})`
    ).join(', ');
  };

  const formatCustomerName = (firstName: string | undefined, lastName: string | undefined) => {
    const parts = [firstName, lastName].filter(part => part && part.trim() !== '');
    return parts.length > 0 ? parts.join(' ') : '';
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center p-5">
          <div className="mb-4">
            <img 
              src="http://localhost:3333/uploads/Software-Image-removebg-preview.png" 
              alt="No Orders" 
              style={{ width: '500px', height: 'auto', opacity: 0.8 }}
            />
          </div>
          <h3 className="text-muted mb-3">No Orders Found</h3>
          <p className="text-muted mb-4">There are currently no orders in the system.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{formatCustomerName(order.user.firstName, order.user.lastName)}</td>
                <td>{order.user.email}</td>
                <td>{formatOrderItems(order.items)}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <span className={`badge bg-${order.status === 'completed' ? 'success' : 
                    order.status === 'pending' ? 'warning' : 
                    order.status === 'cancelled' ? 'danger' : 'secondary'}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}; 