import Card from "react-bootstrap/Card";

export function ProductCard() {
  return (
    <Card
      style={{
        width: "25rem",
      }}
      className="shadow-bottom rounded-4 my-2 mx-4 border-0 p-3"
    >
      <Card.Body>
        <Card.Title className="fw-bold my-2">
          New School Year Supplies
        </Card.Title>
        <Card.Img src="./supplies.jpg" className="mt-4 mb-5" />
        <Card.Text className="mt-2">
          Discover more in{" "}
          <Card.Link href="#" className="text-decoration-none color-2">
            Office Supplies
          </Card.Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
