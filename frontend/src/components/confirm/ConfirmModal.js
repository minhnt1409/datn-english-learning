// ConfirmModal.js
import React from 'react';
import './style.css';

const ConfirmModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmation</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="btn-confirm">Confirm</button>
          <button onClick={onClose} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
