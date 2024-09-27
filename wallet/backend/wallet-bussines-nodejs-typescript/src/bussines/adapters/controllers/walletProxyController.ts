import { Request, Response } from 'express';
import axios from 'axios';

const service1BaseURL = 'http://localhost:4000/api';

// Registro de usuario
export const registerUserProxy = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${service1BaseURL}/users/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        // Manejo de errores para respuestas de Axios
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500; // Usa el código de estado de la respuesta o 500
            const errorMessage = error.response?.data?.error || 'Error comunicándose con el Servicio 1';
            return res.status(status).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Error comunicándose con el Servicio 1' });
    }
};

// Recargar billetera
export const loadWalletProxy = async (req: Request, res: Response) => {
    try {
        console.log("ACA")
        const response = await axios.post(`${service1BaseURL}/wallet/load`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const errorMessage = error.response?.data?.error || 'Error comunicándose con el Servicio 1';
            return res.status(status).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Error comunicándose con el Servicio 1' });
    }
};

// Iniciar pago
export const payProxy = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${service1BaseURL}/wallet/pay`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const errorMessage = error.response?.data?.error || 'Error iniciando el pago.';
            return res.status(status).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Error iniciando el pago.' });
    }
};

// Confirmar pago
export const confirmPaymentProxy = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${service1BaseURL}/wallet/confirm-payment`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const errorMessage = error.response?.data?.error || 'Error confirmando el pago.';
            return res.status(status).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Error confirmando el pago.' });
    }
};

// Consultar saldo
export const checkBalanceProxy = async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${service1BaseURL}/wallet/check-balance`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const errorMessage = error.response?.data?.error || 'Error al consultar saldo.';
            return res.status(status).json({ error: errorMessage });
        }
        res.status(500).json({ error: 'Error al consultar saldo.' });
    }
};