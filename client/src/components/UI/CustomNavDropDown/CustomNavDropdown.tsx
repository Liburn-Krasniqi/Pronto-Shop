import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import classes from "./CustomNavDropdown.module.css";

interface CustomNavDropdownProps {
  title: React.ReactNode;
  items: { to?: string; label: string; onClick?: () => void }[];
  className?: string;
  style?: React.CSSProperties;
}

export const CustomNavDropdown: React.FC<CustomNavDropdownProps> = ({
  title,
  items,
  className,
  style,
}) => {
  return (
    <NavDropdown title={title} className={`${className}`} style={style}>
      {items.map((item, index) => (
        <NavDropdown.Item key={index} as="div" className="text-decoration-none">
          {item.to ? (
            <NavLink
              to={item.to}
              onClick={() => item.onClick && item.onClick()}
              className={classes.navLinkNoUnderline}
            >
              {item.label}
            </NavLink>
          ) : (
            <button
              onClick={() => item.onClick && item.onClick()}
              className={`${classes.navLinkNoUnderline} btn btn-link p-0 text-start w-100 border-0 bg-transparent`}
              style={{ textDecoration: 'none', color: '#81b214' }}
            >
              {item.label}
            </button>
          )}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};
