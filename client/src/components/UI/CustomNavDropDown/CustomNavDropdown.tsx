import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import classes from "./CustomNavDropdown.module.css";

interface CustomNavDropdownProps {
  title: React.ReactNode;
  items: { to: string; label: string , onClick?: () => void }[];
  className?: string;
}

export const CustomNavDropdown: React.FC<CustomNavDropdownProps> = ({
  title,
  items,
  className,
}) => {
  return (
    <NavDropdown title={title} className={`${className}`}>
      {items.map(( item, index) => (
        <NavDropdown.Item key={index} as="div" className="text-decoration-none">
          {/* using the NavDropdown.item as a div to avoid a hydration error, bc div doesnt use <a> internally */}
          <NavLink
            to={item.to}
            onClick={() => item.onClick && item.onClick()} // Call the onClick function if it exists
            className={classes.navLinkNoUnderline}
          >
            {item.label}
          </NavLink>
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
