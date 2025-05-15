import React, { useEffect } from "react";
import classes from "./CustomModal.module.css";

interface CustomModalProps {
  onClose?: () => void;
  children: React.ReactNode;
}

export function CustomModal(props: CustomModalProps) {
  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  useEffect(() => {
    const handleBackdropClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains(classes.overlay)) {
        handleClose();
      }
    };

    document.addEventListener("click", handleBackdropClick);

    return () => {
      document.removeEventListener("click", handleBackdropClick);
    };
  }, [handleClose]);

  return (
    <div className={classes.overlay}>
      <div className={`mx-5 ${classes.overlay_content}`}>
        <button
          className={`btn btn-danger mx-auto ${classes.close_btn}`}
          onClick={handleClose}
        >
          Close
        </button>
        {props.children}
      </div>
    </div>
  );
}
