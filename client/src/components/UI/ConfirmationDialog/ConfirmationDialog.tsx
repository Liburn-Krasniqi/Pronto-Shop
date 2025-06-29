import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import classes from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'success'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button 
          variant={variant} 
          onClick={handleConfirm}
          style={{ backgroundColor: '#206a5d', borderColor: '#206a5d' }}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 