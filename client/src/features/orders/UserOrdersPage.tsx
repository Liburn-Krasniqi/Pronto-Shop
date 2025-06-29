import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { apiClient } from '../../api/client';
import { useAuth } from '@/hooks/useAuth';
import { OrderDetailsModal } from '@/components/UI/OrderDetailsModal';
import { EnhancedTable, TableColumn } from '@/components/UI';
import { FaShoppingCart } from 'react-icons/fa';
import './UserOrdersPage.css';

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageURL?: string[];
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
  shippingAddress?: string;
  paymentIntentId?: string;
}

export const UserOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { userData } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Starting to fetch orders...');
      const response = await apiClient.get('/orders/my-orders');
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Define table columns
  const columns: TableColumn<Order>[] = [
    {
      key: 'id',
      displayName: 'Order ID',
      sortable: true,
      searchable: false,
      width: '10%',
      render: (value) => `#${value}`
    },
    {
      key: 'items',
      displayName: 'Items',
      sortable: false,
      searchable: true,
      width: '35%',
      transform: (order) => formatOrderItems(order.items),
      render: (value) => (
        <div style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      )
    },
    {
      key: 'total',
      displayName: 'Total',
      sortable: true,
      searchable: false,
      width: '12%',
      render: (value) => formatCurrency(Number(value))
    },
    {
      key: 'status',
      displayName: 'Status',
      sortable: true,
      searchable: true,
      width: '12%',
      filterOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      render: (value) => (
        <Badge bg={getStatusBadgeVariant(value)} className="status-badge">
          {value.toUpperCase()}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      displayName: 'Date',
      sortable: true,
      searchable: false,
      width: '15%',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Action function for the table
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">My Orders</h2>

      <EnhancedTable
        data={orders}
        columns={columns}
        loading={loading}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        emptyMessage="You haven't placed any orders yet. Start shopping to see your order history!"
        emptyIcon={<FaShoppingCart size={100} className="text-muted" />}
        actions={(order) => (
          <button
            className="btn btn-sm btn-outline-success"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOrder(order);
            }}
            title="View Order Details"
          >
            View Details
          </button>
        )}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        show={showModal}
        onHide={handleCloseModal}
      />
    </div>
  );
}; 