import React, { useState, useEffect } from 'react';
import { fetchGoals } from '../api/api';


const Calendar = () => {
    const [goals, setGoals] = useState({});
    const [completedGoals, setCompletedGoals] = useState({});
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() +1, 0).getDate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
        
    useEffect(() =>{
    // Fetch goals and comletion status from database when component mounts
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

    const handleGoalChange = (day, event) => {
        const newGoals = {...goals, [day]: event.target.value};
        setGoals(newGoals);
    };

    const handleGoalCompletion = (day) => {
        const newCompletedGoals = {...completedGoals, [day]: !completedGoals[day] };
        setCompletedGoals(newCompletedGoals);
        saveGoalCompletionToDatabase(day, newCompletedGoals[day]);
    };

    const saveGoalCompletionToDatabase = async (day, isCompleted) => {
        // Mock data save - Replace with actual API call
        console.log(`Saving goal ${day} completion status to database: ${isCompleted}`);
    };

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(
                <div key={i} className="day">
                    <div className="day-number">{i}</div>
                    <input
                        type="text"
                        placeholder='Tavoite'
                        value={goals[i] || ''}
                        onChange={(event) => handleGoalChange(i, event)}
                    />
                    <input
                        type="checkbox"
                        checked={completedGoals[i] || false}
                        onChange={() => handleGoalCompletion(i)}
                    />
                </div>
            );
        }
        return days;
    };

    return (
        <div className="calendar">
            <h1>Kalenteri</h1>
            <div className="Calendar-grid">
                {renderDays()}
        </div>
        </div>
    );
};

export default Calendar;