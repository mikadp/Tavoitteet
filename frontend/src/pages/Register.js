//Page for user register
import {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const { register } = useContext(AuthContext);
    const [userData, setUserData] = useState({ username: "", password: ""});
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register(userData);
            setSuccess("✅ Registration successful!");
            //navigate("/login") //Redirect to login page
        } catch (error){
            setError(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="flex flex-col items-centre p-6">
            <h1 className="text-2x1 font-bold mb-4">Register</h1>
            
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

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
                <button type="submit" id="submit_register" className="bg-blue-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;