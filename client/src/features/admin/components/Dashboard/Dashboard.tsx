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
  // Extended stats
  categoryPerformance?: { category: string; subcategory: string; productCount: number }[];
  userRegistrationsByDate?: Record<string, number>;
  vendorPerformance?: { name: string; productCount: number; totalSales: number }[];
  inventoryLevels?: { product: string; stock: number }[];
  ratingsDistribution?: { rating: number; count: number }[];
  giftCardUsageByDate?: Record<string, number>;
  averageOrderValue?: { date: string; averageValue: number }[];
  priceDistribution?: { range: string; count: number }[];
}

type DateFilter = '7days' | '30days' | '90days' | 'lastYear';

export function Dashboard() {
  const { isAuthenticated, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>('7days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        return 'Last 30 Days';
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
    setLoading(true);
    
    const filterParams = `?filter=${dateFilter}`;
    
    // Fetch count statistics and chart data using apiClient with filter parameter
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
      apiClient.get(`/orders/count${filterParams}`).catch(err => {
        console.error("Error fetching orders count:", err);
        return { count: 0 };
      }),
      apiClient.get(`/orders/stats${filterParams}`).catch(err => {
        console.error("Error fetching orders stats:", err);
        return {
          ordersOverTime: [],
          orderStatusDistribution: [],
          topProducts: [],
          revenueOverTime: [],
        };
      }),
      apiClient.get(`/orders/extended-stats${filterParams}`).catch(err => {
        console.error("Error fetching extended stats:", err);
        return {
          categoryPerformance: [],
          userRegistrationsByDate: {},
          vendorPerformance: [],
          inventoryLevels: [],
          ratingsDistribution: [],
          giftCardUsageByDate: {},
          averageOrderValue: [],
          priceDistribution: [],
        };
      }),
    ])
      .then(([users, vendors, products, orders, stats, extendedStats]) => {
        console.log("Received data:", { users, vendors, products, orders, stats, extendedStats });
        
        setStats({
          totalClients: users.count,
          totalVendors: vendors.count,
          totalProducts: products.count,
          totalOrders: orders.count,
          ordersOverTime: stats.ordersOverTime || [],
          orderStatusDistribution: stats.orderStatusDistribution || [],
          topProducts: stats.topProducts || [],
          revenueOverTime: stats.revenueOverTime || [],
          // Extended stats
          categoryPerformance: extendedStats.categoryPerformance || [],
          userRegistrationsByDate: extendedStats.userRegistrationsByDate || {},
          vendorPerformance: extendedStats.vendorPerformance || [],
          inventoryLevels: extendedStats.inventoryLevels || [],
          ratingsDistribution: extendedStats.ratingsDistribution || [],
          giftCardUsageByDate: extendedStats.giftCardUsageByDate || {},
          averageOrderValue: extendedStats.averageOrderValue || [],
          priceDistribution: extendedStats.priceDistribution || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error in Promise.all:", error);
        setError("Failed to load dashboard statistics");
        setLoading(false);
      });
  }, [isAuthenticated, userType, dateFilter]);

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
    labels: stats.ordersOverTime.map(item => formatDateForDisplay(item.date)),
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
    labels: stats.orderStatusDistribution.map(item => formatOrderStatus(item.status)),
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
    labels: stats.revenueOverTime.map(item => formatDateForDisplay(item.date)),
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

  // Check if we have any data for charts
  const hasChartData = stats.ordersOverTime.length > 0 || 
                      stats.orderStatusDistribution.length > 0 || 
                      stats.topProducts.length > 0 || 
                      stats.revenueOverTime.length > 0;

  // Extended charts data
  const categoryPerformanceData = {
    labels: stats.categoryPerformance?.map(item => `${item.category} - ${item.subcategory}`) || [],
    datasets: [
      {
        label: 'Product Count',
        data: stats.categoryPerformance?.map(item => item.productCount) || [],
        backgroundColor: [
          '#81B214',
          '#206A5D',
          '#F1F1E8',
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7',
        ],
      },
    ],
  };

  const vendorPerformanceData = {
    labels: stats.vendorPerformance?.map(item => item.name) || [],
    datasets: [
      {
        label: 'Total Sales ($)',
        data: stats.vendorPerformance?.map(item => item.totalSales) || [],
        backgroundColor: '#206A5D',
      },
    ],
  };

  const inventoryLevelsData = {
    labels: stats.inventoryLevels?.map(item => item.product) || [],
    datasets: [
      {
        label: 'Stock Level',
        data: stats.inventoryLevels?.map(item => item.stock) || [],
        backgroundColor: '#81B214',
      },
    ],
  };

  const ratingsDistributionData = {
    labels: stats.ratingsDistribution?.map(item => `${item.rating} Stars`) || [],
    datasets: [
      {
        data: stats.ratingsDistribution?.map(item => item.count) || [],
        backgroundColor: [
          '#FF6B6B',
          '#FFA726',
          '#FFD54F',
          '#81C784',
          '#4CAF50',
        ],
      },
    ],
  };

  const averageOrderValueData = {
    labels: stats.averageOrderValue?.map(item => formatDateForDisplay(item.date)) || [],
    datasets: [
      {
        label: 'Average Order Value ($)',
        data: stats.averageOrderValue?.map(item => item.averageValue) || [],
        borderColor: '#4ECDC4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const priceDistributionData = {
    labels: stats.priceDistribution?.map(item => item.range) || [],
    datasets: [
      {
        label: 'Number of Products',
        data: stats.priceDistribution?.map(item => item.count) || [],
        backgroundColor: [
          '#81B214',
          '#206A5D',
          '#F1F1E8',
          '#FF6B6B',
          '#4ECDC4',
        ],
      },
    ],
  };

  // Check if we have extended chart data
  const hasExtendedChartData = (stats.categoryPerformance?.length || 0) > 0 || 
                              (stats.vendorPerformance?.length || 0) > 0 || 
                              (stats.inventoryLevels?.length || 0) > 0 || 
                              (stats.ratingsDistribution?.length || 0) > 0 || 
                              (stats.averageOrderValue?.length || 0) > 0 || 
                              (stats.priceDistribution?.length || 0) > 0;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Admin Dashboard</h2>
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

      {hasChartData ? (
        <>
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
        </>
      ) : (
        <Row className="mt-4">
          <Col>
            <Card className="shadow-bottom rounded-4 border-0">
              <Card.Body className="text-center">
                <h3 className="mb-3">No Chart Data Available</h3>
                <p className="text-muted">
                  Charts will appear here once there are orders and products in the system.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {hasExtendedChartData && (
        <>
          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-bottom rounded-4 border-0">
                <Card.Body>
                  <h3 className="mb-3">Category Performance</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={categoryPerformanceData}
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
                  <h3 className="mb-3">Vendor Performance</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={vendorPerformanceData}
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
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-bottom rounded-4 border-0">
                <Card.Body>
                  <h3 className="mb-3">Inventory Levels</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={inventoryLevelsData}
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
                  <h3 className="mb-3">Ratings Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={ratingsDistributionData}
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
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-bottom rounded-4 border-0">
                <Card.Body>
                  <h3 className="mb-3">Average Order Value</h3>
                  <div style={{ height: '300px' }}>
                    <Line
                      data={averageOrderValueData}
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
            <Col md={6}>
              <Card className="shadow-bottom rounded-4 border-0">
                <Card.Body>
                  <h3 className="mb-3">Price Distribution</h3>
                  <div style={{ height: '300px' }}>
                    <Bar
                      data={priceDistributionData}
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
          </Row>
        </>
      )}
    </div>
  );
} 