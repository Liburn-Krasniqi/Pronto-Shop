import Form from "react-bootstrap/esm/Form";
import classes from "./SearchBar.module.css";
import InputGroup from "react-bootstrap/esm/InputGroup";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../api/client";

interface Product {
  id: string;
  name: string;
  price: number;
  imageURL: string | string[];
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await apiClient.get(`/product?name=${encodeURIComponent(searchQuery.trim())}`);
        // Transform the response to ensure price is a number
        const formattedResults = response.slice(0, 5).map((product: any) => ({
          id: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          imageURL: product.imageURL
        }));
        setResults(formattedResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className={`w-100 ${classes.search}`} ref={dropdownRef}>
      <form onSubmit={handleSearch}>
        <InputGroup className={`position-relative`}>
          <Form.Control
            type="search"
            className={`rounded-4 ${classes.searchbar}`}
            placeholder="  Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {/* Search Icon on the right */}
          <InputGroup.Text 
            className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 pe-3"
            style={{ cursor: 'pointer' }}
            onClick={handleSearch}
          >
            <img alt="Search Icon" src="/search.svg" />
          </InputGroup.Text>
        </InputGroup>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (searchQuery.trim().length >= 2) && (
        <div className={`${classes.dropdown} shadow-sm`}>
          {loading ? (
            <div className="p-3 text-center">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((product) => (
                <div
                  key={product.id}
                  className={classes.dropdownItem}
                  onClick={() => handleResultClick(product.id)}
                >
                  <div className={classes.imageNameContainer}>
                    <img
                      src={Array.isArray(product.imageURL) 
                        ? `http://localhost:3333${product.imageURL[0]}` 
                        : `http://localhost:3333${product.imageURL}`}
                      alt={product.name}
                      className={classes.dropdownImage}
                    />
                    <div className={classes.dropdownTitle}>{product.name}</div>
                  </div>
                  <div className={classes.dropdownPrice}>{formatPrice(product.price)}</div>
                </div>
              ))}
              <div 
                className={`${classes.dropdownItem} ${classes.viewAll}`}
                onClick={handleSearch}
              >
                View all results
              </div>
            </>
          ) : (
            <div className="p-3 text-center text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
