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

interface VendorDashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  ordersOverTime: { date: string; count: number }[];
  orderStatusDistribution: { status: string; count: number }[];
  topProducts: { name: string; sales: number }[];
  revenueOverTime: { date: string; amount: number }[];
}

type DateFilter = '7days' | '30days' | '90days' | 'lastYear';

export function VendorDashboard() {
  const { isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState<VendorDashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    ordersOverTime: [],
    orderStatusDistribution: [],
    topProducts: [],
    revenueOverTime: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get filter display text
  const getFilterDisplayText = (filter: DateFilter) => {
    switch (filter) {
      case '7days':
        return 'Last 7 Days';
      case '30days':
        return 'Last 30 Days';
      case '90days':
        return 'Last 90 Days';
      case 'lastYear':
        return 'Last Year';
      default:
        return 'Last 7 Days';
    }
  };

  const handleFilterChange = (filter: DateFilter) => {
    setDateFilter(filter);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.custom-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Helper function to format order status for display
  const formatOrderStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || userType !== 'vendor') {
        navigate('/vendor/signin');
        return;
      }
    }
  }, [isAuthenticated, userType, authLoading, navigate]);

  useEffect(() => {
    if (!isAuthenticated || userType !== 'vendor') return;

    console.log("Starting to fetch vendor dashboard stats...");
    setLoading(true);
    
    const filterParams = `?filter=${dateFilter}`;
    
    // Fetch vendor-specific statistics with filter parameter
    Promise.all([
      apiClient.get("/product/vendor/count").catch(err => {
        console.error("Error fetching vendor products count:", err);
        return { count: 0 };
      }),
      apiClient.get(`/orders/vendor/count${filterParams}`).catch(err => {
        console.error("Error fetching vendor orders count:", err);
        return { count: 0 };
      }),
      apiClient.get(`/orders/vendor/revenue${filterParams}`).catch(err => {
        console.error("Error fetching vendor revenue:", err);
        return { total: 0 };
      }),
      apiClient.get(`/orders/vendor/pending${filterParams}`).catch(err => {
        console.error("Error fetching pending orders:", err);
        return { count: 0 };
      }),
      apiClient.get(`/orders/vendor/stats${filterParams}`).catch(err => {
        console.error("Error fetching vendor dashboard stats:", err);
        return {
          ordersOverTime: [],
          orderStatusDistribution: [],
          topProducts: [],
          revenueOverTime: [],
        };
      }),
    ])
      .then(([products, orders, revenue, pending, stats]) => {
        console.log("Received vendor data:", { products, orders, revenue, pending, stats });
        
        setStats({
          totalProducts: products.count,
          totalOrders: orders.count,
          totalRevenue: revenue.total,
          pendingOrders: pending.count,
          ordersOverTime: stats.ordersOverTime || [],
          orderStatusDistribution: stats.orderStatusDistribution || [],
          topProducts: stats.topProducts || [],
          revenueOverTime: stats.revenueOverTime || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in Promise.all:", error);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      });
  }, [isAuthenticated, userType, dateFilter]);

  if (authLoading) {
    return <div className="text-center p-5">Checking authentication...</div>;
  }

  if (!isAuthenticated || userType !== 'vendor') {
    return null; // Will redirect in the first useEffect
  }

  if (loading) {
    return <div className="text-center p-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center p-5 text-danger">{error}</div>;
  }

  // Check if we have any data for charts
  const hasChartData = stats.ordersOverTime.length > 0 || 
                      stats.orderStatusDistribution.length > 0 || 
                      stats.topProducts.length > 0 || 
                      stats.revenueOverTime.length > 0;

  const ordersOverTimeData = {
    labels: stats.ordersOverTime.map(item => formatDateForDisplay(item.date)),
    datasets: [
      {
        label: 'Orders',
        data: stats.ordersOverTime.map(item => item.count),
        borderColor: '#206A5D',
        backgroundColor: 'rgba(32, 106, 93, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: stats.orderStatusDistribution.map(item => formatOrderStatus(item.status)),
    datasets: [
      {
        data: stats.orderStatusDistribution.map(item => item.count),
        backgroundColor: [
          '#206A5D',
          '#81B214',
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
        backgroundColor: '#206A5D',
      },
    ],
  };

  const revenueOverTimeData = {
    labels: stats.revenueOverTime.map(item => formatDateForDisplay(item.date)),
    datasets: [
      {
        label: 'Revenue ($)',
        data: stats.revenueOverTime.map(item => item.amount),
        borderColor: '#81B214',
        backgroundColor: 'rgba(129, 178, 20, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Vendor Dashboard</h2>
        <div className={`custom-dropdown ${isDropdownOpen ? 'open' : ''}`}>
          <div
            className="custom-dropdown-toggle"
            onClick={toggleDropdown}
          >
            {getFilterDisplayText(dateFilter)}
          </div>
          {isDropdownOpen && (
            <div className="custom-dropdown-menu">
              <div
                className={`custom-dropdown-item ${dateFilter === '7days' ? 'active' : ''}`}
                onClick={() => handleFilterChange('7days')}
              >
                Last 7 Days
              </div>
              <div
                className={`custom-dropdown-item ${dateFilter === '30days' ? 'active' : ''}`}
                onClick={() => handleFilterChange('30days')}
              >
                Last 30 Days
              </div>
              <div
                className={`custom-dropdown-item ${dateFilter === '90days' ? 'active' : ''}`}
                onClick={() => handleFilterChange('90days')}
              >
                Last 90 Days
              </div>
              <div
                className={`custom-dropdown-item ${dateFilter === 'lastYear' ? 'active' : ''}`}
                onClick={() => handleFilterChange('lastYear')}
              >
                Last Year
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">My Products</h3>
              <h2 className="color-1">{stats.totalProducts}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Orders</h3>
              <h2 className="color-2">{stats.totalOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Revenue</h3>
              <h2 className="color-3">${stats.totalRevenue}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Pending Orders</h3>
              <h2 className="color-4">{stats.pendingOrders}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {hasChartData ? (
        <>
          <Row className="g-4 mb-4">
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

          <Row className="g-4">
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
        </>
      ) : (
        <Row className="g-4">
          <Col>
            <Card className="shadow-bottom rounded-4 border-0">
              <Card.Body className="text-center">
                <h3 className="mb-3">No Data Available</h3>
                <p className="text-muted mb-4">
                  Charts will appear here once you have orders and sales data.
                </p>
                <button 
                  className="btn btn-outline-primary" 
                  onClick={async () => {
                    try {
                      await apiClient.post('/orders/vendor/sample-data', {});
                      window.location.reload(); // Refresh to show the new data
                    } catch (error) {
                      console.error('Error creating sample data:', error);
                      alert('Failed to create sample data');
                    }
                  }}
                >
                  Create Sample Data for Testing
                </button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
} 