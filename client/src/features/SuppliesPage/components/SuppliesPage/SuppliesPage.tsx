import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cartService } from "../../../../services/CartService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// ...imports stay the same

export function SuppliesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3333/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading...</div>;

  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : "https://thumbs.dreamstime.com/b/vibrant-stationery-wooden-desk-high-angle-close-up-shot-colorful-items-arranged-include-notebooks-colored-pencils-351719719.jpg";

  return (
    <>
      <main>
        <div className="product-container">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-price">${product.price}</div>
          </div>

          <div className="product-content">
            <div className="product-image-container">
              <img
                src={productImage}
                alt={product.name}
                className="product-image"
              />
            </div>

            <div className="product-details">
              <p className="product-description">{product.description}</p>

              <div className="product-features">
                <h3 className="feature-title">What's Included:</h3>
                <ul className="feature-list">
                  <li>No feature list provided.</li>
                </ul>
              </div>

              <button
                className="add-to-cart"
                onClick={() => {
                  cartService.addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: productImage,
                  });
                  toast.success("Added product to cart");
                  navigate("/cart");
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer position="bottom-right" />
    </>
  );
}

