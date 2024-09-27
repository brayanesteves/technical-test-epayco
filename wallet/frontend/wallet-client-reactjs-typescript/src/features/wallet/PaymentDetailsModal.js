import React, { useState } from 'react';
import Modal from 'react-modal';
import './assets/css/PaymentDetailsModal.css'; // Asegúrate de crear este archivo para los estilos

const PaymentDetailsModal = ({ isOpen, onRequestClose, onConfirm }) => {
    const [document, setDocument] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm({ document, amount });
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="payment-modal" overlayClassName="payment-overlay">
            <h2>Enter Payment Details</h2>
            <form onSubmit={handleSubmit} className="payment-form">
                <input
                    type="text"
                    placeholder="Document"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <div className="button-group">
                    <button type="submit" className="confirm-button">Confirm Payment</button>
                    <button type="button" className="cancel-button" onClick={onRequestClose}>Cancel</button>
                </div>
            </form>
        </Modal>
    );
};

export default PaymentDetailsModal;