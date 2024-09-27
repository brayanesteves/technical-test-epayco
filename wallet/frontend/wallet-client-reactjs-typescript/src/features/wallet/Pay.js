import React, { useState } from 'react';
import { pay } from './api';
import Swal from 'sweetalert2';
import './assets/css/Pay.css'; // Asegúrate de crear este archivo para los estilos

const Pay = ({ onPaymentInitiated }) => {
    const [formData, setFormData] = useState({
        document: '',
        amount: ''
    });
    const [sessionId, setSessionId] = useState(null);
    const [token, setToken] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await pay(formData);
            // Almacenar el sessionId y mostrar el token
            setSessionId(response.data.sessionId);
            console.log(response.data)
            setToken(response.data.message); // Asumiendo que la respuesta incluye un token
            Swal.fire({
                title: 'Payment Initiated!',
                text: `Token: ${response.data.message}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
            onPaymentInitiated(response.data.sessionId); // Callback para pasar sessionId si es necesario
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || 'Error al iniciar el pago';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="pay-container">
            <form onSubmit={handleSubmit} className="pay-form">
                <h2>Pay</h2>
                <input
                    type="text"
                    name="document"
                    placeholder="Document"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="pay-button">Pay</button>
                {sessionId && (
                    <div className="session-info">
                        <p><strong>Session ID:</strong> {sessionId}</p>
                        <p><strong>Token:</strong> {token}</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Pay;