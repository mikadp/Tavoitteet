// Login and store JWT token
import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const { login } = useContext(AuthContext);
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(credentials); //use login func from AuthContext
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
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                    className="border p-2 rounded mb-2"
                    />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e)=> setCredentials({ ...credentials, password: e.target.value })}
                    required
                    className="border p-2 rounded mb-2"
                />
                <button type="Login" className="bg-blue-500 text-white p-2 rounded">
                    Login
                </button>
            </form>
            <p>
                Don't have an account ? <Link to="/register" className="text-blue-500">Rekisteröidy</Link>
            </p>
        </div>
    );
};


export default Login;