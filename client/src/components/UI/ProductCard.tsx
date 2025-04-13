import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Product = {
  id: number;
  name: string;
  description: string;
  images?: string; // optional, in case your product has an image
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        width: "25rem",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        cursor: "pointer",
      }}
      className="rounded-4 my-2 mx-4 border-0 p-3"
      onClick={() => navigate(`/products/${product.id}`)} // dynamic route
    >
      <Card.Body>
        <Card.Title className="fw-bold my-2">{product.name}</Card.Title>
        <Card.Img
          src={product.images || "./supplies.jpg"}
          className="mt-4 mb-5"
        />
        <Card.Text className="mt-2">
          {product.description}
          <Card.Link href="#" className="text-decoration-none color-2">
            Learn more
          </Card.Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
export default ProductCard;
