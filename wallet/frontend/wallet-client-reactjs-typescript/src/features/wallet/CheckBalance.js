import React, { useState } from 'react';
import { checkBalance } from './api';
import Swal from 'sweetalert2';
import './assets/css/CheckBalance.css'; // Asegúrate de crear este archivo para los estilos

const CheckBalance = () => {
    const [formData, setFormData] = useState({
        document: '',
        phone: ''
    });
    const [balance, setBalance] = useState(null);

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
            const response = await checkBalance(formData);
            setBalance(response.data.balance);
            Swal.fire({
                title: 'Balance Retrieved!',
                text: `Your balance is: ${response.data.balance}`,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al consultar el saldo';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="check-balance-container">
            <form onSubmit={handleSubmit} className="check-balance-form">
                <h2>Check Balance</h2>
                <input
                    type="text"
                    name="document"
                    placeholder="Document"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="check-button">Check Balance</button>
                {balance !== null && <p className="balance-info">Your balance is: <strong>{balance}</strong></p>}
            </form>
        </div>
    );
};

export default CheckBalance;