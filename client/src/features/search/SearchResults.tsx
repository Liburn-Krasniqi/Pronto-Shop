import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../../components/UI';
import { apiClient } from '../../api/client';

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

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (!searchQuery) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await apiClient.get(`/product?name=${encodeURIComponent(searchQuery)}`);
        const formattedProducts: Product[] = response.map((product: any) => ({
          id: product.id,
          Name: product.name,
          Description: product.description,
          Image_URLs: Array.isArray(product.imageURL) 
            ? `http://localhost:3333${product.imageURL[0]}` 
            : `http://localhost:3333${product.imageURL}`,
          Type: product.subcategory[0]?.name,
          Price: Number(product.price) || 0,
          Discount_Price: Number(product.discountPrice) || 0,
          Quantity: product.Inventory?.stockQuantity || 0,
        }));
        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-5">
        <h3>No products found</h3>
        <p className="text-muted">Try adjusting your search terms</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Search Results</h2>
      <div className="d-flex flex-row flex-wrap justify-content-center">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 