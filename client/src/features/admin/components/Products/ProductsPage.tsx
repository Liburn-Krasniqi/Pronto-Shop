import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import { EnhancedTable, TableColumn } from '../../../../components/UI';

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
  vendor: {
    id: number;
    businessName: string;
  };
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

interface Inventory {
  stockQuantity: number;
  restockDate: string;
}

interface EditProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  subcategory: number | null;
  vendorId: number;
  imageURL: string;
  imageFile?: File;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  subcategory?: string;
  vendorId?: string;
  imageURL?: string;
  imageFile?: string;
}

interface Subcategory {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

interface Vendor {
  id: number;
  businessName: string;
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditProductData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    subcategory: null,
    vendorId: 0,
    imageURL: '',
    imageFile: undefined
  });

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
    fetchVendors();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await apiClient.get('/subcategory');
      if (Array.isArray(response)) {
        setSubcategories(response);
      } else {
        setSubcategories([]);
      }
    } catch (err: any) {
      console.error('Error fetching subcategories:', err);
      setError(err.message || 'Failed to fetch subcategories');
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await apiClient.get('/vendor');
      if (Array.isArray(response)) {
        setVendors(response);
      } else {
        setVendors([]);
      }
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      setError(err.message || 'Failed to fetch vendors');
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Starting to fetch products...');
      const response = await apiClient.get('/product');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting products state with data:', response);
        // Ensure each product has the correct type and required fields
        const typedProducts: Product[] = response.map(product => ({
          ...product,
          subcategory: product.subcategory?.map((sub: { id: number; name: string }) => ({
            id: sub.id,
            name: sub.name
          })) || [],
          vendor: {
            id: product.vendorid || 0,
            businessName: product.vendor?.businessName || 'No vendor'
          },
          inventory: product.Inventory ? {
            id: product.Inventory.id,
            stockQuantity: product.Inventory.stockQuantity,
            restockDate: product.Inventory.restockDate,
            updatedAt: product.Inventory.updatedAt
          } : undefined
        }));
        setProducts(typedProducts);
      } else {
        console.log('Response is not an array, setting empty array');
        setProducts([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
      setLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.inventory?.stockQuantity || 0,
      subcategory: product.subcategory[0]?.id || null,
      vendorId: product.vendorid,
      imageURL: product.imageURL?.[0] ? `http://localhost:3333${product.imageURL[0]}` : '',
      imageFile: undefined
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          imageFile: 'Please select an image file'
        }));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          imageFile: 'Image size should be less than 5MB'
        }));
        return;
      }

      setEditForm(prev => ({
        ...prev,
        imageFile: file,
        imageURL: URL.createObjectURL(file)
      }));
      setFormErrors(prev => ({
        ...prev,
        imageFile: undefined
      }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const errors: FormErrors = {};

    // Validate vendor exists
    if (!vendors.some(v => v.id === editForm.vendorId)) {
      errors.vendorId = 'Please select a valid vendor';
    }

    // Validate price
    if (editForm.price < 0 || editForm.price > 99999999.99) {
      errors.price = 'Price must be between 0 and 99999999.99';
    }

    // Validate stock
    if (editForm.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      let imageUrl = editForm.imageURL;
      
      // If there's a new image file, upload it first
      if (editForm.imageFile) {
        const formData = new FormData();
        formData.append('image', editForm.imageFile);
        
        const editUploadResponse = await apiClient.post('/upload', formData);
        
        imageUrl = editUploadResponse.url; // Assuming the API returns the uploaded image URL
      }

      const response = await apiClient.patch(`/product/${selectedProduct.id}`, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        vendorid: Number(editForm.vendorId),
        subcategory: [editForm.subcategory],
        imageURL: [imageUrl],
        inventory: {
          productId: selectedProduct.id,
          stockQuantity: Number(editForm.stock),
          restockDate: new Date().toISOString()
        }
      });
      
      setProducts(products.map(product => 
        product.id === selectedProduct.id 
          ? {
              ...product,
              name: editForm.name,
              description: editForm.description,
              price: editForm.price,
              vendorid: editForm.vendorId,
              subcategory: [{
                id: editForm.subcategory || 0,
                name: subcategories.find(s => s.id === editForm.subcategory)?.name || ''
              }],
              imageURL: [imageUrl],
              inventory: product.inventory ? {
                ...product.inventory,
                stockQuantity: Number(editForm.stock),
                restockDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              } : {
                id: selectedProduct.id,
                productId: selectedProduct.id,
                stockQuantity: Number(editForm.stock),
                restockDate: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
          : product
      ));
      
      setShowEditModal(false);
      setFormErrors({});
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      await apiClient.delete(`/product/${selectedProduct.id}`);
      setShowDeleteModal(false);
      setProducts(products.filter(product => product.id !== selectedProduct.id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
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
      displayName: 'Name',
      sortable: true,
      searchable: true,
      width: '15%'
    },
    {
      key: 'description',
      displayName: 'Description',
      sortable: true,
      searchable: true,
      width: '20%',
      render: (value) => (
        <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value}
        </div>
      )
    },
    {
      key: 'price',
      displayName: 'Price',
      sortable: true,
      searchable: false,
      width: '10%',
      render: (value) => formatPrice(Number(value))
    },
    {
      key: 'stockQuantity',
      displayName: 'Stock',
      sortable: true,
      searchable: false,
      width: '8%',
      transform: (product) => product.inventory?.stockQuantity ?? 0,
      render: (value, product) => (
        <span className={!product.inventory?.stockQuantity ? 'text-danger fw-bold' : ''}>
          {value}
        </span>
      )
    },
    {
      key: 'restockDate',
      displayName: 'Last Restock',
      sortable: true,
      searchable: false,
      width: '12%',
      transform: (product) => product.inventory?.restockDate,
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
    },
    {
      key: 'subcategory',
      displayName: 'Category',
      sortable: true,
      searchable: true,
      width: '12%',
      transform: (product) => product.subcategory[0]?.name || 'N/A'
    },
    {
      key: 'vendorid',
      displayName: 'Vendor ID',
      sortable: true,
      searchable: false,
      width: '8%'
    },
    {
      key: 'createdAt',
      displayName: 'Created',
      sortable: true,
      searchable: false,
      width: '10%',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  const resetForm = () => {
    setEditForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      subcategory: null,
      vendorId: 0,
      imageURL: '',
      imageFile: undefined
    });
    setError(null);
    setFormErrors({});
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: FormErrors = {};

    // Validate required fields
    if (!editForm.name) errors.name = 'Name is required';
    if (!editForm.description) errors.description = 'Description is required';
    if (!editForm.price) errors.price = 'Price is required';
    if (!editForm.vendorId) errors.vendorId = 'Vendor is required';
    if (!editForm.subcategory) errors.subcategory = 'Subcategory is required';
    if (!editForm.imageFile && !editForm.imageURL) errors.imageFile = 'Image is required';

    // Validate vendor exists
    if (!vendors.some(v => v.id === editForm.vendorId)) {
      errors.vendorId = 'Please select a valid vendor';
    }

    // Validate price
    if (editForm.price < 0 || editForm.price > 99999999.99) {
      errors.price = 'Price must be between 0 and 99999999.99';
    }

    // Validate stock
    if (editForm.stock < 0) {
      errors.stock = 'Stock cannot be negative';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      let imageUrl = editForm.imageURL;
      
      // If there's a new image file, upload it first
      if (editForm.imageFile) {
        const formData = new FormData();
        formData.append('image', editForm.imageFile);
        
        const createUploadResponse = await apiClient.post('/upload', formData);
        
        imageUrl = createUploadResponse.url; // Assuming the API returns the uploaded image URL
      }

      const response = await apiClient.post('/product/create', {
        product: {
          name: editForm.name,
          description: editForm.description,
          price: Number(editForm.price),
          vendorid: Number(editForm.vendorId),
          subcategory: [editForm.subcategory],
          imageURL: [imageUrl]
        },
        inventory: {
          stockQuantity: Number(editForm.stock),
          restockDate: new Date().toISOString()
        }
      });

      if (!response) {
        throw new Error('Failed to create product and inventory');
      }

      setShowCreateModal(false);
      resetForm();
      setFormErrors({});
      fetchProducts();
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product and inventory');
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>
        <Button onClick={handleCreateClick} className="d-flex align-items-center background-1 color-white border-0">
          <FaPlus className="me-2" style={{ marginTop: '-1px' }} />
          Create New Product
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {products.length === 0 ? (
        <div className="text-center p-5">
          <div className="mb-4">
            <img 
              src="http://localhost:3333/uploads/Software-Image-removebg-preview.png" 
              alt="No Products" 
              style={{ width: '500px', height: 'auto', opacity: 0.8 }}
            />
          </div>
          <h3 className="text-muted mb-3">No Products Found</h3>
          <p className="text-muted mb-4">There are currently no products in the system.</p>
        </div>
      ) : (
        <EnhancedTable
          data={products}
          columns={columns}
          loading={loading}
          itemsPerPage={15}
          searchable={true}
          sortable={true}
          emptyMessage="There are currently no products in the system."
          emptyIcon={<FaPlus size={100} className="text-muted" />}
          actions={(product) => (
            <div className="d-flex gap-1">
              <Button
                size="sm"
                className="background-1 color-white border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(product);
                }}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(product);
                }}
              >
                Delete
              </Button>
            </div>
          )}
        />
      )}

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => {
        setShowCreateModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: parseFloat(e.target.value) })
                }
                isInvalid={!!formErrors.price}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: parseInt(e.target.value) })
                }
                isInvalid={!!formErrors.stock}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.stock}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Select
                options={subcategories.map((subcategory) => ({
                  value: subcategory.id,
                  label: subcategory.name
                }))}
                value={editForm.subcategory ? {
                  value: editForm.subcategory,
                  label: subcategories.find(s => s.id === editForm.subcategory)?.name || ''
                } : null}
                onChange={(option) =>
                  setEditForm({ ...editForm, subcategory: option ? option.value : null })
                }
                isClearable
                placeholder="Search subcategory..."
                className={formErrors.subcategory ? 'is-invalid' : ''}
              />
              {formErrors.subcategory && (
                <div className="invalid-feedback d-block">
                  {formErrors.subcategory}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vendor</Form.Label>
              <Select
                options={vendors.map((vendor) => ({
                  value: vendor.id,
                  label: vendor.businessName
                }))}
                value={editForm.vendorId ? {
                  value: editForm.vendorId,
                  label: vendors.find(v => v.id === editForm.vendorId)?.businessName || ''
                } : null}
                onChange={(option) =>
                  setEditForm({ ...editForm, vendorId: option ? option.value : 0 })
                }
                isClearable
                placeholder="Select vendor..."
                className={formErrors.vendorId ? 'is-invalid' : ''}
              />
              {formErrors.vendorId && (
                <div className="invalid-feedback d-block">
                  {formErrors.vendorId}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                isInvalid={!!formErrors.imageFile}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.imageFile}
              </Form.Control.Feedback>
              {editForm.imageURL && (
                <div className="mt-2">
                  <img 
                    src={editForm.imageURL} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    className="border rounded"
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Create Product
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => {
        setShowEditModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                isInvalid={!!formErrors.description}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: parseFloat(e.target.value) })
                }
                isInvalid={!!formErrors.price}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.price}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={editForm.stock}
                onChange={(e) =>
                  setEditForm({ ...editForm, stock: parseInt(e.target.value) })
                }
                isInvalid={!!formErrors.stock}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.stock}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subcategory</Form.Label>
              <Select
                options={subcategories.map((subcategory) => ({
                  value: subcategory.id,
                  label: subcategory.name
                }))}
                value={editForm.subcategory ? {
                  value: editForm.subcategory,
                  label: subcategories.find(s => s.id === editForm.subcategory)?.name || ''
                } : null}
                onChange={(option) =>
                  setEditForm({ ...editForm, subcategory: option ? option.value : null })
                }
                isClearable
                placeholder="Search subcategory..."
                className={formErrors.subcategory ? 'is-invalid' : ''}
              />
              {formErrors.subcategory && (
                <div className="invalid-feedback d-block">
                  {formErrors.subcategory}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vendor</Form.Label>
              <Select
                options={vendors.map((vendor) => ({
                  value: vendor.id,
                  label: vendor.businessName
                }))}
                value={editForm.vendorId ? {
                  value: editForm.vendorId,
                  label: vendors.find(v => v.id === editForm.vendorId)?.businessName || ''
                } : null}
                onChange={(option) =>
                  setEditForm({ ...editForm, vendorId: option ? option.value : 0 })
                }
                isClearable
                placeholder="Select vendor..."
                className={formErrors.vendorId ? 'is-invalid' : ''}
              />
              {formErrors.vendorId && (
                <div className="invalid-feedback d-block">
                  {formErrors.vendorId}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                isInvalid={!!formErrors.imageFile}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.imageFile}
              </Form.Control.Feedback>
              {editForm.imageURL && (
                <div className="mt-2">
                  <img 
                    src={editForm.imageURL} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    className="border rounded"
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}; 