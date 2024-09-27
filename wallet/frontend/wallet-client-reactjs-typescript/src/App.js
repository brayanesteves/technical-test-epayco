import React, { useState } from 'react';
import Register from './features/user/Register';
import LoadWallet from './features/wallet/LoadWallet';
import Pay from './features/wallet/Pay';
import ConfirmPayment from './features/wallet/ConfirmPayment';
import CheckBalance from './features/wallet/CheckBalance';
import './App.css'; // Asegúrate de crear este archivo para los estilos

function App() {
    const [sessionId, setSessionId] = useState(null);
    const [activeComponent, setActiveComponent] = useState('home');

    const handlePaymentInitiated = (id) => {
        setSessionId(id);
        setActiveComponent('confirmPayment');
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case 'register':
                return <Register />;
            case 'loadWallet':
                return <LoadWallet />;
            case 'pay':
                return <Pay onPaymentInitiated={handlePaymentInitiated} />;
            case 'confirmPayment':
                return sessionId ? <ConfirmPayment sessionId={sessionId} /> : null;
            case 'checkBalance':
                return <CheckBalance />;
            default:
                return <p>Seleccione una opción del menú.</p>;
        }
    };

    return (
        <div className="app-container">
            <h1>Wallet Management</h1>
            <div className="button-container">
                <button onClick={() => setActiveComponent('register')}>Register</button>
                <button onClick={() => setActiveComponent('loadWallet')}>Load Wallet</button>
                <button onClick={() => setActiveComponent('pay')}>Pay</button>
                <button onClick={() => setActiveComponent('checkBalance')}>Check Balance</button>
            </div>
            <div className="component-container">
                {renderComponent()}
            </div>
        </div>
    );
}

export default App;