import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface Subcategory {
  id?: number;
  name: string;
  description: string;
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subcategories?: Subcategory[];
}

interface EditCategoryData {
  name: string;
  description: string;
  subcategories: Subcategory[];
}

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editForm, setEditForm] = useState<EditCategoryData>({
    name: '',
    description: '',
    subcategories: []
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Starting to fetch categories...');
      const response = await apiClient.get('/category');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting categories state with data:', response);
        setCategories(response);
      } else {
        console.log('Response is not an array, setting empty array');
        setCategories([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch categories');
      setCategories([]);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditForm({
      name: '',
      description: '',
      subcategories: []
    });
    setError(null);
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleAddSubcategory = () => {
    setEditForm(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: '', description: '' }]
    }));
  };

  const handleRemoveSubcategory = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleSubcategoryChange = (index: number, field: 'name' | 'description', value: string) => {
    setEditForm(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) => 
        i === index ? { ...sub, [field]: value } : sub
      )
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // First create the category
      const categoryResponse = await apiClient.post('/category/create', {
        name: editForm.name,
        description: editForm.description
      });

      // Then create subcategories if any
      if (editForm.subcategories.length > 0) {
        const subcategoryPromises = editForm.subcategories.map(subcategory =>
          apiClient.post('/subcategory/create', {
            name: subcategory.name,
            description: subcategory.description,
            categoryId: categoryResponse.id
          })
        );
        await Promise.all(subcategoryPromises);
      }

      setShowCreateModal(false);
      resetForm();
      fetchCategories();
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.message || 'Failed to create category');
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setEditForm({
      name: category.name,
      description: category.description,
      subcategories: category.subcategories || []
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setError(null);

    try {
      // Update the category
      await apiClient.patch(`/category/${selectedCategory.id}`, {
        name: editForm.name,
        description: editForm.description
      });

      // Handle subcategories
      if (editForm.subcategories.length > 0) {
        const subcategoryPromises = editForm.subcategories.map(subcategory => {
          if (subcategory.id) {
            // Update existing subcategory
            return apiClient.patch(`/subcategory/${subcategory.id}`, {
              name: subcategory.name,
              description: subcategory.description
            });
          } else {
            // Create new subcategory
            return apiClient.post('/subcategory/create', {
              name: subcategory.name,
              description: subcategory.description,
              categoryId: selectedCategory.id
            });
          }
        });
        await Promise.all(subcategoryPromises);
      }

      setShowEditModal(false);
      fetchCategories();
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Failed to update category');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await apiClient.delete(`/category/${selectedCategory.id}`);
      setShowDeleteModal(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Categories</h2>
        <Button onClick={handleCreateClick} className="d-flex align-items-center background-1 color-white border-0">
          <FaPlus className="me-2" style={{ marginTop: '-1px' }} />
          Create New Category
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {categories.length === 0 ? (
        <div className="text-center p-5">
          <div className="mb-3">
            <i className="bi bi-tags fs-1 text-muted"></i>
          </div>
          <h4 className="text-muted mb-2">No Categories Found</h4>
          <p className="text-muted">There are currently no categories in the system.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Subcategories</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <ul className="mb-0 ps-3">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>{sub.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <em>No subcategories</em>
                  )}
                </td>
                <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2 background-1 color-white border-0"
                    onClick={() => handleEditClick(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(category)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => {
        setShowCreateModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Subcategories</Form.Label>
                <Button
                  size="sm"
                  onClick={handleAddSubcategory}
                  type="button"
                  className="background-1 color-white border-0"
                >
                  <FaPlus className="me-1" /> Add Subcategory
                </Button>
              </div>
              {editForm.subcategories.map((subcategory, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Subcategory {index + 1}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveSubcategory(index)}
                      type="button"
                    >
                      <FaMinus />
                    </Button>
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={subcategory.name}
                      onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
                      placeholder="Enter subcategory name"
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={subcategory.description}
                      onChange={(e) => handleSubcategoryChange(index, 'description', e.target.value)}
                      placeholder="Enter subcategory description"
                      required
                    />
                  </Form.Group>
                </div>
              ))}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Category
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
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">Subcategories</Form.Label>
                <Button
                  size="sm"
                  onClick={handleAddSubcategory}
                  type="button"
                  className="background-1 color-white border-0"
                >
                  <FaPlus className="me-1" /> Add Subcategory
                </Button>
              </div>
              {editForm.subcategories.map((subcategory, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Subcategory {index + 1}</h6>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveSubcategory(index)}
                      type="button"
                    >
                      <FaMinus />
                    </Button>
                  </div>
                  <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={subcategory.name}
                      onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
                      placeholder="Enter subcategory name"
                      required
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={subcategory.description}
                      onChange={(e) => handleSubcategoryChange(index, 'description', e.target.value)}
                      placeholder="Enter subcategory description"
                      required
                    />
                  </Form.Group>
                </div>
              ))}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
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
          Are you sure you want to delete this category? This action cannot be undone.
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