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

    // Build calendar rows (weeks) with cells
    const weeks = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        // convert to Monday-first index
        const firstWeekdayMonday = (firstDay.getDay() + 6) % 7;
        const totalCells = firstWeekdayMonday + daysInMonth;
        const rows = Math.ceil(totalCells / 7);
        const result = [];
        for (let r = 0; r < rows; r++) {
            const row = [];
            for (let c = 0; c < 7; c++) {
                const cellIndex = r * 7 + c; // 0-based index including leading blanks
                const dayNumber = cellIndex - firstWeekdayMonday + 1;
                if (dayNumber < 1 || dayNumber > daysInMonth) {
                    row.push({ empty: true });
                } else {
                    const weekday = weekdayNames[c];
                    const dayStr = String(dayNumber).padStart(2, '0');
                    const label = `${dayStr} ${weekday}`;
                    const dayGoals = goalsByDay[dayNumber] || [];
                    row.push({ empty: false, dayNumber, label, dayGoals });
                }
            }
            result.push(row);
        }
        return result;
    }, [daysInMonth, goalsByDay, year, month]);

    // Determine weekly goals that should appear as a full-week bar for each week row
    const weeklyGoalsByRow = useMemo(() => {
        const rows = [];
        weeks.forEach((row) => {
            const matches = goalsArray.filter((g) => {
                const repetition = (g.repetition ?? g.Repetition ?? '')?.toString().toLowerCase();
                if (repetition !== 'weekly') return false;

                // determine start and end dates for the goal
                const startStr = g.created_at ?? g.CreatedAt ?? g.start_date ?? g.startDate ?? g.target_date ?? g.TargetDate ?? null;
                const endStr = g.target_date ?? g.TargetDate ?? g.TargetDate ?? null;
                const startDate = startStr ? new Date(startStr) : null;
                const endDate = endStr ? new Date(endStr) : null;
                if (startDate && isNaN(startDate)) return false;
                if (endDate && isNaN(endDate)) return false;

                // the weekly occurrence weekday is taken from the startDate if available
                const weekday = startDate ? startDate.getDay() : null;
                if (weekday === null) return false;

                // find if this week's row contains the weekday occurrence
                const occurrenceCell = row.find((c) => !c.empty && new Date(year, month, c.dayNumber).getDay() === weekday);
                if (!occurrenceCell) return false;

                const occurrenceDate = new Date(year, month, occurrenceCell.dayNumber);
                // occurrence must be on/after startDate (if present) and on/before endDate (if present)
                if (startDate && occurrenceDate < startDate) return false;
                if (endDate && occurrenceDate > endDate) return false;

                return true;
            });
            rows.push(matches);
        });
        return rows;
    }, [weeks, goalsArray, year, month, daysInMonth]);

    // Small component to render a weekly goal pill with hover tooltip
    const WeeklyGoalItem = ({ g }) => {
        const [hovered, setHovered] = useState(false);
        const [rect, setRect] = useState(null);
        const ref = useRef(null);
        const desc = g.description ?? g.Description ?? '';
        const name = g.displayName || g.goal_name || g.GoalName || '';

        useLayoutEffect(() => {
            if (hovered && ref.current) setRect(ref.current.getBoundingClientRect());
        }, [hovered]);

        const tooltip = desc && rect && hovered ? (
            <div style={{
                position: 'fixed',
                left: Math.max(8, rect.left),
                top: rect.top,
                transform: 'translateY(-110%)',
                background: '#111827',
                color: '#fff',
                padding: '8px',
                borderRadius: 6,
                boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
                zIndex: 9999,
                width: 300,
                fontSize: '0.9rem',
                lineHeight: 1.2,
                whiteSpace: 'normal'
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
                    style={{background:'#d1d5db', padding:'8px 12px', borderRadius:999, fontSize:'0.95rem', fontWeight:600, color:'#111827', cursor:'pointer'}}
                >
                    {name}
                </div>
                {tooltip ? createPortal(tooltip, document.body) : null}
            </>
        );
    };
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

                <div style={{display:'flex', flexDirection:'column', gap:12, marginTop:'8px'}}>
                    {weeks.map((row, rowIdx) => (
                        <div key={rowIdx} style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'12px'}}>
                            {weeklyGoalsByRow[rowIdx] && weeklyGoalsByRow[rowIdx].length > 0 && (
                                <div style={{gridColumn: '1 / -1', border:'1px solid #e5e7eb', borderRadius:6, padding:8, background:'#eef2ff', display:'flex', gap:8, alignItems:'center'}}>
                                    {weeklyGoalsByRow[rowIdx].map((g) => (
                                        <WeeklyGoalItem key={g.id ?? g.ID ?? Math.random()} g={g} />
                                    ))}
                                </div>
                            )}

                            {row.map((cell, cidx) => (
                                cell.empty ? (
                                    <div key={cidx} style={{border:'1px solid #e5e7eb', borderRadius:6, height:120, background:'#f8fafc'}}></div>
                                ) : (
                                    <div key={cidx} style={{border:'1px solid #e5e7eb', borderRadius:6, padding:8, height:120, display:'flex', flexDirection:'column', overflow:'visible', background:'#fff',
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Calendar;