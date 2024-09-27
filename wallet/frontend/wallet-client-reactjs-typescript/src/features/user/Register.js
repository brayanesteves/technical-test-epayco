import React, { useState } from 'react';
import { registerUser } from './api';
import Swal from 'sweetalert2';
import './assets/css/Register.css'; // Asegúrate de crear este archivo para los estilos

const Register = () => {
    const [formData, setFormData] = useState({
        document: '',
        name: '',
        email: '',
        phone: ''
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
            const response = await registerUser(formData);
            Swal.fire({
                title: 'Success!',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || 'Error en el registro';
            Swal.fire({
                title: 'Error!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    name="document"
                    placeholder="Document"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                <button type="submit" className="register-button">Register</button>
            </form>
        </div>
    );
};

export default Register;