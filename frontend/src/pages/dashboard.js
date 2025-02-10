// Dashboard page for user-specific goals
import React, { useEffect, useState } from "react";
import { getUserGoals } from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ token }) => {
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        const fetchGoals = async () => {
            try {
                const response = await getUserGoals(token);
                setGoals(response.data.data);
            } catch(error) {
                setError("Failed to load goals");
            }
        };

        fetchGoals();
    }, [token, navigate]);

    return (
        <div className="p-6">
            <h1 className="text-2x1 font-bold">Dashboard</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-4">
                {goals.map((goal) => (
                    <li key={goal.id} className="p-2 border-b">
                        {goal.goal_name} - {goal.target_date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;