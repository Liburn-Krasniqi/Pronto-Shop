import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { apiClient } from '../../../../api/client';
import { useCartStore } from '../../../../stores/cartStore';
import { toast } from 'react-toastify';

interface Product {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string;
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
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
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('http://localhost:3333/product', {
          method: 'GET',
        });
        const data = await response.json() as Record<string, ApiProduct>;
        
        // Find the product with matching id
        const productData = Object.values(data).find((item) => item.id === id);
        
        if (!productData) {
          throw new Error('Product not found');
        }

        const formattedProduct: Product = {
          id: productData.id,
          Name: productData.name,
          Description: productData.description,
          Image_URLs: Array.isArray(productData.imageURL) 
            ? `http://localhost:3333${productData.imageURL[0]}` 
            : `http://localhost:3333${productData.imageURL}`,
          Type: productData.subcategory[0]?.name,
          Price: Number(productData.price) || 0,
          Discount_Price: Number(productData.discountPrice) || 0,
          Quantity: productData.Inventory?.stockQuantity || 0
        };
        
        setProduct(formattedProduct);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.Name,
      price: product.Discount_Price || product.Price,
      image: product.Image_URLs
    });

    toast.success('Product added to cart!');
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
        <Col md={6}>
          <div>
            <Card.Img
              src={product.Image_URLs}
              alt={product.Name}
              style={{
                width: '100%',
                maxWidth: '600px',
                height: '600px',
                display: 'block',
                margin: '0 auto'
              }}
            />
          </div>
        </Col>
        <Col md={6}>
          <div className="d-flex flex-column h-100">
            <h1 className="mb-4">{product.Name}</h1>
            <div className="mb-4">
              {product.Discount_Price ? (
                <div>
                  <span className="text-decoration-line-through text-muted me-2 fs-4">
                    ${product.Price.toFixed(2)}
                  </span>
                  <span className="text-danger fw-bold fs-3">
                    ${product.Discount_Price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="fw-bold fs-3">${product.Price.toFixed(2)}</span>
              )}
            </div>
            <p className="mb-4">{product.Description}</p>
            <div className="mb-4">
              <p className="mb-2">
                <strong>Category:</strong> {product.Type || 'Uncategorized'}
              </p>
              <p className="mb-2">
                <strong>Availability:</strong>{' '}
                {product.Quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
              {product.Quantity > 0 && (
                <p className="mb-2">
                  <strong>Quantity Available:</strong> {product.Quantity}
                </p>
              )}
            </div>
            <div className="mt-auto">
              <Button
                size="lg"
                className="w-100 background-1 color-white border-0"
                disabled={product.Quantity === 0}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
} 