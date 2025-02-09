// Login and store JWT token
import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Login = ({ setToken }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await loginUser({ username, password });
            localStorage.setItem('token', response.token);
            setToken(response.data.token); // update state
            navigate("/") //Redirect to frontpage
        } catch (error) {
            setError(error.response?.data?.error || 'Kirjautuminen epäonnistui');
        }
    };

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-bold mb-4">Kirjaudu sisään</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border p-2 rounded mb-2"
                    />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
};


export default Login;