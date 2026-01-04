// Global authentication context. All components can check if user is logged in.

import { createContext, useState, useEffect } from "react";
import api, { fetchUserProfile, registerUser, loginUser } from "../api/api";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Setup axios interceptor for 401 responses
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Clear token and user on 401
                    localStorage.removeItem("token");
                    delete api.defaults.headers.common["Authorization"];
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, []);

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
            const token = response.data.token;
            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            // Fetch user profile after setting the token
            const userResponse = await fetchUserProfile();
            setUser(userResponse.data);
        } catch (error) {
            console.error("Login failed:", error.response?.data?.error || error);
            throw error;
        } 
    };

    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            // Check if registration returns a token (some implementations do)
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
                // Fetch user profile after setting the token
                const userResponse = await fetchUserProfile();
                setUser(userResponse.data);
            }
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