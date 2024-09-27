import React, { useState } from 'react';
import { confirmPayment } from './api';
import PaymentDetailsModal from './PaymentDetailsModal';
import Swal from 'sweetalert2';
import './assets/css/ConfirmPayment.css'; // Asegúrate de crear este archivo para los estilos

const ConfirmPayment = ({ sessionId }) => {
    const [token, setToken] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setToken(e.target.value);
    };

    const handleTokenSubmit = (e) => {
        e.preventDefault();
        if (token) {
            setIsModalOpen(true);
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Por favor ingrese un token válido.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handlePaymentDetailsConfirm = async ({ document, amount }) => {
        try {
            const response = await confirmPayment({ 
                sessionId, 
                token, 
                document, 
                amount 
            });
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            setIsModalOpen(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al confirmar el pago';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="confirm-payment-container">
            <form onSubmit={handleTokenSubmit} className="confirm-payment-form">
                <h2>Confirm Payment</h2>
                <p>Session ID: {sessionId}</p>
                <input
                    type="text"
                    name="token"
                    placeholder="Token"
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="submit-button">Submit Token</button>
            </form>

            <PaymentDetailsModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onConfirm={handlePaymentDetailsConfirm}
            />
        </div>
    );
};

export default ConfirmPayment;