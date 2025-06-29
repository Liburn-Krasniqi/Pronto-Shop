import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { useCartStore } from '../../../../stores/cartStore';
import { useWishlistStore } from '../../../../stores/wishlistStore';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Plus, Minus, Tag, Layers, CheckCircle, XCircle, Package, Heart, Star, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';
import { ProductCard } from '../../../../components/UI/ProductCard';

interface Product {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string[];
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
  subcategoryId?: number;
  Vendor?: {
    id: number;
    businessName: string;
    name: string;
    profilePicture?: string;
  };
}

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  imageURL: string | string[];
  subcategory: Array<{ id: number; name: string }>;
  price: number;
  discountPrice?: number;
  Inventory?: {
    stockQuantity: number;
  };
  Vendor?: {
    id: number;
    businessName: string;
    name: string;
    profilePicture?: string;
  };
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

interface RecommendedProduct {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string;
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const THUMBNAIL_VISIBLE_COUNT = 6;
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState<boolean>(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const { isAuthenticated, userData } = useAuth();
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3333/product/${id}`, {
          method: 'GET',
        });
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const productData = await response.json() as ApiProduct;
        
        // Handle both single string and array of strings for imageURL
        const imageUrls = Array.isArray(productData.imageURL) 
          ? productData.imageURL.map(url => `http://localhost:3333${url}`)
          : [`http://localhost:3333${productData.imageURL}`];

        const formattedProduct: Product = {
          id: productData.id,
          Name: productData.name,
          Description: productData.description,
          Image_URLs: imageUrls,
          Type: productData.subcategory[0]?.name,
          Price: Number(productData.price) || 0,
          Discount_Price: Number(productData.discountPrice) || 0,
          Quantity: productData.Inventory?.stockQuantity || 0,
          subcategoryId: productData.subcategory[0]?.id,
          Vendor: productData.Vendor
        };
        
        setProduct(formattedProduct);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    // Ensure the selected image is always visible in the thumbnail list
    if (product && product.Image_URLs.length > THUMBNAIL_VISIBLE_COUNT) {
      if (currentImageIndex < thumbStart) {
        setThumbStart(currentImageIndex);
      } else if (currentImageIndex >= thumbStart + THUMBNAIL_VISIBLE_COUNT) {
        setThumbStart(currentImageIndex - THUMBNAIL_VISIBLE_COUNT + 1);
      }
    }
  }, [currentImageIndex, product]);

  useEffect(() => {
    setQuantity(1); // Reset quantity when product changes
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    setReviewLoading(true);
    fetch(`http://localhost:3333/reviews?productId=${id}`)
      .then(res => res.json())
      .then(data => {
        setReviews(data);
        setReviewLoading(false);
      })
      .catch(err => {
        setReviewError('Failed to load reviews');
        setReviewLoading(false);
      });
  }, [id, submitSuccess]);

  // Calculate average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Star breakdown for summary
  const starCounts = [1, 2, 3, 4, 5].map(star => reviews.filter(r => r.rating === star).length);
  const totalReviews = reviews.length;

  // Sort reviews by createdAt descending
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const showAll = sortedReviews.length > 5;
  const reviewsToShow = showAll ? sortedReviews.slice(0, 5) : sortedReviews;

  // Find if the current user has already reviewed this product
  const userReview = isAuthenticated && userData ? reviews.find(r => Number(r.userId) === Number(userData.id)) : undefined;

  // Calculate dynamic percentages for recommendation, value, and quality based on average rating
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const recommendPercent = Math.round((avgRating / 5) * 100);
  const valuePercent = recommendPercent;
  const qualityPercent = recommendPercent;

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product || !product.Type) return;
      
      setRecommendedLoading(true);
      try {
        // Get subcategory ID from the current product's subcategory
        const subcategoryId = product.subcategoryId;
        
        if (!subcategoryId) {
          setRecommendedLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3333/product?subcategoryIds=${subcategoryId}&limit=8`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch recommended products');
        }
        
        const data = await response.json();
        
        // Filter out the current product and format the data
        const formattedProducts: RecommendedProduct[] = Object.values(data)
          .filter((item: any) => item.id !== id) // Exclude current product
          .slice(0, 6) // Limit to 3 products
          .map((item: any) => ({
            id: item.id,
            Name: item.name,
            Description: item.description,
            Image_URLs: Array.isArray(item.imageURL) 
              ? `http://localhost:3333${item.imageURL[0]}` 
              : `http://localhost:3333${item.imageURL}`,
            Type: item.subcategory && item.subcategory.length > 0 
              ? item.subcategory[0]?.name 
              : undefined,
            Price: Number(item.price) || 0,
            Discount_Price: Number(item.discountPrice) || 0,
            Quantity: item.Inventory?.stockQuantity || 0
          }));
        
        setRecommendedProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching recommended products:', err);
        setRecommendedProducts([]);
      } finally {
        setRecommendedLoading(false);
      }
    };

    if (product) {
      fetchRecommendedProducts();
    }
  }, [product, id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.Name,
      price: product.Discount_Price || product.Price,
      image: product.Image_URLs[currentImageIndex]
    });

    toast.success('Product added to cart!');
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Product removed from wishlist!');
    } else {
      addToWishlist({
        id: product.id,
        name: product.Name,
        price: product.Discount_Price || product.Price,
        image: product.Image_URLs[currentImageIndex],
        description: product.Description,
        type: product.Type
      });
      toast.success('Product added to wishlist!');
    }
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.Image_URLs.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.Image_URLs.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Submit review handler
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const userId = userData?.id;
      const res = await fetch('http://localhost:3333/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment,
          userId,
          productId: String(id),
        }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      setNewRating(0);
      setNewComment('');
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError('Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div className="text-center text-danger">{error || 'Product not found'}</div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={1} className="d-flex flex-column align-items-center justify-content-center" style={{ minWidth: 80 }}>
          {/* Thumbnails with scroll buttons if needed */}
          {product.Image_URLs.length > THUMBNAIL_VISIBLE_COUNT && (
            <Button
              variant="light"
              size="sm"
              className="mb-2"
              style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setThumbStart(s => Math.max(0, s - 1))}
              disabled={thumbStart === 0}
              aria-label="Scroll thumbnails up"
            >
              <ChevronLeft style={{ transform: 'rotate(90deg)' }} size={18} />
            </Button>
          )}
          {(product.Image_URLs.length > 0 ? product.Image_URLs.slice(thumbStart, thumbStart + THUMBNAIL_VISIBLE_COUNT) : []).map((img, idx) => {
            const realIdx = thumbStart + idx;
            return (
              <div
                key={realIdx}
                onClick={() => goToImage(realIdx)}
                style={{
                  border: realIdx === currentImageIndex ? '2px solid #222' : '2px solid transparent',
                  borderRadius: '20px',
                  marginBottom: '16px',
                  padding: '2px',
                  cursor: 'pointer',
                  boxShadow: realIdx === currentImageIndex ? '0 0 0 2px #0002' : 'none',
                  background: '#fff',
                  width: '70px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${realIdx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                  }}
                />
              </div>
            );
          })}
          {product.Image_URLs.length > THUMBNAIL_VISIBLE_COUNT && (
            <Button
              variant="light"
              size="sm"
              className="mt-2"
              style={{ borderRadius: '50%', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setThumbStart(s => Math.min(product.Image_URLs.length - THUMBNAIL_VISIBLE_COUNT, s + 1))}
              disabled={thumbStart >= product.Image_URLs.length - THUMBNAIL_VISIBLE_COUNT}
              aria-label="Scroll thumbnails down"
            >
              <ChevronLeft style={{ transform: 'rotate(-90deg)' }} size={18} />
            </Button>
          )}
        </Col>
        <Col md={6}>
          <div className="position-relative">
            <div className="position-relative">
              <Card.Img
                src={product.Image_URLs[currentImageIndex]}
                alt={`${product.Name} - Image ${currentImageIndex + 1}`}
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: '600px',
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'cover',
                  borderRadius: '24px'
                }}
              />
              {/* Navigation buttons - only show if there are multiple images */}
              {product.Image_URLs.length > 1 && (
                <>
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-50 start-0 translate-middle-y ms-2"
                    onClick={previousImage}
                    style={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={nextImage}
                    style={{
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <ChevronRight size={20} />
                  </Button>
                </>
              )}
            </div>
          </div>
        </Col>
        <Col md={5}>
          <div className="d-flex flex-column h-100">
            {/* Unified Info Card */}
            <div className="mb-4 p-4 rounded-4" style={{ background: '#fff', border: '2px solid #e5e7eb', boxShadow: '0 2px 12px #0001' }}>
              {/* Vendor Information */}
              {(() => {
                const vendor = product.Vendor;
                return vendor && vendor.id ? (
                  <div className="mb-3 d-flex align-items-center">
                    <button
                      className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
                      style={{ color: '#206a5d', fontWeight: 600 }}
                      onClick={() => navigate(`/store/${vendor.id}`)}
                    >
                      {vendor.profilePicture ? (
                        <img 
                          src={`http://localhost:3333${vendor.profilePicture}`}
                          alt={`${vendor.businessName} profile`}
                          className="rounded-circle me-2"
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            border: '2px solid #e5e7eb'
                          }}
                        />
                      ) : (
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#206a5d',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            border: '2px solid #e5e7eb'
                          }}
                        >
                          {vendor.businessName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{vendor.businessName}</span>
                    </button>
                  </div>
                ) : null;
              })()}
              {/* Product Name */}
              <h1 className="fw-bold mb-2" style={{ fontSize: '2.2rem', letterSpacing: '-1px' }}>{product.Name}</h1>
              {/* Price Block */}
              <div className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {product.Discount_Price ? (
                  <>
                    <span className="text-decoration-line-through text-muted me-2 fs-4">
                      ${product.Price.toFixed(2)}
                    </span>
                    <span className="text-danger fw-bold fs-2" style={{ letterSpacing: '-1px' }}>
                      ${product.Discount_Price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="fw-bold fs-2" style={{ color: '#206a5d', letterSpacing: '-1px' }}>${product.Price.toFixed(2)}</span>
                )}
              </div>
              {/* Divider */}
              <hr style={{ margin: '0 0 1.5rem 0', borderTop: '1.5px solid #e5e7eb' }} />
              {/* Description */}
              <p className="mb-4 text-secondary" style={{ fontSize: '1.1rem' }}>{product.Description}</p>
              {/* Info Block */}
              <div className="mb-0 p-3 rounded-4" style={{ background: '#f4f4f7', boxShadow: '0 1px 4px #0001' }}>
                <div className="d-flex align-items-center mb-2">
                  <Tag size={18} className="me-2 text-primary" />
                  <span><strong>Category:</strong> {product.Type || <span className="text-muted">Uncategorized</span>}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  {product.Quantity > 0 ? (
                    <CheckCircle size={18} className="me-2 text-success" />
                  ) : (
                    <XCircle size={18} className="me-2 text-danger" />
                  )}
                  <span><strong>Availability:</strong> {product.Quantity > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Package size={18} className="me-2 text-warning" />
                  <span><strong>Quantity Available:</strong> {product.Quantity}</span>
                </div>
              </div>
            </div>
            
            {/* Quantity selector */}
            {product.Quantity > 0 && (
              <div className="d-flex align-items-center justify-content-between mb-3" style={{ maxWidth: 150, background: '#fff', border: '2px solid #e5e7eb', borderRadius: '32px', padding: '0 0.5rem', boxShadow: '0 2px 12px #0001' }}>
                <button
                  className="quantity-button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  type="button"
                >
                  -
                </button>
                <span className="quantity-text">{quantity}</span>
                <button
                  className="quantity-button"
                  onClick={() => setQuantity(q => Math.min(product.Quantity, q + 1))}
                  disabled={quantity >= product.Quantity}
                  aria-label="Increase quantity"
                  type="button"
                >
                  +
                </button>
              </div>
            )}
            
            {/* Spacer to push buttons to bottom */}
            <div className="flex-grow-1"></div>
            
            {/* Buttons Container - Fixed at bottom */}
            <div className="mt-auto">
              {/* Wishlist Button */}
              <div className="mb-2">
                <Button
                  variant={isInWishlist(product.id) ? "outline-success" : "outline-success"}
                  className="w-100"
                  style={{ 
                    borderRadius: '32px',
                    borderColor: '#206a5d',
                    color: isInWishlist(product.id) ? 'white' : '#206a5d',
                    backgroundColor: isInWishlist(product.id) ? '#206a5d' : 'transparent',
                    height: '48px',
                    fontSize: '1rem'
                  }}
                  onClick={handleWishlistToggle}
                >
                  <Heart 
                    size={20} 
                    className="me-2" 
                    fill={isInWishlist(product.id) ? "white" : "none"}
                    color={isInWishlist(product.id) ? "white" : "#206a5d"}
                  />
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              </div>
              
              {/* Add to Cart Button */}
              <div>
                <Button
                  size="lg"
                  className="w-100 background-1 color-white border-0"
                  style={{ 
                    borderRadius: '32px',
                    height: '48px',
                    fontSize: '1rem'
                  }}
                  disabled={product.Quantity === 0}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recommended Items Section */}
      {recommendedProducts.length > 0 && (
        <Row className="mt-5">
          <Col>
            <div className="mb-4">
              <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1rem', color: '#111' }}>
                Recommended for You
              </h2>
              <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2rem' }}>
                More products you might like from the same category
              </p>
            </div>
            
            {recommendedLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div 
                className="recommended-products-scroll" 
                style={{ 
                  overflowX: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  paddingBottom: '1rem'
                }}
              >
                {recommendedProducts.map((recommendedProduct) => (
                  <div key={recommendedProduct.id} style={{ width: '250px', flexShrink: 0 }}>
                    <Card
                      className="rounded-4 p-2"
                      style={{ 
                        width: "100%", 
                        cursor: "pointer", 
                        background: "transparent", 
                        border: "none", 
                        boxShadow: "none"
                      }}
                      onClick={() => navigate(`/product/${recommendedProduct.id}`)}
                    >
                      <div style={{ position: 'relative' }}>
                        <img
                          src={recommendedProduct.Image_URLs}
                          alt={recommendedProduct.Name}
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '12px'
                          }}
                        />
                        <div style={{ 
                          position: 'absolute', 
                          top: '8px', 
                          right: '8px', 
                          display: 'flex', 
                          gap: '4px' 
                        }}>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isInWishlist(recommendedProduct.id)) {
                                removeFromWishlist(recommendedProduct.id);
                                toast.success('Product removed from wishlist!');
                              } else {
                                addToWishlist({
                                  id: recommendedProduct.id,
                                  name: recommendedProduct.Name,
                                  price: recommendedProduct.Discount_Price || recommendedProduct.Price,
                                  image: recommendedProduct.Image_URLs,
                                  description: recommendedProduct.Description,
                                  type: recommendedProduct.Type
                                });
                                toast.success('Product added to wishlist!');
                              }
                            }}
                          >
                            <Heart 
                              size={16} 
                              fill={isInWishlist(recommendedProduct.id) ? "#206a5d" : "none"}
                              color="#206a5d"
                            />
                          </button>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.9)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            disabled={recommendedProduct.Quantity === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              addItem({
                                id: recommendedProduct.id,
                                name: recommendedProduct.Name,
                                price: recommendedProduct.Discount_Price || recommendedProduct.Price,
                                image: recommendedProduct.Image_URLs
                              });
                              toast.success('Product added to cart!');
                            }}
                          >
                            <ShoppingCart size={16} />
                          </button>
                        </div>
                      </div>
                      <Card.Body className="p-2">
                        <Card.Title className="mb-1" style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.2 }}>
                          {recommendedProduct.Name}
                        </Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            {recommendedProduct.Discount_Price ? (
                              <>
                                <span className="text-decoration-line-through text-muted me-1" style={{ fontSize: '0.8rem' }}>
                                  ${recommendedProduct.Price.toFixed(2)}
                                </span>
                                <span className="text-danger fw-bold" style={{ fontSize: '0.9rem' }}>
                                  ${recommendedProduct.Discount_Price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="fw-bold" style={{ fontSize: '0.9rem' }}>${recommendedProduct.Price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </Col>
        </Row>
      )}

      {/* Ratings and Reviews Section */}
      <Row className="mt-5">
        <Col>
          <div style={{ textAlign: 'left', color: '#111' }}>
            <h2 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: 0 }}>Ratings and Reviews</h2>
            <div className="d-flex align-items-start mt-4 mb-4" style={{ gap: 40 }}>
              {/* Average rating and count */}
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#111', lineHeight: 1 }}>{averageRating || '0.0'}</div>
                <div style={{ color: '#27ae60', fontSize: '1.5rem', fontWeight: 700 }}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={22} fill={i <= Math.round(Number(averageRating)) ? '#27ae60' : 'none'} color="#27ae60" style={{ marginRight: 2 }} />
                  ))}
                </div>
                <div style={{ color: '#111', fontWeight: 500, fontSize: '1.1rem', marginTop: 4 }}>{totalReviews} product rating{totalReviews !== 1 ? 's' : ''}</div>
              </div>
              {/* Star breakdown */}
              <div style={{ minWidth: 180 }}>
                {[5,4,3,2,1].map((star, idx) => (
                  <div key={star} className="d-flex align-items-center mb-1" style={{ fontSize: '1rem' }}>
                    <span style={{ width: 24, color: '#27ae60', fontWeight: 700 }}>{star}</span>
                    <Star size={18} fill={'#27ae60'} color="#27ae60" style={{ marginRight: 4 }} />
                    <div style={{ background: '#eaeaea', borderRadius: 8, flex: 1, height: 10, margin: '0 8px', position: 'relative' }}>
                      <div style={{ background: '#27ae60', borderRadius: 8, height: 10, width: `${totalReviews ? (starCounts[star-1] / totalReviews) * 100 : 0}%` }}></div>
                    </div>
                    <span style={{ minWidth: 24, color: '#111', fontWeight: 500 }}>{starCounts[star-1]}</span>
                  </div>
                ))}
              </div>
              {/* Recommendation/Value/Quality - dynamic */}
              {avgRating > 0 && (
                <>
                  <div className="d-flex flex-column align-items-center" style={{ minWidth: 120 }}>
                    <div style={{ border: '2px solid #27ae60', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#111' }}>{recommendPercent}%</div>
                    <div style={{ fontSize: '1rem', color: '#111', marginTop: 8 }}>Would recommend</div>
                  </div>
                  <div className="d-flex flex-column align-items-center" style={{ minWidth: 120 }}>
                    <div style={{ border: '2px solid #27ae60', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#111' }}>{valuePercent}%</div>
                    <div style={{ fontSize: '1rem', color: '#111', marginTop: 8 }}>Good value</div>
                  </div>
                  <div className="d-flex flex-column align-items-center" style={{ minWidth: 120 }}>
                    <div style={{ border: '2px solid #27ae60', borderRadius: '50%', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.3rem', color: '#111' }}>{qualityPercent}%</div>
                    <div style={{ fontSize: '1rem', color: '#111', marginTop: 8 }}>Good quality</div>
                  </div>
                </>
              )}
            </div>
            <hr style={{ margin: '24px 0 16px 0', borderTop: '1.5px solid #e5e7eb' }} />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>Most relevant reviews</h4>
              {showAll && (
                <span
                  style={{ color: '#27ae60', fontWeight: 500, fontSize: '1rem', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${id}/reviews`)}
                >
                  See all {totalReviews} reviews
                </span>
              )}
            </div>
            {/* Review List */}
            <div>
              {reviewLoading ? (
                <div>Loading reviews...</div>
              ) : reviewError ? (
                <div className="text-danger">{reviewError}</div>
              ) : (
                <>
                  {reviewsToShow.length === 0 ? (
                    <div>No reviews yet. Be the first to review!</div>
                  ) : (
                    reviewsToShow.map(r => (
                      <div key={r.id} className="mb-4 pb-3" style={{ borderBottom: '1px solid #eee', display: 'flex', alignItems: 'flex-start', gap: 32 }}>
                        {/* Left column: stars, user, date */}
                        <div style={{ minWidth: 160, textAlign: 'left' }}>
                          <div style={{ marginBottom: 4 }}>
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} size={18} fill={i <= r.rating ? '#27ae60' : 'none'} color="#27ae60" />
                            ))}
                          </div>
                          <div style={{ color: '#888', fontSize: '1rem', marginBottom: 2 }}>
                            by {(r.user && (r.user.firstName || r.user.lastName)) ? `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() : 'Anonymous'}
                          </div>
                          <div style={{ color: '#888', fontSize: '0.95rem' }}>{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
                        </div>
                        {/* Right column: title and body */}
                        <div style={{ flex: 1, textAlign: 'left' }}>
                          <div style={{ fontWeight: 700, fontSize: '1.25rem', color: '#111', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {r.comment.split(' ').slice(0, 8).join(' ')}{r.comment.split(' ').length > 8 ? ' ...' : ''}
                          </div>
                          <div style={{ color: '#111', fontSize: '1rem' }}>{r.comment}</div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
            {/* Review Form */}
            <div className="mb-4 p-4 rounded" style={{ background: '#fff', border: '1px solid #e5e7eb', maxWidth: 600 }}>
              {isAuthenticated ? (
                userReview ? (
                  <div style={{ color: '#27ae60', fontWeight: 600 }}>
                    You have already reviewed this product.
                  </div>
                ) : (
                  <>
                    <h5 className="mb-3" style={{ color: '#111', fontWeight: 700 }}>Write a Review</h5>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-2 d-flex align-items-center">
                        <span className="me-2">Your Rating:</span>
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ cursor: 'pointer' }} onClick={() => setNewRating(i)}>
                            <Star size={24} fill={i <= newRating ? '#27ae60' : 'none'} color="#27ae60" />
                          </span>
                        ))}
                      </div>
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          rows={3}
                          placeholder="Write your review here..."
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          required
                        />
                      </div>
                      {submitError && <div className="text-danger mb-2">{submitError}</div>}
                      {submitSuccess && <div className="text-success mb-2">Review submitted!</div>}
                      <Button type="submit" disabled={submitting || newRating === 0 || newComment.length === 0} style={{ background: '#27ae60', borderColor: '#27ae60' }}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                      </Button>
                    </form>
                  </>
                )
              ) : (
                <div style={{ color: '#111', fontWeight: 500 }}>
                  Please <a href="/login" style={{ color: '#27ae60', textDecoration: 'underline' }}>log in</a> to write a review.
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
} 