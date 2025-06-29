// features/landing/components/ProductShowcase/ProductShowcase.tsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { ProductCard, ProductFilter, FilterState } from "../../../../components/UI";

interface Product {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string;
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
  categoryId?: string;
  vendorId?: string;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    vendors: [],
    rating: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;

  const fetchProducts = useCallback(async (filterParams?: FilterState) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filterParams?.priceRange) {
        if (filterParams.priceRange.min > 0) {
          params.append('minPrice', filterParams.priceRange.min.toString());
        }
        if (filterParams.priceRange.max < 1000) {
          params.append('maxPrice', filterParams.priceRange.max.toString());
        }
      }
      
      if (filterParams?.vendors && filterParams.vendors.length > 0) {
        filterParams.vendors.forEach(vendorId => {
          params.append('vendorId', vendorId);
        });
      }
      
      if (filterParams?.categories && filterParams.categories.length > 0) {
        filterParams.categories.forEach(categoryId => {
          params.append('subcategoryIds', categoryId);
        });
      }

      // Add rating filter
      if (filterParams?.rating && filterParams.rating > 0) {
        params.append('minRating', filterParams.rating.toString());
      }

      // Add includeReviews parameter to get review statistics
      params.append('includeReviews', 'true');

      const url = `http://localhost:3333/product${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: "GET",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const formattedProducts: Product[] = [];
      for (const key in data) {
        const product: Product = {
          id: data[key].id,
          Name: data[key].name,
          Description: data[key].description,
          Image_URLs: Array.isArray(data[key].imageURL) 
            ? `http://localhost:3333${data[key].imageURL[0]}` 
            : `http://localhost:3333${data[key].imageURL}`,
          Type: data[key].subcategory && data[key].subcategory.length > 0 
            ? data[key].subcategory[0]?.name 
            : undefined,
          Price: Number(data[key].price) || 0,
          Discount_Price: Number(data[key].discountPrice) || 0,
          Quantity: data[key].Inventory?.stockQuantity || 0,
          categoryId: data[key].subcategory && data[key].subcategory.length > 0 
            ? data[key].subcategory[0]?.categoryId 
            : undefined,
          vendorId: data[key].vendorid,
          reviewStats: data[key].reviewStats || { averageRating: 0, totalReviews: 0 },
        };
        formattedProducts.push(product);
      }
      
      setProducts(formattedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Debounce filter changes to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchProducts(filters);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, fetchProducts]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);
  }, [products, currentPage]);

  // Reset to first page when filters change or products change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, products.length]);

  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  return (
    <div className="d-flex flex-column flex-lg-row gap-4 px-3 py-4">
      {/* Filter Sidebar */}
      <div className="d-flex justify-content-center">
        <ProductFilter onFilterChange={handleFilterChange} currentFilters={filters} />
      </div>

      {/* Products Grid */}
      <div className="flex-grow-1">
        {products.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
            <h3 className="text-center mb-3">No Products Found</h3>
            <p className="text-center text-muted">
              No products match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="d-flex flex-row flex-wrap justify-content-center align-items-start gap-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-4 gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem' }}
                >
                  {/* Left Arrow Icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 15L8 10L13 5" stroke="#206a5d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className="btn"
                    style={{
                      minWidth: 36,
                      background: page === currentPage ? '#206a5d' : 'transparent',
                      color: page === currentPage ? 'white' : '#206a5d',
                      border: `2px solid #206a5d`,
                      fontWeight: 600,
                      boxShadow: page === currentPage ? '0 2px 8px rgba(32,106,93,0.08)' : undefined,
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="btn btn-light"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 1rem' }}
                >
                  {/* Right Arrow Icon */}
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 5L12 10L7 15" stroke="#206a5d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
