import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (data) => {
    return await axios.post(`${API_URL}/register`, data);
};