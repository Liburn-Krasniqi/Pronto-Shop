import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import classes from "../layout/MainNavigation/MainNavigation.module.css";
//duhet me e bo nryshe qet punen e qiti css importi, amo pe lo qishtu niher -Libi

interface CustomNavDropdownProps {
  title: React.ReactNode;
  items: { to: string; label: string }[];
  className?: string;
}

export const CustomNavDropdown: React.FC<CustomNavDropdownProps> = ({
  title,
  items,
  className,
}) => {
  return (
    <NavDropdown title={title} className={className}>
      {items.map(({ to, label }, index) => (
        <NavDropdown.Item key={index} as="div" className="text-decoration-none">
          {/* using the NavDropdown.item as a div to avoid a hydration error, bc div doesnt use <a> internally */}
          <NavLink to={to} className={classes.navLinkNoUnderline}>
            {label}
          </NavLink>
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
