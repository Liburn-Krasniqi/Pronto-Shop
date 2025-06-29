import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Mail, MapPin, ShoppingCart, Heart, Star } from 'lucide-react';
import { ProductCard } from '../../../../components/UI';
import { useCartStore } from '../../../../stores/cartStore';
import { useWishlistStore } from '../../../../stores/wishlistStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Vendor {
  id: number;
  email: string;
  businessName: string;
  name: string;
  phone_number: string;
  profilePicture?: string;
  addresses?: {
    id: number;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface VendorProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageURL: string | string[];
  subcategory: Array<{ id: number; name: string }>;
  Inventory?: {
    stockQuantity: number;
  };
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

export function PublicVendorPage() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`http://localhost:3333/vendor/public/${id}`);
        
        if (!response.ok) {
          throw new Error('Vendor not found');
        }
        
        const vendorData = await response.json();
        setVendor(vendorData);
      } catch (err) {
        setError('Failed to load vendor details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchVendorProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3333/product?vendorId=${id}&limit=20&includeReviews=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch vendor products');
        }
        
        const productsData = await response.json();
        const formattedProducts = Array.isArray(productsData) ? productsData.map((product: any) => ({
          ...product,
          reviewStats: product.reviewStats || { averageRating: 0, totalReviews: 0 }
        })) : [];
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching vendor products:', err);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    if (id) {
      fetchVendor();
      fetchVendorProducts();
    }
  }, [id]);

  const formatAddress = (address: Vendor['addresses']) => {
    if (!address) return 'Address not available';
    return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convert VendorProduct to Product format for ProductCard
  const convertToProductFormat = (vendorProduct: VendorProduct) => ({
    id: vendorProduct.id,
    Name: vendorProduct.name,
    Description: vendorProduct.description,
    Image_URLs: Array.isArray(vendorProduct.imageURL) 
      ? `http://localhost:3333${vendorProduct.imageURL[0]}` 
      : `http://localhost:3333${vendorProduct.imageURL}`,
    Type: vendorProduct.subcategory[0]?.name,
    Price: Number(vendorProduct.price) || 0,
    Discount_Price: Number(vendorProduct.discountPrice) || 0,
    Quantity: vendorProduct.Inventory?.stockQuantity || 0,
    reviewStats: vendorProduct.reviewStats,
  });

  // Custom Product Card for Vendor Page
  const VendorProductCard = ({ product }: { product: any }) => {
    const navigate = useNavigate();
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    const handleClick = () => {
      navigate(`/product/${product.id}`);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      addItem({
        id: product.id,
        name: product.Name,
        price: product.Discount_Price || product.Price,
        image: product.Image_URLs
      });
      toast.success('Product added to cart!');
    };

    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        toast.success('Product removed from wishlist!');
      } else {
        addToWishlist({
          id: product.id,
          name: product.Name,
          price: product.Discount_Price || product.Price,
          image: product.Image_URLs,
          description: product.Description,
          type: product.Type
        });
        toast.success('Product added to wishlist!');
      }
    };

    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={12}
          fill={index < Math.round(rating) ? "#ffc107" : "none"}
          color="#ffc107"
          style={{ marginRight: 1 }}
        />
      ));
    };

    return (
      <Card
        className="rounded-4 shadow-sm h-100"
        style={{ 
          cursor: "pointer", 
          background: "transparent", 
          border: "none",
          boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)"
        }}
        onClick={handleClick}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.25/1',
          overflow: 'hidden',
          borderRadius: '1rem',
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={product.Image_URLs}
            alt={product.Name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              borderRadius: '1rem',
              background: '#f5f5f5'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            zIndex: 2
          }}>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                color: '#206a5d',
                transition: 'box-shadow 0.2s, background 0.2s'
              }}
              onClick={handleWishlistToggle}
              title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart 
                size={16} 
                fill={isInWishlist(product.id) ? "#206a5d" : "none"}
                color="#206a5d"
                strokeWidth={isInWishlist(product.id) ? 0 : 2}
              />
            </button>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                color: '#206a5d',
                transition: 'box-shadow 0.2s, background 0.2s',
                opacity: product.Quantity === 0 ? 0.5 : 1,
                cursor: product.Quantity === 0 ? 'not-allowed' : 'pointer'
              }}
              disabled={product.Quantity === 0}
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
        <Card.Body className="p-3">
          <Card.Title className="my-2" style={{ fontSize: '1rem', fontWeight: '600' }}>
            {product.Name}
          </Card.Title>
          
          {product.reviewStats && product.reviewStats.totalReviews > 0 && (
            <div className="d-flex align-items-center mb-2">
              <div className="d-flex align-items-center">
                {renderStars(product.reviewStats.averageRating)}
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              {product.Discount_Price ? (
                <>
                  <span className="text-decoration-line-through text-muted me-2" style={{ fontSize: '0.9rem' }}>
                    ${product.Price.toFixed(2)}
                  </span>
                  <span className="text-danger fw-bold" style={{ fontSize: '1rem' }}>
                    ${product.Discount_Price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="fw-bold" style={{ fontSize: '1rem' }}>${product.Price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Loading vendor information...</div>
      </Container>
    );
  }

  if (error || !vendor) {
    return (
      <Container className="py-5">
        <div className="text-center text-danger">{error || 'Vendor not found'}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Vendor Header */}
      <Row className="mb-5">
        <Col>
          <div className="text-center mb-4">
            <div className="mb-4">
              {vendor.profilePicture ? (
                <img 
                  src={`http://localhost:3333${vendor.profilePicture}`}
                  alt={`${vendor.businessName} profile`}
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    border: '3px solid #81b214',
                    boxShadow: '0 4px 12px rgba(32, 106, 93, 0.2)'
                  }}
                />
              ) : (
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#206a5d',
                    color: 'white',
                    fontSize: '48px',
                    fontWeight: 'bold',
                    border: '3px solid #81b214',
                    boxShadow: '0 4px 12px rgba(32, 106, 93, 0.2)'
                  }}
                >
                  {vendor.businessName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem', color: '#206a5d' }}>
              {vendor.businessName}
            </h1>
            <p className="text-muted fs-5 mb-4">
              {vendor.name} • Member since {formatDate(vendor.createdAt)}
            </p>
          </div>
        </Col>
      </Row>

      {/* Vendor Information */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm" style={{ border: '2px solid #e5e7eb' }}>
            <Card.Body className="p-4">
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#206a5d' }}>
                      <Mail size={20} className="me-2" style={{ color: '#81b214' }} />
                      Contact Information
                    </h5>
                    <div className="mb-2">
                      <strong style={{ color: '#206a5d' }}>Email:</strong> {vendor.email}
                    </div>
                    <div className="mb-2">
                      <strong style={{ color: '#206a5d' }}>Phone:</strong> {vendor.phone_number}
                    </div>
                    <div className="mb-2">
                      <strong style={{ color: '#206a5d' }}>Contact Person:</strong> {vendor.name}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3" style={{ color: '#206a5d' }}>
                      <MapPin size={20} className="me-2" style={{ color: '#81b214' }} />
                      Address
                    </h5>
                    <p className="text-muted">
                      {formatAddress(vendor.addresses)}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Products Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: '#206a5d' }}>
              Products by {vendor.businessName}
            </h2>
            <Badge style={{ backgroundColor: '#81b214', border: 'none', color: 'white' }} className="fs-6" bg="">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </Badge>
          </div>
        </Col>
      </Row>

      {productsLoading ? (
        <Row>
          <Col>
            <div className="text-center py-5">
              <div className="spinner-border" role="status" style={{ color: '#206a5d' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Col>
        </Row>
      ) : products.length === 0 ? (
        <Row>
          <Col>
            <div className="text-center py-5">
              <p className="text-muted fs-5">No products available from this vendor yet.</p>
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          {products.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} className="mb-4">
              <VendorProductCard product={convertToProductFormat(product)} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
} 