import { useEffect, useState } from "react";
import { ProductCard } from "../../../../components/UI";

type Product = {
  id: number;
  name: string;
  description: string;
  images?: string;
};

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    const url = "http://localhost:3333/products";
    console.log("Fetching from:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);
  return (
    <section className="d-flex flex-row flex-wrap px-3 justify-content-center align-items-center mt-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
