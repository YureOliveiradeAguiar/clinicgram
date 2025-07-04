import AlertIcon from '@/assets/icons/alertSign.jsx'
import styles from './SchedulingTable.module.css';
import TableMoving from '../TableMoving/TableMoving.jsx';
import { useState, useEffect } from 'react';

function SchedulingTable({ occupiedIndexes,
        days, indexedCells,
        scheduledDay, setScheduledDay,
        selectedIndexes, setSelectedIndexes,
        startTime, setStartTime, endTime, setEndTime, hasError=false,
        startOffset={startOffset}, setStartOffset={setStartOffset}}) {

    const [isDragging, setIsDragging] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

    const numColumns = days.length;
    const isAdjacentInColumn = (a, b) => Math.abs(a - b) === numColumns;

    const descriptionText = startTime && endTime
        ? `Selecionado: ${startTime} às ${endTime} • ${formatDate(scheduledDay, true)}`
        : 'Clique e arraste para selecionar';
    const errorText = 'Selecione um horário válido';

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

    const handleMouseDown = (cell) => {
        if (occupiedIndexes.has(cell.index)) return;
        setIsDragging(true);
        setSelectedDay(cell.day);
        setSelectedIndexes(new Set([cell.index]));
        setLastSelectedIndex(cell.index);
    };

    const handleMouseEnter = (cell) => {
        if (!isDragging || cell.day !== selectedDay || occupiedIndexes.has(cell.index)) return;

        if (isAdjacentInColumn(lastSelectedIndex, cell.index)) {
            setSelectedIndexes(prev => {
                const updated = new Set(prev);
                updated.add(cell.index);
                return updated;
            });
            setLastSelectedIndex(cell.index);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setSelectedDay(null);
        setLastSelectedIndex(null);

        if (selectedIndexes.size > 0) {
            const sorted = [...selectedIndexes].sort((a, b) => a - b);
            const firstCell = indexedCells.flat().find(cell => cell.index === sorted[0]);
            const lastCell = indexedCells.flat().find(cell => cell.index === sorted[sorted.length - 1]);

            if (firstCell && lastCell) {
                const day = firstCell.day;
                const start = firstCell.time;
                const end = addMinutesToTime(lastCell.time, 15);
                setScheduledDay(day);
                setStartTime(start);
                setEndTime(end);
                //console.log("Start:", start);
                //console.log("End:", end);
            }
        }
    };

    useEffect(() => {
        const stopDrag = () => setIsDragging(false);
        window.addEventListener('mouseup', stopDrag);
        return () => window.removeEventListener('mouseup', stopDrag);
    }, []);

    return (
        <div>
            <TableMoving startOffset={startOffset} setStartOffset={setStartOffset}/>
            <div className={`${styles.scheduleWrapper} ${hasError ? styles.scheduleWrapperError : ''}`}>
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
                                                ${occupiedIndexes.has(cell.index) ? styles.occupied : ''}
                                                ${selectedIndexes.has(cell.index) ? styles.selected : ''}`}
                                            key={cell.index} data-index={cell.index}
                                            data-day={cell.day}
                                            data-time={cell.time}
                                            onMouseDown={() => handleMouseDown(cell)}
                                            onMouseEnter={() => handleMouseEnter(cell)}
                                            onMouseUp={handleMouseUp}
                                        />
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.scrollbarCorner}></div>
            </div>
            <div className={`${styles.description} ${hasError ? styles.descriptionError : ''}`}>
                {hasError && AlertIcon && <AlertIcon className={styles.icon}/>}
                {hasError ? errorText : descriptionText}
            </div>
        </div>
    );
}

export default SchedulingTable;
