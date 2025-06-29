// features/landing/components/LandingPage/LandingPage.tsx
import { ProductShowcase } from "../ProductShowcase";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="landing-page">
      <div
        className="hero-section"
        style={{
          background: 'linear-gradient(135deg, #206a5d 0%, #81b214 100%)',
          borderRadius: '25px',
          minHeight: '320px',
          display: 'flex',
          alignItems: 'center',
          padding: '2.5rem',
          margin: '0 1rem 2rem 1rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 500, color: 'white', zIndex: 2 }}>
          <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.1 }}>
            Quality meets savings with refurbished!
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Create your dream home on a budget with trusted brands.
          </p>
        </div>
      </div>
      <ProductShowcase />
      {/* Other sections will go here */}
    </main>
  );
}
