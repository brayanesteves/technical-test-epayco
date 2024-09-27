import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const loadWallet = async (data) => {
    console.log(`${API_URL}/wallet/load`);
    return await axios.post(`${API_URL}/wallet/load`, data);
};

export const pay = async (data) => {
    return await axios.post(`${API_URL}/wallet/pay`, data);
};

export const confirmPayment = async (data) => {
    return await axios.post(`${API_URL}/wallet/confirm-payment`, data);
};

export const checkBalance = async (data) => {
    return await axios.post(`${API_URL}/wallet/check-balance`, data);
};