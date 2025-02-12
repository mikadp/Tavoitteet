// Global authentication context. All components can check if user is logged in.

import React, { createContext, useState, useEffect } from "react";
import { registerUser, loginUser } from "../api/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Login failed:", error);
        } 
    };

    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;