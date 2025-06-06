// features/landing/components/ProductShowcase/ProductShowcase.tsx
import { useState, useEffect } from "react";
import { ProductCard } from "../../../../components/UI";

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

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3333/product", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data: any) => {
        const formattedProducts: Product[] = [];
        for (const key in data) {
          const product: Product = {
            id: data[key].id,
            Name: data[key].name,
            Description: data[key].description,
            Image_URLs: Array.isArray(data[key].imageURL) 
              ? `http://localhost:3333${data[key].imageURL[0]}` 
              : `http://localhost:3333${data[key].imageURL}`,
            Type: data[key].subcategory[0]?.name,
            Price: Number(data[key].price) || 0,
            Discount_Price: Number(data[key].discountPrice) || 0,
            Quantity: data[key].Inventory.stockQuantity,
          };
          formattedProducts.push(product);
        }
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-50 py-5">
        <h3 className="text-center mb-3">No Products Available</h3>
        <p className="text-center text-muted">
          We couldn't find any products at the moment. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <section className="d-flex flex-row flex-wrap px-3 justify-content-center align-items-center mt-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
