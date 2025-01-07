import React, { useState, useEffect } from 'react';
import { fetchGoals, createGoal, deleteGoal } from '../api/api';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const initialGoalState = { goal_name: "", target_date: "", repetition: "daily" };
    const [newGoal, setNewGoal] = useState(initialGoalState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        setLoading(true);
        setError(null); // clear the previous error
        try {
            const response = await fetchGoals();
            const data = Array.isArray(response.data) ? response.data : [];
            setGoals(data);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setError('Tavoitteiden lataaminen epäonnistui');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGoal = async () => {
        if (!newGoal.goal_name.trim() || !newGoal.target_date.trim()) {
            alert('Tavoitteen nimi ja päivämäärä eivät voi olla tyhjiä');
            return;
        }
        
        setLoading(true);
        try {
            const createdGoal = await createGoal(newGoal);
            setGoals([...goals, createdGoal.data]); // update the state directly
            setNewGoal(initialGoalState); // clear the input field
        } catch (error) {
            console.error('Error creating goal:', error);
            setError('Tavoitteen luominen epäonnistui');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async (goalId) => {
        setLoading(true);
        try {
            await deleteGoal(goalId);
            setGoals(goals.filter(goal => goal.id !== goalId)); // update the state directly
        } catch (error) {
            console.error('Error deleting goal:', error);
            setError('Tavoitteen poistaminen epäonnistui');
        } finally {
            setLoading(false);
        }
    };

    const handleGoalNameChange = (e) => {
        setNewGoal({ ...newGoal, goal_name: e.target.value });
    };

    const handleTargetDateChange = (e) => {
        setNewGoal({ ...newGoal, target_date: e.target.value });
    };

    const handleRepetitionChange = (e) => {
        setNewGoal({ ...newGoal, repetition: e.target.value });
    };

    return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Tavoitteet</h1>
                <ErrorMessage error={error} />
                {loading ? (
                    <p>Ladataan...</p>
                ): (
                    <ul className="mb-4">
                        {goals.map((goal) => (
                            <li key={goal.id} className="border p-2 mb-2 rounded flex justify-between">
                                {goal.goal_name} {goal.target_date} {goal.repetition}
                                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" 
                                onClick={() => handleDeleteGoal(goal.id)}>Poista tavoite</button>
                            </li>
                        ))}
                    </ul>
                )}
                <div>
                    <h2 className="text-lg font-bold mb-2">Luo uusi tavoite</h2>
                    <input
                        type="text"
                        placeholder="Tavoitteen nimi"
                        value={newGoal.goal_name}
                        onChange={handleGoalNameChange}
                        className="border p-2 mb-2 rounded mr-2"
                    />
                    <input
                        type="date"
                        value={newGoal.target_date}
                        onChange={handleTargetDateChange}
                        className="border p-2 rounded mr-2"
                    />
                    <input
                        type="text"
                        value={newGoal.goal_name}
                        onChange={handleGoalNameChange}
                        className="border p-2 rounded mr-2"
                    />
                    <select
                        value={newGoal.repetition}
                        onChange={handleRepetitionChange}
                        className="border p-2 rounded mr-2"
                    >
                        <option value="daily">Päivittäinen</option>
                        <option value="weekly">Viikottainen</option>
                        <option value="monthly">Kuukausittainen</option>
                    </select>
                    <button 
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" 
                        onClick={handleCreateGoal}
                    >Luo tavoite
                    </button>
                </div>
            </div>
        );
};
const ErrorMessage = ({ error }) => {
    return error ? <p className="text-red-500 mb-4">{error}</p> : null;
};


export default Goals;
