import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaBoxes, FaImage } from 'react-icons/fa';
import { EnhancedTable, TableColumn } from '../../../../components/UI';
import Select from 'react-select';
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

interface Subcategory {
  id: number;
  name: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  subcategory?: string;
  imageFile?: string;
}

interface ProductImage {
  url: string;
  file?: File;
  isNew?: boolean;
}

interface EditProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  subcategory: number | null;
  images: ProductImage[];
}

export const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditProductData>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    subcategory: null,
    images: []
  });

  useEffect(() => {
    fetchSubcategories();
    fetchProducts();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await apiClient.get('/subcategory');
      setSubcategories(response);
    } catch (err: any) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Starting to fetch vendor products...');
      const response = await apiClient.get('/product/vendor/products');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting products state with data:', response);
        // Ensure each product has the correct type and required fields
        const typedProducts: Product[] = response.map(product => {
          console.log('Product imageURL:', product.imageURL); // Debug log for each product
          return {
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
          };
        });
        setProducts(typedProducts);
      } else {
        console.log('Response is not an array, setting empty array');
        setProducts([]);
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
      setLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    console.log('=== EDIT CLICK DEBUG ===');
    console.log('Product:', product);
    console.log('Product imageURL:', product.imageURL);
    console.log('Product imageURL type:', typeof product.imageURL);
    console.log('Product imageURL length:', product.imageURL?.length);
    console.log('Window location origin:', window.location.origin);
    
    setSelectedProduct(product);
    
    const processedImages = product.imageURL.map((url, index) => {
      // Use backend server URL (port 3333) for images instead of frontend URL (port 3000)
      const backendUrl = 'http://localhost:3333';
      const processedUrl = url.startsWith('http') ? url : `${backendUrl}${url}`;
      console.log(`Image ${index}: Original: ${url}, Processed: ${processedUrl}`);
      return {
        url: processedUrl,
        isNew: false
      };
    });
    
    console.log('Processed images:', processedImages);
    
    setEditForm({
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.inventory?.stockQuantity || 0,
      subcategory: product.subcategory[0]?.id || null,
      images: processedImages
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        url,
        file,
        isNew: true
      });
    }

    setEditForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setEditForm(prev => {
      const newImages = [...prev.images];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return { ...prev, images: newImages };
    });
  };

  const moveImageDown = (index: number) => {
    setEditForm(prev => {
      if (index === prev.images.length - 1) return prev;
      const newImages = [...prev.images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return { ...prev, images: newImages };
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post('/upload', formData);
    return response.url;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validation
    const errors: FormErrors = {};
    if (!editForm.name.trim()) errors.name = 'Name is required';
    if (!editForm.description.trim()) errors.description = 'Description is required';
    if (editForm.price <= 0) errors.price = 'Price must be greater than 0';
    if (editForm.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!editForm.subcategory) errors.subcategory = 'Subcategory is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Upload new images first
      const uploadedUrls: string[] = [];
      for (const image of editForm.images) {
        if (image.isNew && image.file) {
          const uploadedUrl = await uploadImage(image.file);
          uploadedUrls.push(uploadedUrl);
        } else {
          // For existing images, extract the URL (remove the backend origin if it was added)
          const backendUrl = 'http://localhost:3333';
          const url = image.url.startsWith('http') && image.url.includes(backendUrl) 
            ? image.url.replace(backendUrl, '') 
            : image.url;
          uploadedUrls.push(url);
        }
      }

      // Prepare the update data
      const updateData: any = {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        subcategory: [editForm.subcategory],
        inventory: {
          stockQuantity: editForm.stock
        },
        imageURL: uploadedUrls
      };

      await apiClient.patch(`/product/${selectedProduct?.id}`, updateData);

      setShowEditModal(false);
      setFormErrors({});
      fetchProducts();
      toast.success('Product updated successfully');
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
      fetchProducts();
      toast.success('Product deleted successfully');
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const resetForm = () => {
    setEditForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      subcategory: null,
      images: []
    });
    setFormErrors({});
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validation
    const errors: FormErrors = {};
    if (!editForm.name.trim()) errors.name = 'Name is required';
    if (!editForm.description.trim()) errors.description = 'Description is required';
    if (editForm.price <= 0) errors.price = 'Price must be greater than 0';
    if (editForm.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!editForm.subcategory) errors.subcategory = 'Subcategory is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      // Upload images first
      const uploadedUrls: string[] = [];
      for (const image of editForm.images) {
        if (image.file) {
          const uploadedUrl = await uploadImage(image.file);
          uploadedUrls.push(uploadedUrl);
        }
      }

      // Prepare the create data
      const createData = {
        product: {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          subcategory: [editForm.subcategory],
          imageURL: uploadedUrls
        },
        inventory: {
          stockQuantity: editForm.stock
        }
      };

      await apiClient.post('/product/vendor/create', createData);

      setShowCreateModal(false);
      resetForm();
      fetchProducts();
      toast.success('Product created successfully');
    } catch (err: any) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    }
  };

  // Define table columns
  const columns: TableColumn<Product>[] = [
    {
      key: 'imageURL',
      displayName: 'Image',
      sortable: false,
      searchable: false,
      width: '10%',
      render: (value, product) => {
        const firstImage = product.imageURL[0];
        if (!firstImage) {
          return (
            <div className="d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <FaImage size={20} className="text-muted" />
            </div>
          );
        }
        const backendUrl = 'http://localhost:3333';
        const imageUrl = firstImage.startsWith('http') ? firstImage : `${backendUrl}${firstImage}`;
        return (
          <img 
            src={imageUrl} 
            alt={product.name}
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('d-none');
            }}
          />
        );
      }
    },
    {
      key: 'name',
      displayName: 'Name',
      sortable: true,
      searchable: true,
      width: '18%'
    },
    {
      key: 'description',
      displayName: 'Description',
      sortable: true,
      searchable: true,
      width: '22%',
      render: (value) => (
        <div style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
      width: '10%',
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
      width: '10%',
      transform: (product) => product.subcategory[0]?.name || 'N/A'
    },
    {
      key: 'createdAt',
      displayName: 'Created',
      sortable: true,
      searchable: false,
      width: '8%',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  // Define actions for each row
  const actions = (product: Product) => (
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
  );

  if (loading) return <div className="text-center p-5">Loading...</div>;
  if (error) return <div className="text-center p-5 text-danger">{error}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Products</h2>
        <Button 
          onClick={handleCreateClick}
          className="background-1 color-white border-0 d-flex align-items-center gap-2"
        >
          <FaPlus />
          Add Product
        </Button>
      </div>

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
        emptyMessage="You haven't added any products yet. Start by creating your first product!"
        emptyIcon={<FaBoxes size={100} className="text-muted" />}
      />

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => {
        setShowCreateModal(false);
        resetForm();
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
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
                value={subcategories.find(s => s.id === editForm.subcategory)}
                onChange={(option) =>
                  setEditForm({ ...editForm, subcategory: option?.id || null })
                }
                options={subcategories}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id.toString()}
                placeholder="Select subcategory"
              />
              {formErrors.subcategory && (
                <div className="text-danger small mt-1">{formErrors.subcategory}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                isInvalid={!!formErrors.imageFile}
              />
              <Form.Text className="text-muted">
                You can select multiple images. First image will be the main product image.
              </Form.Text>
              
              {editForm.images.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Images ({editForm.images.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {editForm.images.map((image, index) => {
                      console.log(`=== IMAGE PREVIEW DEBUG ${index} ===`);
                      console.log('Image object:', image);
                      console.log('Image URL:', image.url);
                      console.log('Image isNew:', image.isNew);
                      return (
                        <div key={index} className="position-relative" style={{ width: '120px' }}>
                          <img 
                            src={image.url} 
                            alt={`Preview ${index + 1}`} 
                            className="img-thumbnail"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            onLoad={() => console.log(`Image ${index} loaded successfully:`, image.url)}
                            onError={(e) => {
                              console.error(`Failed to load image ${index}:`, image.url);
                              console.error('Error event:', e);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show error placeholder
                              const placeholder = document.createElement('div');
                              placeholder.className = 'd-flex align-items-center justify-content-center';
                              placeholder.style.cssText = 'width: 120px; height: 120px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;';
                              placeholder.innerHTML = '<span class="text-muted">Image Error</span>';
                              target.parentNode?.appendChild(placeholder);
                            }}
                          />
                          <div className="position-absolute top-0 end-0 d-flex flex-column">
                            <Button
                              size="sm"
                              variant="danger"
                              className="rounded-circle p-1"
                              style={{ width: '24px', height: '24px', fontSize: '10px' }}
                              onClick={() => removeImage(index)}
                            >
                              <FaTrash size={10} />
                            </Button>
                            {index > 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-circle p-1 mt-1"
                                style={{ width: '24px', height: '24px', fontSize: '10px' }}
                                onClick={() => moveImageUp(index)}
                              >
                                <FaArrowUp size={10} />
                              </Button>
                            )}
                            {index < editForm.images.length - 1 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-circle p-1 mt-1"
                                style={{ width: '24px', height: '24px', fontSize: '10px' }}
                                onClick={() => moveImageDown(index)}
                              >
                                <FaArrowDown size={10} />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Product - {selectedProduct?.name}</Modal.Title>
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
                value={subcategories.find(s => s.id === editForm.subcategory)}
                onChange={(option) =>
                  setEditForm({ ...editForm, subcategory: option?.id || null })
                }
                options={subcategories}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id.toString()}
                placeholder="Select subcategory"
              />
              {formErrors.subcategory && (
                <div className="text-danger small mt-1">{formErrors.subcategory}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                isInvalid={!!formErrors.imageFile}
              />
              <Form.Text className="text-muted">
                You can select multiple images. First image will be the main product image.
              </Form.Text>
              
              {editForm.images.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Images ({editForm.images.length})</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {editForm.images.map((image, index) => {
                      console.log(`=== IMAGE PREVIEW DEBUG ${index} ===`);
                      console.log('Image object:', image);
                      console.log('Image URL:', image.url);
                      console.log('Image isNew:', image.isNew);
                      return (
                        <div key={index} className="position-relative" style={{ width: '120px' }}>
                          <img 
                            src={image.url} 
                            alt={`Preview ${index + 1}`} 
                            className="img-thumbnail"
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            onLoad={() => console.log(`Image ${index} loaded successfully:`, image.url)}
                            onError={(e) => {
                              console.error(`Failed to load image ${index}:`, image.url);
                              console.error('Error event:', e);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show error placeholder
                              const placeholder = document.createElement('div');
                              placeholder.className = 'd-flex align-items-center justify-content-center';
                              placeholder.style.cssText = 'width: 120px; height: 120px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;';
                              placeholder.innerHTML = '<span class="text-muted">Image Error</span>';
                              target.parentNode?.appendChild(placeholder);
                            }}
                          />
                          <div className="position-absolute top-0 end-0 d-flex flex-column">
                            <Button
                              size="sm"
                              variant="danger"
                              className="rounded-circle p-1"
                              style={{ width: '24px', height: '24px', fontSize: '10px' }}
                              onClick={() => removeImage(index)}
                            >
                              <FaTrash size={10} />
                            </Button>
                            {index > 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-circle p-1 mt-1"
                                style={{ width: '24px', height: '24px', fontSize: '10px' }}
                                onClick={() => moveImageUp(index)}
                              >
                                <FaArrowUp size={10} />
                              </Button>
                            )}
                            {index < editForm.images.length - 1 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="rounded-circle p-1 mt-1"
                                style={{ width: '24px', height: '24px', fontSize: '10px' }}
                                onClick={() => moveImageDown(index)}
                              >
                                <FaArrowDown size={10} />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Update Product
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
          Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
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