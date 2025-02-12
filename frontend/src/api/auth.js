// API service to handle login and registration
import axios from 'axios';
import api from './api';

const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);

export const getUserGoals = async (token) => {
    return axios.post(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

