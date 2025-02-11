// API service to handle login and registration
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/register/`, { username, password});
    return response;
};

export const loginUser = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login/`, {username, password });
    return response;
};

export const getUserGoals = async (token) => {
    return axios.post(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

