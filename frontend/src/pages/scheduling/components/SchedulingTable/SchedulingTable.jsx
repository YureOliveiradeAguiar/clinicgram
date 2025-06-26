import styles from './SchedulingTable.module.css';
import { generateDays, generateHours, generateScheduleMatrix } from '@/utils/generateScheduleMatrix';
import { useState, useEffect } from 'react';

function SchedulingTable({occupiedIndexes = new Set(), scheduledDay, setScheduledDay,
        startTime, setStartTime, endTime, setEndTime}) {
    const dias = generateDays();
    const horarios = generateHours();
    const indexedCells = generateScheduleMatrix(dias, horarios);

    const [isDragging, setIsDragging] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedIndexes, setSelectedIndexes] = useState(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

    const numColumns = dias.length;
    const isAdjacentInColumn = (a, b) => Math.abs(a - b) === numColumns;

    const addMinutesToTime = (timeString, minutesToAdd) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + minutesToAdd);

        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    function formatDate(dateString, withWeekday = false) {
        const date = new Date(dateString);
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
        setSelectedDay(cell.dia);
        setSelectedIndexes(new Set([cell.index]));
        setLastSelectedIndex(cell.index);
    };

    const handleMouseEnter = (cell) => {
        if (!isDragging || cell.dia !== selectedDay || occupiedIndexes.has(cell.index)) return;

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
                const day = firstCell.dia;
                const start = firstCell.horario;
                const end = addMinutesToTime(lastCell.horario, 15);
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
            <div className={styles.scheduleWrapper}>
                <div className={styles.scheduleContainer} id="hoursScheduling">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {dias.map((dia, index) => (
                                    <th key={index}>{formatDate(dia)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {indexedCells.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className={styles.hourLabel}>{row[0]?.horario}</td>
                                    {row.map((cell) => (
                                        <td
                                            key={cell.index}
                                            className={`${styles.scheduleCell}
                                                ${occupiedIndexes.has(cell.index) ? styles.occupied : ''}
                                                ${selectedIndexes.has(cell.index) ? styles.selected : ''}`}
                                            data-index={cell.index}
                                            data-day={cell.dia}
                                            data-time={cell.horario}
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
            {startTime && endTime ? (
                <div className={styles.timeSummary}>
                    Selecionado: {startTime} às {endTime} • {formatDate(scheduledDay, true)}
                </div>
            ) : (
              <div className={styles.timeSummary}>
                Clique e arraste para selecionar
              </div>
            )}
        </div>
    );
}

export default SchedulingTable;
