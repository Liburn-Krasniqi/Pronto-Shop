import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI/button';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'react-toastify';
import './WishlistPage.css';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  type?: string;
}

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    toast.success('Product added to cart!');
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    removeItem(itemId);
    toast.success('Product removed from wishlist!');
  };

  if (items.length === 0) {
    return (
      <div className="container">
        <h1 className="title">My Wishlist</h1>
        <div className="empty-wishlist">
          <Heart className="empty-icon" />
          <h2 className="empty-title">Your wishlist is empty</h2>
          <p className="empty-text">Add some products to your wishlist to see them here</p>
          <Button
            onClick={() => navigate('/product')}
            className="continue-shopping-button"
            variant="ghost"
            style={{ 
              marginTop: '1rem',
              backgroundColor: '#206a5d',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              border: 'none'
            }}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">My Wishlist</h1>
      <div className="wishlist-items">
        {items.map((item: WishlistItem) => (
          <div key={item.id} className="card">
            <div className="card-content">
              {/* Image */}
              <div className="image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="image"
                />
              </div>
              
              {/* Product Info */}
              <div className="product-info">
                <h3 
                  className="product-name"
                  onClick={() => handleProductClick(item.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {item.name}
                </h3>
                <p className="product-description">{item.description}</p>
                {item.type && (
                  <p className="product-type">Category: {item.type}</p>
                )}
              </div>

              {/* Right side controls */}
              <div className="right-controls">
                {/* Price */}
                <p className="product-price">${item.price.toFixed(2)}</p>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  <button
                    className="add-to-cart-button"
                    onClick={() => handleAddToCart(item)}
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 