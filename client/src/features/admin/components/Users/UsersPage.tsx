import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaPlus } from 'react-icons/fa';

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  addresses: Address;
}

interface EditUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  addresses?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    addresses: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  const resetForm = () => {
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      addresses: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    });
    setEmailError(null);
    setError(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Starting to fetch users...');
      const response = await apiClient.get('/users');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting users state with data:', response);
        setUsers(response);
      } else {
        console.log('Response is not an array, setting empty array');
        setUsers([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch users');
      setUsers([]);
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setError(null);

    if (editForm.password !== editForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (editForm.password && editForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { password, confirmPassword, ...userData } = editForm;
      await apiClient.post('/users', { ...userData, password });
      setShowCreateModal(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      console.error('Error creating user:', err);
      if (err.response?.data?.message?.includes('Email already exists')) {
        setEmailError('This email is already registered');
      } else {
        setError(err.message || 'Failed to create user');
      }
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      confirmPassword: '',
      addresses: user.addresses,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setEmailError(null);
    setError(null);

    if (editForm.password !== editForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (editForm.password && editForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const { password, confirmPassword, ...userData } = editForm;
      const updateData = password ? { ...userData, password } : userData;
      const { data: response } = await apiClient.put(`/users/${selectedUser.id}`, updateData);
      console.log('API Response:', response);
      
      setShowEditModal(false);
      await fetchUsers();
    } catch (err: any) {
      console.error('Error updating user:', err);
      if (err.response?.data?.message?.includes('Email already exists')) {
        setEmailError('This email is already registered');
      } else {
        setError(err.message || 'Failed to update user');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await apiClient.delete(`/users/${selectedUser.id}`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return '';
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(part => part && part.trim() !== '');
    
    return parts.length > 0 ? parts.join(', ') : '';
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Clients</h2>
        <Button onClick={handleCreateClick} className="d-flex align-items-center background-1 color-white border-0">
          <FaPlus className="me-2" style={{ marginTop: '-1px' }} />
          Create New Client
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="text-center p-5">
          <div className="mb-4">
            <img 
              src="http://localhost:3333/uploads/Software-Image-removebg-preview.png" 
              alt="No Clients" 
              style={{ width: '500px', height: 'auto', opacity: 0.8 }}
            />
          </div>
          <h3 className="text-muted mb-3">No Clients Found</h3>
          <p className="text-muted mb-4">There are currently no clients in the system.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{formatAddress(user.addresses)}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2 background-1 color-white border-0"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(user)}
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
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              {emailError && (
                <Alert variant="danger" className="mb-2">
                  {emailError}
                </Alert>
              )}
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => {
                  setEditForm({ ...editForm, email: e.target.value });
                  setEmailError(null);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
                required
                minLength={6}
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={editForm.confirmPassword}
                onChange={(e) =>
                  setEditForm({ ...editForm, confirmPassword: e.target.value })
                }
                required
                minLength={6}
              />
            </Form.Group>

            <h5 className="mt-4">Address</h5>
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.street}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      street: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.city}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      city: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.state}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      state: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.postalCode}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      postalCode: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.country}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      country: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Create User
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
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.firstName}
                onChange={(e) =>
                  setEditForm({ ...editForm, firstName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.lastName}
                onChange={(e) =>
                  setEditForm({ ...editForm, lastName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              {emailError && (
                <Alert variant="danger" className="mb-2">
                  {emailError}
                </Alert>
              )}
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) => {
                  setEditForm({ ...editForm, email: e.target.value });
                  setEmailError(null);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password (Optional)</Form.Label>
              <Form.Control
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm({ ...editForm, password: e.target.value })
                }
                minLength={6}
              />
              <Form.Text className="text-muted">
                Leave blank to keep current password. Must be at least 6 characters if provided.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={editForm.confirmPassword}
                onChange={(e) =>
                  setEditForm({ ...editForm, confirmPassword: e.target.value })
                }
                minLength={6}
              />
            </Form.Group>

            <h5 className="mt-4">Address</h5>
            <Form.Group className="mb-3">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.street}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      street: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.city}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      city: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.state}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      state: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.postalCode}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      postalCode: e.target.value,
                    },
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={editForm.addresses?.country}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    addresses: {
                      ...editForm.addresses!,
                      country: e.target.value,
                    },
                  })
                }
              />
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
          Are you sure you want to delete this user? This action cannot be undone.
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