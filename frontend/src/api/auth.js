// API service to handle login and registration
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (data) => {
    const response = await axios.post(`${API_URL}/auth/register/`, data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await axios.post(`${API_URL}/auth/login/`, data);
    return response.data;
};

