// Global authentication context. All components can check if user is logged in.

import React, { createContext, useState, useEffect } from "react";
import { fetchUserProfile, registerUser, loginUser } from "../api/api";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from local storage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
           api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
           fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    //Fetch user profile
    const fetchUser = async () => {
        try {
            const response = await fetchUserProfile();
            setUser(response.data);
        } catch (error) {
            console.error("Invalid token:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            localStorage.setItem("token", response.data.token);
            api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error);
            throw error;
        } 
    };

    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            localStorage.setItem("token", response.data.token);
            api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
            setUser(response.data.user);
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.error || error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;