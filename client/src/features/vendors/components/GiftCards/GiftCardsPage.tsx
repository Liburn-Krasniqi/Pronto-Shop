import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { EnhancedTable, TableColumn } from '../../../../components/UI';
import { FaGift, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export const GiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', amount: '', expiresAt: '' });
  const [error, setError] = useState<string | null>(null);

  const fetchGiftCards = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/gift-cards/vendor');
      console.log('Gift cards response:', res); // Debug log
      
      // Handle different response structures
      if (Array.isArray(res)) {
        setGiftCards(res);
      } else if (res && Array.isArray(res.data)) {
        setGiftCards(res.data);
      } else if (res && Array.isArray(res.giftCards)) {
        setGiftCards(res.giftCards);
      } else {
        console.warn('Unexpected response structure:', res);
        setGiftCards([]);
      }
    } catch (err: any) {
      console.error('Error fetching gift cards:', err);
      setError('Failed to fetch gift cards');
      setGiftCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
  }, []);

  const handleShowModal = () => {
    setForm({ code: '', amount: '', expiresAt: '' });
    setShowModal(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Auto-capitalize the gift card code
    if (name === 'code') {
      setForm({ ...form, [name]: value.toUpperCase() });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: any = {
        code: form.code,
        amount: parseFloat(form.amount),
      };
      if (form.expiresAt) payload.expiresAt = form.expiresAt;
      await apiClient.post('/gift-cards/vendor', payload);
      toast.success('Gift card created successfully!');
      setShowModal(false);
      fetchGiftCards();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create gift card');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge bg="success" className="d-flex align-items-center gap-1">
        <FaCheckCircle />
        Active
      </Badge>
    ) : (
      <Badge bg="danger" className="d-flex align-items-center gap-1">
        <FaTimesCircle />
        Inactive
      </Badge>
    );
  };

  // Define table columns
  const columns: TableColumn<GiftCard>[] = [
    {
      key: 'code',
      displayName: 'Code',
      sortable: true,
      searchable: true,
      width: '15%',
      render: (value) => (
        <span className="text-dark">{value}</span>
      )
    },
    {
      key: 'amount',
      displayName: 'Amount',
      sortable: true,
      searchable: false,
      width: '15%',
      render: (value) => formatCurrency(Number(value))
    },
    {
      key: 'balance',
      displayName: 'Balance',
      sortable: true,
      searchable: false,
      width: '15%',
      render: (value) => formatCurrency(Number(value))
    },
    {
      key: 'isActive',
      displayName: 'Status',
      sortable: true,
      searchable: true,
      width: '15%',
      filterOptions: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' }
      ],
      render: (value) => getStatusBadge(Boolean(value))
    },
    {
      key: 'expiresAt',
      displayName: 'Expires At',
      sortable: true,
      searchable: false,
      width: '15%',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
    },
    {
      key: 'createdAt',
      displayName: 'Created At',
      sortable: true,
      searchable: false,
      width: '15%',
      render: (value) => new Date(value).toLocaleDateString()
    }
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gift Cards</h2>
        <Button 
          onClick={handleShowModal} 
          style={{ backgroundColor: '#206a5d', borderColor: '#206a5d' }}
        >
          + Add Gift Card
        </Button>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <EnhancedTable
        data={giftCards}
        columns={columns}
        loading={loading}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        emptyMessage="No gift cards found. Create your first gift card to get started!"
        emptyIcon={<FaGift size={100} className="text-muted" />}
      />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Gift Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateGiftCard}>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={form.code}
                onChange={handleFormChange}
                required
                placeholder="Enter gift card code"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleFormChange}
                required
                min="0.01"
                step="0.01"
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expires At</Form.Label>
              <Form.Control
                type="date"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleFormChange}
                placeholder="Select expiration date (optional)"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="success">
                Create
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}; 