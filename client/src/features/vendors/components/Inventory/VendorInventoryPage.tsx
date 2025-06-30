import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaBoxes, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { EnhancedTable, TableColumn } from '../../../../components/UI';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  vendorid: number;
  subcategory: {
    id: number;
    name: string;
  }[];
  inventory?: {
    id: string;
    stockQuantity: number;
    restockDate: string | null;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
  imageURL: string[];
}

interface InventoryStats {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
}

interface FormErrors {
  stockQuantity?: string;
  restockDate?: string;
}

interface EditInventoryData {
  stockQuantity: number;
  restockDate: string;
}

export const VendorInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalStockValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditInventoryData>({
    stockQuantity: 0,
    restockDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Starting to fetch vendor products for inventory...');
      const response = await apiClient.get('/product/vendor/products');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting products state with data:', response);
        const typedProducts: Product[] = response.map(product => ({
          ...product,
          subcategory: product.subcategory?.map((sub: { id: number; name: string }) => ({
            id: sub.id,
            name: sub.name
          })) || [],
          inventory: product.Inventory ? {
            id: product.Inventory.id,
            stockQuantity: product.Inventory.stockQuantity,
            restockDate: product.Inventory.restockDate,
            updatedAt: product.Inventory.updatedAt
          } : undefined
        }));
        setProducts(typedProducts);
        calculateStats(typedProducts);
      } else {
        console.log('Response is not an array, setting empty array');
        setProducts([]);
        calculateStats([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching vendor products:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      calculateStats([]);
      setLoading(false);
    }
  };

  const calculateStats = (products: Product[]) => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => 
      (p.inventory?.stockQuantity || 0) > 0 && (p.inventory?.stockQuantity || 0) <= 10
    ).length;
    const outOfStockProducts = products.filter(p => 
      !p.inventory?.stockQuantity || p.inventory.stockQuantity === 0
    ).length;
    const totalStockValue = products.reduce((sum, product) => {
      const stockQuantity = product.inventory?.stockQuantity || 0;
      return sum + (stockQuantity * Number(product.price));
    }, 0);

    setStats({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalStockValue
    });
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      stockQuantity: product.inventory?.stockQuantity || 0,
      restockDate: product.inventory?.restockDate 
        ? new Date(product.inventory.restockDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validation
    const errors: FormErrors = {};
    if (editForm.stockQuantity < 0) errors.stockQuantity = 'Stock quantity cannot be negative';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Update inventory through the product update endpoint
      const response = await apiClient.patch(`/product/${selectedProduct?.id}`, {
        inventory: {
          stockQuantity: editForm.stockQuantity,
          restockDate: editForm.restockDate
        }
      });
      
      setShowEditModal(false);
      setFormErrors({});
      fetchProducts(); // Refresh to recalculate stats
      toast.success('Inventory updated successfully');
    } catch (err: any) {
      console.error('Error updating inventory:', err);
      setError(err.message || 'Failed to update inventory');
    }
  };

  const getStockStatus = (stockQuantity: number) => {
    if (stockQuantity === 0) return { variant: 'danger', text: 'Out of Stock', icon: <FaExclamationTriangle /> };
    if (stockQuantity <= 10) return { variant: 'warning', text: 'Low Stock', icon: <FaExclamationTriangle /> };
    return { variant: 'success', text: 'In Stock', icon: <FaCheckCircle /> };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Define table columns
  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      displayName: 'Product Name',
      sortable: true,
      searchable: true,
      width: '20%'
    },
    {
      key: 'subcategory',
      displayName: 'Category',
      sortable: true,
      searchable: true,
      width: '15%',
      transform: (product) => product.subcategory[0]?.name || 'N/A'
    },
    {
      key: 'price',
      displayName: 'Price',
      sortable: true,
      searchable: false,
      width: '12%',
      render: (value) => formatPrice(Number(value))
    },
    {
      key: 'stockQuantity',
      displayName: 'Stock Quantity',
      sortable: true,
      searchable: false,
      width: '12%',
      transform: (product) => product.inventory?.stockQuantity || 0,
      render: (value, product) => (
        <span className={!product.inventory?.stockQuantity ? 'text-danger fw-bold' : ''}>
          {value}
        </span>
      )
    },
    {
      key: 'stockStatus',
      displayName: 'Stock Status',
      sortable: true,
      searchable: false,
      width: '15%',
      transform: (product) => {
        const stockQuantity = product.inventory?.stockQuantity || 0;
        return stockQuantity === 0 ? 'Out of Stock' : stockQuantity <= 10 ? 'Low Stock' : 'In Stock';
      },
      render: (value, product) => {
        const stockQuantity = product.inventory?.stockQuantity || 0;
        const stockStatus = getStockStatus(stockQuantity);
        return (
          <Badge bg={stockStatus.variant} className="d-flex align-items-center gap-1">
            {stockStatus.icon}
            {stockStatus.text}
          </Badge>
        );
      }
    },
    {
      key: 'stockValue',
      displayName: 'Stock Value',
      sortable: true,
      searchable: false,
      width: '12%',
      transform: (product) => {
        const stockQuantity = product.inventory?.stockQuantity || 0;
        return stockQuantity * Number(product.price);
      },
      render: (value) => formatCurrency(Number(value))
    },
    {
      key: 'restockDate',
      displayName: 'Last Restock',
      sortable: true,
      searchable: false,
      width: '14%',
      transform: (product) => product.inventory?.restockDate,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
    }
  ];

  // Define actions for each row
  const actions = (product: Product) => (
    <Button
      size="sm"
      className="background-1 color-white border-0"
      onClick={(e) => {
        e.stopPropagation();
        handleEditClick(product);
      }}
    >
      Update Stock
    </Button>
  );

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Inventory Management</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Products</h3>
              <h2 className="color-1">{stats.totalProducts}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Low Stock Items</h3>
              <h2 className="color-2">{stats.lowStockProducts}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Out of Stock</h3>
              <h2 className="color-3">{stats.outOfStockProducts}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-bottom rounded-4 border-0">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-center mb-3">Total Stock Value</h3>
              <h2 className="color-4">{formatCurrency(stats.totalStockValue)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <EnhancedTable
        data={products}
        columns={columns}
        actions={actions}
        loading={loading}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        emptyMessage="You haven't added any products yet. Add products to start managing your inventory!"
        emptyIcon={<FaBoxes size={100} className="text-muted" />}
      />

      {/* Edit Inventory Modal */}
      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        setFormErrors({});
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Update Inventory - {selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={editForm.stockQuantity}
                onChange={(e) =>
                  setEditForm({ ...editForm, stockQuantity: parseInt(e.target.value) || 0 })
                }
                isInvalid={!!formErrors.stockQuantity}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.stockQuantity}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Restock Date</Form.Label>
              <Form.Control
                type="date"
                value={editForm.restockDate}
                onChange={(e) =>
                  setEditForm({ ...editForm, restockDate: e.target.value })
                }
                isInvalid={!!formErrors.restockDate}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.restockDate}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Update Inventory
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}; 