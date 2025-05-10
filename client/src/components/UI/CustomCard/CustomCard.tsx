import classes from "./CustomCard.module.css"; // default styling

interface CustomCardProps {
  children: React.ReactNode; // Assure the children props are react components
  className?: string; // make it possible to pass in classes to custimize the card
}

export function CustomCard({ children, className = "" }: CustomCardProps) {
  return <div className={`${classes.card} ${className}`}>{children}</div>;
}
