import React, { useState, useEffect, useCallback } from 'react';
import { fetchGoals, createGoal, deleteGoal } from '../api/api';

const Goals = () => {
    const [goals, setGoals] = useState([]);
    const initialGoalState = { goal_name: "", target_date: "", repetition: "daily" };
    const [newGoal, setNewGoal] = useState(initialGoalState);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Format functions
    const formatDate = (dateString) => {
       if (!dateString) {
        console.log("📅 Alkuperäinen Päivämäärä:", dateString);
       } else {
            console.warn("⚠️ Päivämäärä puuttuu", dateString);
        }  

        //if datestring is Date-object, use it as is
        if (dateString instanceof Date) {
            return dateString.toLocaleDateString('fi-FI', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        }

        //make sure the datestring is a valid date
        if (typeof dateString === 'string' && dateString.includes('T')) {
            dateString = dateString.split('T')[0]; //delete time part
        }
       
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            console.warn("❌ Virheellinen päivämäärä", dateString);
            return 'Virheellinen päivämäärä';
        }
        return date.toLocaleDateString('fi-FI',{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Format repetition
    const formatRepetition = (repetition) => {
        switch (repetition) {
            case 'daily':
                return 'Päivittäinen';
            case 'weekly':
                return 'Viikottainen';
            case 'monthly':
                return 'Kuukausittainen';
            default:
                return repetition;
        }
    };

    //success message
    const SuccessMessage = ({ success }) => {
        return success ? <p className="text-green-500 mb-4">{success}</p> : null;
    };
    //error message
    const ErrorMessage = ({ error }) => {
        return error ? <p className="text-red-500 mb-4">{error}</p> : null;
    };

    useEffect(() => {
        console.log("Goals state updated:", goals);
    }, [goals]);

    const loadGoals = async () => {
        try {
            setLoading(true);
            console.log('Loading goals...');
            const response = await fetchGoals();
            setGoals(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            setError('Tavoitteiden lataaminen epäonnistui');
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGoals();
    },[]);

    const handleCreateGoal = async () => {
        if (!newGoal.goal_name.trim() || !newGoal.target_date.trim()) {
            alert('Tavoitteen nimi ja päivämäärä eivät voi olla tyhjiä');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log('Sending goal data:', {
                goal_name: newGoal.goal_name,
                target_date: newGoal.target_date,
                repetition: newGoal.repetition,
            });

            const response = await createGoal({
                goal_name: newGoal.goal_name,
                target_date: newGoal.target_date,
                repetition: newGoal.repetition
            });
            
            console.log('🔹 Backendin vastaus:', response.data);

            if (response?.data) {
            setGoals((prevGoals) => [...prevGoals, response.data]); // update the state directly
            setNewGoal(initialGoalState); // clear the input field
            setSuccess('✅Tavoite luotu onnistuneesti'); // Show a success message
            } else {
                throw new error('Invalid response');
            }
        } catch (error) {
            console.error('❌Error creating goal:', error.response?.data || error.message);
            setError(error.response?.data?.error || 'Tavoitteen luominen epäonnistui');
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
            console.error('❌Error deleting goal:', error);
            setError('✅Tavoitteen poistaminen epäonnistui');
        } finally {
            setLoading(false);
        }
    };

    const handleGoalNameChange = useCallback((e) => {
        setNewGoal((prevGoal => ({ 
            ...prevGoal, 
            goal_name: e.target.value 
        })));
    }, []);

    const handleTargetDateChange = useCallback((e) => {
        setNewGoal((prevGoal) => ({ 
            ...prevGoal, 
            target_date: e.target.value, 
        }));
    }, []);

    const handleRepetitionChange = useCallback((e) => {
        setNewGoal((prevGoal) => ({ 
            ...prevGoal, 
            repetition: e.target.value 
        }));
    }, []);

    return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Tavoitteet</h1>
                {/*Show error and success messages*/}
                <ErrorMessage error={error} />
                <SuccessMessage success={success} />

                {loading ? (
                    <p>Ladataan...</p>
                ) : goals.length === 0 ? (
                    <p>Ei tavoitteita</p>
                ): (
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse border-gray-300 w-full">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2 text-left">Nimi</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Tavoite päivämäärä</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Toistuvuus</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Poista tavoite</th>
                                </tr>
                            </thead>
                            <tbody>
                        {goals.map((goal, index) => (
                            <tr key={goal.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}>
                                <td className="border border-gray-300 px-4 py-2">{goal.goal_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatDate(goal.target_date)}</td>
                                <td className="border border-gray-300 px-4 py-2">{formatRepetition(goal.repetition)}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mr-2"
                                        onClick={() => handleDeleteGoal(goal.id)}
                                    >   Poista
                                    </button>
                                </td>
                            </tr>
                        ))}
                            </tbody>
                        </table>       
                    </div>
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

export default Goals;
