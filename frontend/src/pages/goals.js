import React, { useState, useEffect } from 'react';
import axios from "axios";

const Goals = () => {
    const [goals, setGoals] = useState({});
    const [newGoal, setNewGoal] = useState({
        goal_name: '',
        tartget_date: '',
        repetition: 'daily',
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://localhost:8000/goals');
            setGoals(response.data);
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    };

    const createGoal = async () => {
        try {
            await axios.post('http://localhost:8000/goals', newGoal);
            setNewGoal({ goal_name: '', target_date: '', repetition: 'daily' });
            fetchGoals(); // fetch the updated list of goals
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const deleteGoal = async (goalId) => {
        try {
            await axios.delete(`http://localhost:8000/goals/${goalId}`);
            fetchGoals(); // fetch the updated list of goals
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Tavoitteet</h1>
            <u1 className="mb-4">
                {goals.map(goal => (
                    <li key={goal.id} className="border p-2 mb-2 rounded flex justify-between">
                        {goal.goal_name} {goal.target_date} {goal.repetition}
                        <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => deleteGoal(goal.id)}>Poista tavoite</button>
                    </li>
                ))}
            </u1>
            <div>
                <h2 className="text-xl font-bold mb-2"> Luo uusi tavoite </h2>
                <input
                    type="text"
                    placeholder="Tavoitteen nimi"
                    value={newGoal.goal_name}
                    onChange={(e) => 
                        setNewGoal({ ...newGoal, goal_name: e.target.value })}
                    className="border p-2 rounded mr-2"
                />
                <select
                    type="date"
                    onChange={(e) =>
                        setNewGoal({ ...newGoal, target_date: e.target.value })}
                    className="border p-2 rounded mr-2"
                >
                        <option value="daily">Päivittäinen</option>
                        <option value="weekly">Viikottainen</option>
                        <option value="monthly">Kuukausittainen</option>
                </select>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={createGoal}>Luo tavoite</button>
            </div>
        </div>
        );
    };
export default Goals;