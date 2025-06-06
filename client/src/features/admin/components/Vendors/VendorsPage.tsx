import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { FaPlus } from 'react-icons/fa';

interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Vendor {
  id: number;
  email: string;
  name: string;
  businessName: string;
  phone_number: string;
  createdAt: string;
  updatedAt: string;
  addresses: Address;
}

interface EditVendorData {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  phoneNumber: string;
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

export const VendorsPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState<EditVendorData>({
    firstName: '',
    lastName: '',
    email: '',
    businessName: '',
    phoneNumber: '',
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

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      console.log('Starting to fetch vendors...');
      const response = await apiClient.get('/vendor');
      console.log('API Response:', response);
      
      if (Array.isArray(response)) {
        console.log('Setting vendors state with data:', response);
        setVendors(response);
      } else {
        console.log('Response is not an array, setting empty array');
        setVendors([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching vendors:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        response: err.response
      });
      setError(err.message || 'Failed to fetch vendors');
      setVendors([]);
      setLoading(false);
    }
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    const [firstName = '', lastName = ''] = vendor.name.split(' ');
    setEditForm({
      firstName,
      lastName,
      email: vendor.email,
      businessName: vendor.businessName,
      phoneNumber: vendor.phone_number,
      addresses: vendor.addresses,
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVendor) return;

    try {
      const { data: response } = await apiClient.patch(`/vendor/${selectedVendor.id}`, {
        name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        email: editForm.email,
        businessName: editForm.businessName,
        phone_number: editForm.phoneNumber,
        addresses: editForm.addresses
      });
      console.log('API Response:', response);
      
      // Update the vendors list with the edited vendor
      setVendors(vendors.map(vendor => 
        vendor.id === selectedVendor.id 
          ? {
              ...vendor,
              name: `${editForm.firstName} ${editForm.lastName}`.trim(),
              email: editForm.email,
              businessName: editForm.businessName,
              phone_number: editForm.phoneNumber,
              addresses: editForm.addresses ? {
                ...editForm.addresses,
                id: vendor.addresses?.id
              } : vendor.addresses
            }
          : vendor
      ));
      
      setShowEditModal(false);
    } catch (err: any) {
      console.error('Error updating vendor:', err);
      setError(err.message || 'Failed to update vendor');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedVendor) return;

    try {
      await apiClient.delete(`/vendor/${selectedVendor.id}`);
      setShowDeleteModal(false);
      fetchVendors();
    } catch (err: any) {
      setError(err.message || 'Failed to delete vendor');
    }
  };

  const formatAddress = (address: Address | null) => {
    if (!address) return 'N/A';
    
    const parts = [
      address.street,
      address.city,
      address.state,
      address.postalCode
    ].filter(part => part && part.trim() !== '');

    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  const formatContactName = (firstName: string | undefined, lastName: string | undefined) => {
    const parts = [firstName, lastName].filter(part => part && part.trim() !== '');
    return parts.length > 0 ? parts.join(' ') : '';
  };

  const resetForm = () => {
    setEditForm({
      firstName: '',
      lastName: '',
      email: '',
      businessName: '',
      phoneNumber: '',
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
      const { password, confirmPassword, ...vendorData } = editForm;
      const { data: response } = await apiClient.post('/vendor', {
        ...vendorData,
        name: `${editForm.firstName} ${editForm.lastName}`.trim(),
        phone_number: editForm.phoneNumber,
        password: editForm.password,
        address: editForm.addresses
      });
      
      setShowCreateModal(false);
      resetForm();
      fetchVendors();
    } catch (err: any) {
      console.error('Error creating vendor:', err);
      if (err.response?.data?.message?.includes('Email already exists')) {
        setEmailError('This email is already registered');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to create vendor');
      }
    }
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;


  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Vendors</h2>
        <Button onClick={handleCreateClick} className="d-flex align-items-center background-1 color-white border-0">
          <FaPlus className="me-2" style={{ marginTop: '-1px' }} />
          Create New Vendor
        </Button>
      </div>

      {vendors.length === 0 ? (
        <div className="text-center p-5">
          <div className="mb-4">
            <img 
              src="http://localhost:3333/uploads/Software-Image-removebg-preview.png" 
              alt="No Vendors" 
              style={{ width: '500px', height: 'auto', opacity: 0.8 }}
            />
          </div>
          <h3 className="text-muted mb-3">No Vendors Found</h3>
          <p className="text-muted mb-4">There are currently no vendors in the system.</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Contact Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td>{vendor.businessName}</td>
                <td>{vendor.name}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone_number}</td>
                <td>{formatAddress(vendor.addresses)}</td>
                <td>{new Date(vendor.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    size="sm"
                    className="me-2 background-1 color-white border-0"
                    onClick={() => handleEditClick(vendor)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteClick(vendor)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.businessName}
                onChange={(e) =>
                  setEditForm({ ...editForm, businessName: e.target.value })
                }
                required
              />
            </Form.Group>

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
              <Form.Control
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
                required
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

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => {
        setShowCreateModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Business Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.businessName}
                onChange={(e) =>
                  setEditForm({ ...editForm, businessName: e.target.value })
                }
                required
              />
            </Form.Group>

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
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) =>
                  setEditForm({ ...editForm, phoneNumber: e.target.value })
                }
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
              <Button variant="secondary" onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit" className="background-1 color-white border-0">
                Create Vendor
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
          Are you sure you want to delete this vendor? This action cannot be undone.
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