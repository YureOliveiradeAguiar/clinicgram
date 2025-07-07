import AlertIcon from '@/assets/icons/alertSign.jsx'
import styles from './ScheduleTable.module.css';
import TableMoving from '@/components/TableMoving/TableMoving.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

import { useMemo, useState, useEffect} from 'react';

import { getCookie } from '@/utils/csrf.js';
import { appointmentsFetch } from '@/utils/appointmentsFetch.js';

import { generateDays, generateHours, generateScheduleMatrix } from '@/utils/generateScheduleMatrix';

export default function ScheduleTable() {
    const [status, setStatus] = useState({ message: "Selecione um horário", type: "info" });
    const [appointments, setAppointments] = useState([]);
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());
    const [startOffset, setStartOffset] = useState(0);
    
    // Centralized base date info.
    const startDate = useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() + startOffset);
      return date;
    }, [startOffset]);
    const days = useMemo(() => generateDays(7, startDate), [startDate]);
    const rawMonth = startDate.toLocaleString('pt-BR', { month: 'long' });
    const monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const year = startDate.getFullYear();
    
    const times = useMemo(() => generateHours(), []);
    const indexedCells = useMemo(() => generateScheduleMatrix(days, times), [days, times]);


    const addMinutesToTime = (timeString, minutesToAdd) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + minutesToAdd);

        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    function formatDate(dateString, withWeekday = false) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Local time (not UTC).
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
        });
        if (!withWeekday) return formattedDate;
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
        return `${capitalizedWeekday}, ${formattedDate}`;
    }

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Agenda</h2>
                <div className={styles.statusContainer}>
                    <p className={`statusMessage ${status.type}`}>{status.message}</p>
                </div>
            </div>
            <div className={styles.contentWrapper}>
                <TableMoving startOffset={startOffset} setStartOffset={setStartOffset} monthName={monthName} year={year}/>
                <div className={styles.scheduleWrapper}>
                    <div className={styles.scheduleContainer} id="hoursScheduling">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    {days.map((day, index) => (
                                        <th key={index}>{formatDate(day)}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {indexedCells.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className={styles.hourLabel}>{row[0]?.time}</td>
                                        {row.map((cell) => (
                                            <td
                                                className={`${styles.scheduleCell}
                                                    ${occupiedIndexes.has(cell.index) ? styles.occupied : ''}`}
                                                key={cell.index} data-index={cell.index}
                                                data-day={cell.day}
                                                data-time={cell.time}
                                            />
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.scrollbarCorner}></div>
                </div>
            </div>
            <ReturnButton containerClass={styles.returnButtonContainer}/>
        </div>
    );
}