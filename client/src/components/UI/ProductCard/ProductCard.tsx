import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../stores/cartStore";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";
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
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

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

  return (
    <Card
      className={`rounded-4 my-2 mx-4 p-3 ${styles.productCard}`}
      style={{ width: "25rem", cursor: "pointer", background: "transparent", border: "none" , boxShadow: "none"}}
      onClick={handleClick}
    >
      <div className={styles.imageContainer}>
        <img
          src={product.Image_URLs}
          alt={product.Name}
          className={styles.productImage}
        />
        <button
          className={styles.cartButton}
          disabled={product.Quantity === 0}
          onClick={handleAddToCart}
          title="Add to Cart"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
      <Card.Body>
        <Card.Title className="fw-bold my-2 productName">
          {product.Name}
        </Card.Title>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div>
            {product.Discount_Price ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  ${product.Price.toFixed(2)}
                </span>
                <span className="text-danger fw-bold">
                  ${product.Discount_Price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="fw-bold">${product.Price.toFixed(2)}</span>
            )}
          </div>
          <Card.Text className="mt-2 mb-0">
            <span className="text-decoration-none color-2">
              {product.Type || "View Details"}
            </span>
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
