interface NavItemWithIconProps {
  iconSrc: string;
  text?: React.ReactNode;
  className?: string;
}

export const NavItemWithIcon: React.FC<NavItemWithIconProps> = ({
  iconSrc,
  text,
  className,
}) => {
  return (
    <div className={`d-flex align-items-center text-start ${className}`}>
      <img src={iconSrc} alt="icon" className="me-2" />
      {text && <div>{text}</div>}
    </div>
  );
};
