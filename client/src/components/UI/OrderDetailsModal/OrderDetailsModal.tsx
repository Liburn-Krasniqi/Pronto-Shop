import React from 'react';
import { Modal, Button, Badge, Row, Col, Card } from 'react-bootstrap';
import { X, Package, Truck, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from 'docx';
import './OrderDetailsModal.css';

interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageURL?: string[];
  };
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress?: string;
  paymentIntentId?: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  show: boolean;
  onHide: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  show,
  onHide
}) => {
  const navigate = useNavigate();
  
  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="status-icon completed" />;
      case 'pending':
        return <Clock className="status-icon pending" />;
      case 'processing':
        return <Package className="status-icon processing" />;
      case 'shipped':
        return <Truck className="status-icon shipped" />;
      case 'cancelled':
        return <AlertCircle className="status-icon cancelled" />;
      default:
        return <Clock className="status-icon" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const parseShippingAddress = (addressString?: string) => {
    if (!addressString) return null;
    try {
      return JSON.parse(addressString);
    } catch {
      return null;
    }
  };

  const shippingAddress = parseShippingAddress(order.shippingAddress);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    onHide(); // Close the modal after navigation
  };

  const generateInvoiceWord = async () => {
    // Create table rows for items
    const itemRows = order.items.map(item => 
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: item.product.name })],
            width: { size: 40, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: item.quantity.toString() })],
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: formatCurrency(item.price) })],
            width: { size: 20, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: formatCurrency(item.price * item.quantity) })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      })
    );

    // Create summary rows
    const summaryRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Subtotal:' })],
            width: { size: 75, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: formatCurrency(order.total) })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Shipping:' })],
            width: { size: 75, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Free' })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Tax:' })],
            width: { size: 75, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Included' })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ 
              text: 'Total:',
              children: [new TextRun({ bold: true })]
            })],
            width: { size: 75, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ 
              text: formatCurrency(order.total),
              children: [new TextRun({ bold: true })]
            })],
            width: { size: 25, type: WidthType.PERCENTAGE }
          })
        ]
      })
    ];

    // Create the document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Header
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Pronto Shop',
                size: 32,
                bold: true,
                color: '000000'
              })
            ]
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'INVOICE',
                size: 24,
                bold: true,
                color: '000000'
              })
            ]
          }),

          // Invoice Details
          new Paragraph({
            children: [
              new TextRun({ text: 'Invoice #: ', bold: true }),
              new TextRun({ text: order.id.toString() })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun({ text: formatDate(order.createdAt) })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Status: ', bold: true }),
              new TextRun({ text: order.status.toUpperCase() })
            ],
            spacing: { after: 400 }
          }),

          // Customer Information
          new Paragraph({
            text: 'Bill To:',
            children: [new TextRun({ bold: true })]
          }),
          new Paragraph({
            text: shippingAddress 
              ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
              : 'Customer'
          }),
          ...(shippingAddress ? [
            new Paragraph({ text: shippingAddress.address }),
            new Paragraph({ 
              text: `${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}` 
            }),
            new Paragraph({ text: shippingAddress.country })
          ] : []),
          new Paragraph({ spacing: { after: 400 } }),

          // Items Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: 'Item', children: [new TextRun({ bold: true })] })],
                    width: { size: 40, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Quantity', children: [new TextRun({ bold: true })] })],
                    width: { size: 15, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Unit Price', children: [new TextRun({ bold: true })] })],
                    width: { size: 20, type: WidthType.PERCENTAGE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: 'Total', children: [new TextRun({ bold: true })] })],
                    width: { size: 25, type: WidthType.PERCENTAGE }
                  })
                ]
              }),
              ...itemRows,
              ...summaryRows
            ]
          }),

          // Footer
          new Paragraph({ spacing: { before: 800 } }),
          new Paragraph({
            text: 'Thank you for your purchase!',
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: 'Pronto Shop - Your trusted online marketplace',
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ size: 20 })]
          })
        ]
      }]
    });

    // Generate and download the document
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${order.id}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = async () => {
    try {
      await generateInvoiceWord();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="order-modal-header">
        <Modal.Title>
          <div className="d-flex align-items-center gap-2">
            {getStatusIcon(order.status)}
            <span>Order #{order.id}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="order-modal-body">
        {/* Order Status Section */}
        <Card className="mb-4 status-card">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h6 className="text-muted mb-2">Order Status</h6>
                <div className="d-flex align-items-center gap-2">
                  <Badge bg={getStatusBadgeVariant(order.status)} className="status-badge">
                    {order.status.toUpperCase()}
                  </Badge>
                </div>
              </Col>
              <Col md={6}>
                <h6 className="text-muted mb-2">Order Date</h6>
                <p className="mb-0">{formatDate(order.createdAt)}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Order Items Section */}
        <Card className="mb-4">
          <Card.Header>
            <h6 className="mb-0">Order Items ({order.items.length})</h6>
          </Card.Header>
          <Card.Body>
            {order.items.map((item, index) => (
              <div key={item.id} className={`order-item ${index !== order.items.length - 1 ? 'border-bottom pb-3 mb-3' : ''}`}>
                <Row className="align-items-center">
                  <Col md={2} className="text-center">
                    <div className="product-image-placeholder">
                      {item.product.imageURL && item.product.imageURL.length > 0 ? (
                        <img 
                          src={`http://localhost:3333${item.product.imageURL[0]}`}
                          alt={item.product.name}
                          className="product-image"
                        />
                      ) : (
                        <Package className="placeholder-icon" />
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 
                      className="product-name mb-1 clickable-product"
                      onClick={() => handleProductClick(item.productId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.product.name}
                    </h6>
                    <p className="text-muted mb-0">Quantity: {item.quantity}</p>
                  </Col>
                  <Col md={4} className="text-end">
                    <p className="item-price mb-0">{formatCurrency(item.price * item.quantity)}</p>
                    <small className="text-muted">${item.price.toFixed(2)} each</small>
                  </Col>
                </Row>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Shipping Information */}
        {shippingAddress && (
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Shipping Information</h6>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p className="mb-1"><strong>Name:</strong></p>
                  <p className="text-muted mb-3">
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mb-1"><strong>Phone:</strong></p>
                  <p className="text-muted mb-3">{shippingAddress.phone || 'Not provided'}</p>
                </Col>
              </Row>
              <p className="mb-1"><strong>Address:</strong></p>
              <p className="text-muted mb-0">
                {shippingAddress.address}<br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                {shippingAddress.country}
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="order-summary">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>Included</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="total-amount">{formatCurrency(order.total)}</strong>
                </div>
              </Col>
              <Col md={6} className="text-end">
                {order.paymentIntentId && (
                  <div className="payment-info">
                    <p className="mb-1"><strong>Payment ID:</strong></p>
                    <p className="text-muted small mb-0">{order.paymentIntentId}</p>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      
      <Modal.Footer className="order-modal-footer">
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button 
          variant="success" 
          onClick={handleDownloadInvoice}
          className="d-flex align-items-center gap-2"
        >
          <Download size={16} />
          Download Invoice
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 