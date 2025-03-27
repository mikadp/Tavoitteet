//Page for user register
import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const { register } = useContext(AuthContext);
    const [userData, setUserData] = useState({ username: "", password: ""});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            
            await register(userData);
            alert("✅ Registration successful!");
            navigate("/login") //Redirect to login page
        } catch (error){
            setError(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col items-centre p-6">
            <h1 className="text-2x1 font-bold mb-4">Register</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleRegister} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                    className="border p-2 rounded mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={(e)=> setUserData({ ...userData, password: e.target.value })}
                    className="border p-2 rounded mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;