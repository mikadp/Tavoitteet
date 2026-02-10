import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { fetchActiveUserGoals } from '../api/api';

const weekdayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const monthNames = ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'];


const Calendar = () => {
    const [goalsArray, setGoalsArray] = useState([]); // raw goals from API
    const [goalsByDay, setGoalsByDay] = useState({}); // map: dayNumber -> [goals]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();
        
    useEffect(() =>{
    // Fetch active user goals and completion status from database when component mounts
        const loadActiveUserGoals = async () => {
            setLoading(true);
            setError(null); // clear the previous error
            try {
                const response = await fetchActiveUserGoals();
                const data = Array.isArray(response?.data?.data)
                    ? response.data.data
                    : Array.isArray(response?.data)
                        ? response.data
                        : [];
                console.log('Active user goals (raw):', data);
                setGoalsArray(data);
            } catch (error) {
                console.error('Error fetching goals:', error);
                setError('Tavoitteiden lataaminen epäonnistui');
            } finally {
                setLoading(false);
            }
        };
        loadActiveUserGoals();

    }, []);

    // Map goals to day numbers for the current month, including repeated occurrences
    useEffect(() => {
        const map = {};
        const pushToDay = (dayNum, goal) => {
            if (!map[dayNum]) map[dayNum] = [];
            map[dayNum].push(goal);
        };

        goalsArray.forEach((g) => {
            const dateStr = g.target_date ?? g.TargetDate ?? g.targetDate ?? null;
            const name = g.goal_name ?? g.GoalName ?? g.goalName ?? '';
            if (!dateStr) return;
            const startDate = new Date(dateStr);
            if (isNaN(startDate)) return;

            const repetition = (g.repetition ?? g.Repetition ?? '')?.toString().toLowerCase();
            const goalWithName = { ...g, displayName: name };

            if (!repetition) {
                if (startDate.getFullYear() === year && startDate.getMonth() === month) {
                    pushToDay(startDate.getDate(), goalWithName);
                }
                return;
            }

            // Generate occurrences for this month from startDate
            for (let day = 1; day <= daysInMonth; day++) {
                const candidate = new Date(year, month, day);
                if (candidate < startDate) continue;

                if (repetition === 'daily') {
                    pushToDay(day, goalWithName);
                } else if (repetition === 'weekly') {
                    if (candidate.getDay() === startDate.getDay()) {
                        pushToDay(day, goalWithName);
                    }
                } else if (repetition === 'monthly') {
                    if (candidate.getDate() === startDate.getDate()) {
                        pushToDay(day, goalWithName);
                    }
                }
            }
        });

        console.log('Goals mapped by day:', map);
        setGoalsByDay(map);
    }, [goalsArray, year, month, daysInMonth]);

    // Build grid cells as a flat array
    const cells = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        // convert to Monday-first index
        const firstWeekdayMonday = (firstDay.getDay() + 6) % 7;
        const totalCells = firstWeekdayMonday + daysInMonth;
        const rows = Math.ceil(totalCells / 7);
        const result = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < 7; c++) {
                const cellIndex = r * 7 + c; // 0-based index including leading blanks
                const dayNumber = cellIndex - firstWeekdayMonday + 1;
                if (dayNumber < 1 || dayNumber > daysInMonth) {
                    result.push({ empty: true });
                } else {
                    const weekday = weekdayNames[c];
                    const dayStr = String(dayNumber).padStart(2, '0');
                    const label = `${dayStr} ${weekday}`;
                    const dayGoals = goalsByDay[dayNumber] || [];
                    result.push({ empty: false, dayNumber, label, dayGoals });
                }
            }
        }
        return result;
    }, [daysInMonth, goalsByDay, year, month]);
    // Small component to render a goal with hover description
const GoalItem = ({ g }) => {
    const [hovered, setHovered] = useState(false);
    const [rect, setRect] = useState(null);
    const ref = useRef(null);
    const desc = g.description ?? g.Description ?? '';
    const name = g.displayName || g.goal_name || g.GoalName || '';

    useLayoutEffect(() => {
    if (hovered && ref.current) {
        setRect(ref.current.getBoundingClientRect());
    }
}, [hovered]);

const tooltip = desc && rect && hovered ? (
            <div style={{
                position: 'fixed',
                left: Math.max(8, rect.left),
                top: rect.top,
                transform: 'translateY(-100%)',
                background: '#111827',
                color: '#fff',
                padding: '8px',
                borderRadius: 6,
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                zIndex: 9999,
                width: 260,
                fontSize: '0.85rem',
                lineHeight: 1.2,
                whiteSpace: 'normal',
                wordWrap: 'break-word'
    }}>{desc}</div>
) : null;

return (
            <>
                <div
                    ref={ref}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onFocus={() => setHovered(true)}
                    onBlur={() => setHovered(false)}
                    tabIndex={0}
                    style={{ position: 'relative', marginBottom: 6, cursor: 'pointer' }}
                >
                    <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                </div>
                {tooltip ? createPortal(tooltip, document.body) : null}
            </>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center py-6">
            <div className="spinner border-t-4 border-blue-500 w-8 h-8 rounded-full animate-spin mr-3"></div>
            <div>Ladataan kalenteria...</div>
        </div>
    );

    if (error) return <div className="text-red-600">{error}</div>;

    return (
        <div className="calendar p-4">
            <h1 className="text-2xl font-bold mb-4">{monthNames[month]} {year}</h1>
            <div style={{maxWidth: '960px', margin: '0 auto'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'12px', alignItems:'center'}} className="grid grid-cols-7 gap-3">
                    {/* Header row showing weekdays (Mon..Sun) */}
                    {weekdayNames.map((wd) => (
                        <div key={wd} style={{textAlign:'center', fontWeight:600, fontSize:'0.95rem'}}>{wd}</div>
                    ))}
                </div>

                <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'12px', marginTop:'8px'}}>
                    {cells.map((cell, idx) => (
                        cell.empty ? (
                            <div key={idx} style={{border:'1px solid #e5e7eb', borderRadius:6, height:120, background:'#f8fafc'}}></div>
                        ) : (
                            <div key={idx} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8, height:120, display:'flex', flexDirection:'column', overflow:'visible', background:'#fff', 
                                //apply green border current date
                                ...(cell.dayNumber === today.getDate() ? {borderColor:'#10b981', boxShadow:'0 0 8px rgba(16,185,129,0.5)'} : {})}}>
                                <div style={{fontSize:'0.85rem', fontWeight:600, marginBottom:6}}>{cell.label}</div>
                                <div style={{fontSize:'0.75rem', color:'#374151', overflowY:'auto'}}>
                                    {cell.dayGoals.length === 0 ? (
                                        <div style={{color:'#9ca3af'}}>Ei tavoitteita</div>
                                    ) : (
                                        cell.dayGoals.map((g) => (
                                            <GoalItem key={g.id ?? g.ID ?? Math.random()} g={g} />
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;