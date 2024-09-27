import React, { useState } from 'react';
import { checkBalance } from './api';
import Swal from 'sweetalert2';
import './assets/css/CheckBalance.css';

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
            const retrievedBalance = response.data.balance;
            console.log(response.data.balance)
            if(response.status === 200) {
                if(retrievedBalance.message) {
                    Swal.fire({
                        title: 'Insuficiente',
                        text: `Tu balance es: ${retrievedBalance.message}`,
                        icon: 'warning',
                        confirmButtonText: 'OK'
                    });
                } else {

                    // Asegúrate de que el balance sea un número o cadena
                    if (typeof retrievedBalance === 'number' || typeof retrievedBalance === 'string') {
                        setBalance(retrievedBalance);
                        Swal.fire({
                            title: 'Balance Retrieved!',
                            text: `Tu balance es: ${retrievedBalance}`,
                            icon: 'success',
                            confirmButtonText: 'OK'
                        });
                    } else {
                        throw new Error('Invalid balance format');
                    }
                }

            }
        } catch (error) {
            console.error(error);
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
                {balance !== null && (
                    <p className="balance-info">
                        Your balance is: <strong>{String(balance)}</strong>
                    </p>
                )}
            </form>
        </div>
    );
};

export default CheckBalance;