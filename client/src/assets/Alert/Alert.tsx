// Alert.tsx
import React, { useEffect } from "react";
import { MessageType } from "../../types";

interface AlertProps {
  show: boolean;
  type: MessageType;
  onClose?: () => void;
  children: React.ReactNode;
  autoCloseDelay?: number;
  className?: string;
}

export const Alert = ({
  show,
  type = MessageType.INFO,
  onClose,
  children,
  autoCloseDelay = 3000,
  className = "",
}: AlertProps) => {
  useEffect(() => {
    if (show && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoCloseDelay]);

  if (!show) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3 ${className}`}
      style={{
        zIndex: 1080,
        minWidth: "300px",
        maxWidth: "600px",
        transition: "opacity 0.15s ease-in-out",
      }}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      />
    </div>
  );
};
