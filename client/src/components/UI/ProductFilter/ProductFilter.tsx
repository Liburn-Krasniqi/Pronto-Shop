import React, { useState, useEffect, memo, useRef, useCallback } from 'react';
import styles from './ProductFilter.module.css';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

export interface FilterState {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  vendors: string[];
  rating: number;
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

interface Vendor {
  id: string;
  name: string;
}

// Custom Range Slider Component
const RangeSlider = ({ 
  min, 
  max, 
  values, 
  onChange,
  onDragStart,
  onDragEnd
}: { 
  min: number; 
  max: number; 
  values: number[]; 
  onChange: (values: number[]) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);

  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e: React.MouseEvent, type: 'min' | 'max') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(type);
    onDragStart();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = Math.round((percentage / 100) * (max - min) + min);

    if (isDragging === 'min') {
      const newMin = Math.min(value, values[1] - 1);
      onChange([newMin, values[1]]);
    } else {
      const newMax = Math.max(value, values[0] + 1);
      onChange([values[0], newMax]);
    }
  }, [isDragging, sliderRef, max, min, values, onChange]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(null);
      onDragEnd();
    }
  }, [isDragging, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = Math.round((percentage / 100) * (max - min) + min);

    // Determine which thumb to move based on which is closer
    const minDistance = Math.abs(value - values[0]);
    const maxDistance = Math.abs(value - values[1]);

    if (minDistance < maxDistance) {
      const newMin = Math.min(value, values[1] - 1);
      onChange([newMin, values[1]]);
    } else {
      const newMax = Math.max(value, values[0] + 1);
      onChange([values[0], newMax]);
    }
  };

  return (
    <div className={styles.rangeSliderContainer}>
      <div className={styles.rangeSlider} ref={sliderRef}>
        <div 
          className={styles.rangeTrack}
          onClick={handleTrackClick}
          style={{
            background: `linear-gradient(to right, #e0e0e0 0%, #e0e0e0 ${getPercentage(values[0])}%, #206A5D ${getPercentage(values[0])}%, #206A5D ${getPercentage(values[1])}%, #e0e0e0 ${getPercentage(values[1])}%, #e0e0e0 100%)`
          }}
        />
        <div
          className={`${styles.rangeThumb} ${styles.rangeThumbMin} ${isDragging === 'min' ? styles.dragging : ''}`}
          style={{ left: `${getPercentage(values[0])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
        />
        <div
          className={`${styles.rangeThumb} ${styles.rangeThumbMax} ${isDragging === 'max' ? styles.dragging : ''}`}
          style={{ left: `${getPercentage(values[1])}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
        />
      </div>
      <div className={styles.rangeValues}>
        <span>${values[0]}</span>
        <span>{values[1] === 1000 ? '$1000+' : `$${values[1]}`}</span>
      </div>
    </div>
  );
};

export const ProductFilter = memo(function ProductFilter({ onFilterChange, currentFilters }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(currentFilters?.categories || []);
  const [priceRange, setPriceRange] = useState({ 
    min: currentFilters?.priceRange?.min || 0, 
    max: currentFilters?.priceRange?.max || 1000 
  });
  const [selectedVendors, setSelectedVendors] = useState<string[]>(currentFilters?.vendors || []);
  const [selectedRating, setSelectedRating] = useState<number>(currentFilters?.rating || 0);
  const [priceSliderValues, setPriceSliderValues] = useState([
    currentFilters?.priceRange?.min || 0, 
    currentFilters?.priceRange?.max || 1000
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(
    currentFilters?.priceRange?.min !== 0 || currentFilters?.priceRange?.max !== 1000
  );

  useEffect(() => {
    if (currentFilters) {
      setSelectedSubcategories(currentFilters.categories || []);
      setSelectedVendors(currentFilters.vendors || []);
      setSelectedRating(currentFilters.rating || 0);
      setPriceRange(currentFilters.priceRange || { min: 0, max: 1000 });
      setPriceSliderValues([
        currentFilters.priceRange?.min || 0,
        currentFilters.priceRange?.max || 1000
      ]);
      setIsPriceFilterApplied(
        currentFilters.priceRange?.min !== 0 || currentFilters.priceRange?.max !== 1000
      );
    }
  }, [currentFilters]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // Fetch categories with subcategories
        const categoriesResponse = await fetch('http://localhost:3333/category');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch vendors using public endpoint
        const vendorsResponse = await fetch('http://localhost:3333/vendor/public');
        const vendorsData = await vendorsResponse.json();
        setVendors(vendorsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  const handleSubcategoryChange = (subcategoryId: string) => {
    const newSelectedSubcategories = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];
    
    setSelectedSubcategories(newSelectedSubcategories);
    onFilterChange({
      categories: newSelectedSubcategories, // This will be used as subcategoryIds
      priceRange: {
        min: priceSliderValues[0],
        max: priceSliderValues[1]
      },
      vendors: selectedVendors,
      rating: selectedRating,
    });
  };

  const handleVendorChange = (vendorId: string) => {
    const newSelectedVendors = selectedVendors.includes(vendorId)
      ? selectedVendors.filter(id => id !== vendorId)
      : [...selectedVendors, vendorId];
    
    setSelectedVendors(newSelectedVendors);
    onFilterChange({
      categories: selectedSubcategories,
      priceRange: {
        min: priceSliderValues[0],
        max: priceSliderValues[1]
      },
      vendors: newSelectedVendors,
      rating: selectedRating,
    });
  };

  const handleRatingChange = (rating: number) => {
    const newRating = selectedRating === rating ? 0 : rating; // Toggle off if same rating selected
    setSelectedRating(newRating);
    onFilterChange({
      categories: selectedSubcategories,
      priceRange: {
        min: priceSliderValues[0],
        max: priceSliderValues[1]
      },
      vendors: selectedVendors,
      rating: newRating,
    });
  };

  const handlePriceSliderChange = (values: number[]) => {
    setPriceSliderValues(values);
    setPriceRange({
      min: values[0],
      max: values[1]
    });
    // Reset applied state when slider changes
    setIsPriceFilterApplied(false);
    // Don't call onFilterChange here - wait for Go button
  };

  const handleApplyPriceFilter = () => {
    // Update the priceRange state to match the current slider values
    const currentPriceRange = {
      min: priceSliderValues[0],
      max: priceSliderValues[1]
    };
    
    setPriceRange(currentPriceRange);
    setIsPriceFilterApplied(true);
    
    onFilterChange({
      categories: selectedSubcategories,
      priceRange: currentPriceRange,
      vendors: selectedVendors,
      rating: selectedRating,
    });
  };

  const clearFilters = () => {
    setSelectedSubcategories([]);
    setSelectedVendors([]);
    setSelectedRating(0);
    setPriceRange({ min: 0, max: 1000 });
    setPriceSliderValues([0, 1000]);
    onFilterChange({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      vendors: [],
      rating: 0,
    });
  };

  if (loading) {
    return (
      <div className={styles.filterContainer}>
        <div className={styles.loading}>Loading filters...</div>
      </div>
    );
  }

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <h3 className={styles.filterTitle}>Filters</h3>
      </div>

      <div className={styles.filterContent}>
        {/* Categories Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Categories</h4>
          <div className={styles.checkboxGroup}>
            {categories.map((category) => (
              <div key={category.id} className={styles.categoryGroup}>
                <h5 className={styles.categoryName}>{category.name}</h5>
                {category.subcategories && category.subcategories.map((subcategory) => (
                  <label key={subcategory.id} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onChange={() => handleSubcategoryChange(subcategory.id)}
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxText}>{subcategory.name}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Price Range</h4>
          <RangeSlider
            min={0}
            max={1000}
            values={priceSliderValues}
            onChange={handlePriceSliderChange}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => setIsDragging(false)}
          />
          <button 
            className={styles.applyButton}
            onClick={handleApplyPriceFilter}
            disabled={isDragging}
          >
            {isPriceFilterApplied ? 'Price Filter Applied ✓' : 'Apply Price Filter'}
          </button>
        </div>

        {/* Rating Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Rating</h4>
          <div className={styles.ratingGroup}>
            <div className={styles.singleRatingContainer}>
              <div className={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <span
                    key={starIndex}
                    className={styles.interactiveStar}
                    style={{
                      color: starIndex <= selectedRating ? '#ffc107' : '#e0e0e0',
                      fontSize: '24px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleRatingChange(starIndex)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className={styles.ratingText}>
                {selectedRating > 0 ? `${selectedRating} star${selectedRating !== 1 ? 's' : ''} & up` : 'Select rating'}
              </div>
            </div>
          </div>
        </div>

        {/* Vendors Filter */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>Vendors</h4>
          <div className={styles.checkboxGroup}>
            {vendors.map((vendor) => (
              <label key={vendor.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => handleVendorChange(vendor.id)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>{vendor.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        <button 
          className={styles.clearButton}
          onClick={clearFilters}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}); 