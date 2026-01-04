// Dashboard page for user-specific goals
import { useEffect, useState } from "react";
import { getUserGoals } from "../api/api";

const Dashboard = () => {
    const [goals, setGoals] = useState([]);
    const [error, setError] = useState(null);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00Z") {
            return "No date";
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid date";
        }
        return date.toLocaleDateString('fi-FI', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await getUserGoals();
                setGoals(response?.data?.data);
            } catch(error) {
                setError("Failed to load goals");
            }
        };

        fetchGoals();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2x1 font-bold">Dashboard</h1>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-4">
                {goals.map((goal) => (
                    <li 
                        key={goal.id} 
                        className="p-2 border-b"
                    >
                        {goal.goal_name} - {formatDate(goal.target_date)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;