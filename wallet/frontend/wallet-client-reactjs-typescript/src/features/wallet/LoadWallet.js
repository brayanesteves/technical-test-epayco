import React, { useState } from 'react';
import { loadWallet } from './api';
import Swal from 'sweetalert2';
import './assets/css/LoadWallet.css'; // Asegúrate de crear este archivo para los estilos

const LoadWallet = () => {
    const [formData, setFormData] = useState({
        document: '',
        phone: '',
        amount: ''
    });

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
            const response = await loadWallet(formData);
            Swal.fire({
                title: 'Success!',
                text: "Billetera cargada",
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al cargar la billetera';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="load-wallet-container">
            <h2>Load Wallet</h2>
            <form onSubmit={handleSubmit} className="load-wallet-form">
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
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="load-button">Load</button>
            </form>
        </div>
    );
};

export default LoadWallet;