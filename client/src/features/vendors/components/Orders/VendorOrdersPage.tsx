import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { EnhancedTable, TableColumn } from '../../../../components/UI';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { OrderDetailsModal } from '../../../../components/UI/OrderDetailsModal';

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    vendorid: number;
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

interface VendorStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export const VendorOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Starting to fetch vendor orders...');
      const response = await apiClient.get('/orders/vendor/orders');
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
      console.error('Error fetching vendor orders:', err);
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

  const fetchStats = async () => {
    try {
      const [orderCountRes, revenueRes, pendingRes] = await Promise.all([
        apiClient.get('/orders/vendor/count'),
        apiClient.get('/orders/vendor/revenue'),
        apiClient.get('/orders/vendor/pending')
      ]);

      setStats({
        totalOrders: orderCountRes.count || 0,
        totalRevenue: revenueRes.total || 0,
        pendingOrders: pendingRes.count || 0
      });
    } catch (err: any) {
      console.error('Error fetching vendor stats:', err);
      // Don't set error here as it's not critical for the main functionality
    }
  };

  const formatOrderItems = (items: OrderItem[]) => {
    return items.map(item => 
      `${item.product.name} (${item.quantity} x $${item.price.toFixed(2)})`
    ).join(', ');
  };

  const formatCustomerName = (firstName: string | undefined, lastName: string | undefined) => {
    const parts = [firstName, lastName].filter(part => part && part.trim() !== '');
    return parts.length > 0 ? parts.join(' ') : 'Anonymous';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
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
      key: 'customer',
      displayName: 'Customer',
      sortable: true,
      searchable: true,
      width: '12%',
      transform: (order) => formatCustomerName(order.user.firstName, order.user.lastName)
    },
    {
      key: 'email',
      displayName: 'Email',
      sortable: true,
      searchable: true,
      width: '18%',
      transform: (order) => order.user.email
    },
    {
      key: 'items',
      displayName: 'Items',
      sortable: false,
      searchable: true,
      width: '25%',
      transform: (order) => formatOrderItems(order.items),
      render: (value) => (
        <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      )
    },
    {
      key: 'total',
      displayName: 'Total',
      sortable: true,
      searchable: false,
      width: '10%',
      render: (value) => formatCurrency(Number(value))
    },
    {
      key: 'status',
      displayName: 'Status',
      sortable: true,
      searchable: true,
      width: '10%',
      filterOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      render: (value) => (
        <span className={`badge bg-${getStatusBadgeVariant(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'createdAt',
      displayName: 'Date',
      sortable: true,
      searchable: false,
      width: '10%',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">My Orders</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Orders</h3>
              <h2 className="color-1">{stats.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Revenue</h3>
              <h2 className="color-2">{formatCurrency(stats.totalRevenue)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Pending Orders</h3>
              <h2 className="color-3">{stats.pendingOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EnhancedTable
        data={orders}
        columns={columns}
        loading={loading}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        emptyMessage="You haven't received any orders yet. Keep promoting your products!"
        emptyIcon={<FaShoppingCart size={100} className="text-muted" />}
        actions={(order) => (
          <Button
            variant="outline-success"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewOrder(order);
            }}
            title="View Order Details"
            className="d-flex align-items-center gap-1"
          >
            <FaEye />
            View
          </Button>
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