import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";
import { useWishlistStore } from "../../../stores/wishlistStore";
import { toast } from "react-toastify";
import { ShoppingCart, Heart, Star } from "lucide-react";
import styles from "./ProductCard.module.css";

interface Product {
  id: string;
  Name: string;
  Description: string;
  Image_URLs: string;
  Type?: string;
  Price: number;
  Discount_Price: number;
  Quantity: number;
  reviewStats?: {
    averageRating: number;
    totalReviews: number;
  };
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    addItem({
      id: product.id,
      name: product.Name,
      price: product.Discount_Price || product.Price,
      image: product.Image_URLs
    });
    toast.success('Product added to cart!');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the button
    
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

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Math.round(rating) ? "#ffc107" : "none"}
        color="#ffc107"
        style={{ marginRight: 1 }}
      />
    ));
  };

  return (
    <Card
      className={`rounded-4 my-2 mx-4 p-3 shadow-sm ${styles.productCard}`}
      style={{ width: "25rem", cursor: "pointer", background: "transparent", border: "none" , boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)"}}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.Image_URLs}
          alt={product.Name}
          className={styles.productImage}
        />
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.cartButton} ${styles.wishlistButton}`}
            onClick={handleWishlistToggle}
            title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
          >
            <Heart 
              size={18} 
              fill={isInWishlist(product.id) ? "#206a5d" : "none"}
              color={isInWishlist(product.id) ? "#206a5d" : "#206a5d"}
              strokeWidth={isInWishlist(product.id) ? 0 : 2}
            />
          </button>
          <button
            className={styles.cartButton}
            disabled={product.Quantity === 0}
            onClick={handleAddToCart}
            title="Add to Cart"
            style={{
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
            }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
      <Card.Body>
        <Card.Title className="my-2 productName">
          {product.Name}
        </Card.Title>
        
        {/* Star Rating */}
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
                <span className="text-decoration-line-through text-muted me-2 productName">
                  ${product.Price.toFixed(2)}
                </span>
                <span className="text-danger fw-bold productName">
                  ${product.Discount_Price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="fw-bold productName">${product.Price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
