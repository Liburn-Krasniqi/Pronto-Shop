import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { apiClient } from "../../../../api/client";
import { useAuth } from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalClients: number;
  totalVendors: number;
  totalProducts: number;
  totalOrders: number;
  ordersOverTime: { date: string; count: number }[];
  orderStatusDistribution: { status: string; count: number }[];
  topProducts: { name: string; sales: number }[];
  revenueOverTime: { date: string; amount: number }[];
}

export function Dashboard() {
  const { isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    ordersOverTime: [],
    orderStatusDistribution: [],
    topProducts: [],
    revenueOverTime: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || userType !== 'admin') {
        navigate('/admin/login');
        return;
      }
    }
  }, [isAuthenticated, userType, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated || userType !== 'admin') return;

    console.log("Starting to fetch dashboard stats...");
    
    // Fetch only the count statistics using apiClient
    Promise.all([
      apiClient.get("/users/count").catch(err => {
        console.error("Error fetching users count:", err);
        return { count: 0 };
      }),
      apiClient.get("/vendor/count").catch(err => {
        console.error("Error fetching vendors count:", err);
        return { count: 0 };
      }),
      apiClient.get("/product/count").catch(err => {
        console.error("Error fetching products count:", err);
        return { count: 0 };
      }),
      apiClient.get("/orders/count").catch(err => {
        console.error("Error fetching orders count:", err);
        return { count: 0 };
      }),
    ])
      .then(([users, vendors, products, orders]) => {
        console.log("Received count data:", { users, vendors, products, orders });
        
        // Mock data for charts
        const mockOrdersOverTime = [
          { date: '2024-03-20', count: 12 },
          { date: '2024-03-21', count: 15 },
          { date: '2024-03-22', count: 8 },
          { date: '2024-03-23', count: 20 },
          { date: '2024-03-24', count: 25 },
          { date: '2024-03-25', count: 18 },
          { date: '2024-03-26', count: 22 },
        ];

        const mockOrderStatusDistribution = [
          { status: 'pending', count: 45 },
          { status: 'completed', count: 120 },
          { status: 'cancelled', count: 15 },
          { status: 'processing', count: 30 },
        ];

        const mockTopProducts = [
          { name: 'Organic Bananas', sales: 150 },
          { name: 'Fresh Milk', sales: 120 },
          { name: 'Whole Grain Bread', sales: 95 },
          { name: 'Free-Range Eggs', sales: 85 },
          { name: 'Greek Yogurt', sales: 75 },
        ];

        const mockRevenueOverTime = [
          { date: '2024-03-20', amount: 1250 },
          { date: '2024-03-21', amount: 1580 },
          { date: '2024-03-22', amount: 980 },
          { date: '2024-03-23', amount: 2100 },
          { date: '2024-03-24', amount: 2750 },
          { date: '2024-03-25', amount: 1950 },
          { date: '2024-03-26', amount: 2300 },
        ];

        setStats({
          totalClients: users.count,
          totalVendors: vendors.count,
          totalProducts: products.count,
          totalOrders: orders.count,
          ordersOverTime: mockOrdersOverTime,
          orderStatusDistribution: mockOrderStatusDistribution,
          topProducts: mockTopProducts,
          revenueOverTime: mockRevenueOverTime,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in Promise.all:", error);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      });
  }, [isAuthenticated, userType]);

  if (authLoading) {
    return <div className="text-center p-5">Checking authentication...</div>;
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null; // Will redirect in the first useEffect
  }

  if (loading) {
    return <div className="text-center p-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

  const ordersOverTimeData = {
    labels: stats.ordersOverTime.map(item => item.date),
    datasets: [
      {
        label: 'Orders',
        data: stats.ordersOverTime.map(item => item.count),
        borderColor: '#81B214',
        backgroundColor: 'rgba(129, 178, 20, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: stats.orderStatusDistribution.map(item => item.status),
    datasets: [
      {
        data: stats.orderStatusDistribution.map(item => item.count),
        backgroundColor: [
          '#81B214',
          '#206A5D',
          '#F1F1E8',
          '#FF6B6B',
        ],
      },
    ],
  };

  const topProductsData = {
    labels: stats.topProducts.map(item => item.name),
    datasets: [
      {
        label: 'Sales',
        data: stats.topProducts.map(item => item.sales),
        backgroundColor: '#81B214',
      },
    ],
  };

  const revenueOverTimeData = {
    labels: stats.revenueOverTime.map(item => item.date),
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.revenueOverTime.map(item => item.amount),
        borderColor: '#206A5D',
        backgroundColor: 'rgba(32, 106, 93, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Clients</h3>
              <h2 className="color-1">{stats.totalClients}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Vendors</h3>
              <h2 className="color-2">{stats.totalVendors}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Products</h3>
              <h2 className="color-3">{stats.totalProducts}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Orders</h3>
              <h2 className="color-4">{stats.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card className="shadow-bottom rounded-4 border-0">
            <Card.Body>
              <h3 className="mb-3">Orders Over Time</h3>
              <div style={{ height: '300px' }}>
                <Line
                  data={ordersOverTimeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="shadow-bottom rounded-4 border-0">
            <Card.Body>
              <h3 className="mb-3">Order Status Distribution</h3>
              <div style={{ height: '300px' }}>
                <Pie
                  data={orderStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="shadow-bottom rounded-4 border-0">
            <Card.Body>
              <h3 className="mb-3">Top Selling Products</h3>
              <div style={{ height: '300px' }}>
                <Bar
                  data={topProductsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-bottom rounded-4 border-0">
            <Card.Body>
              <h3 className="mb-3">Revenue Over Time</h3>
              <div style={{ height: '300px' }}>
                <Line
                  data={revenueOverTimeData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `$${value}`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
} 