// features/landing/components/ProductShowcase/ProductShowcase.tsx
import { ProductCard } from "../../../../components/UI";

export function ProductShowcase() {
  return (
    <section className="d-flex flex-row flex-wrap px-3 justify-content-center align-items-center mt-2">
      {[1, 2, 3].map((item) => (
        <ProductCard key={item} />
      ))}
    </section>
  );
}
