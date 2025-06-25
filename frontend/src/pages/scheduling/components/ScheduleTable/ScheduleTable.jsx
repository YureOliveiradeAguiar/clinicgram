import styles from './ScheduleTable.module.css';

import { useState, useEffect } from 'react';

function ScheduleTable({ dias = [], indexedCells = [], occupiedIndexes = new Set() }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedIndexes, setSelectedIndexes] = useState(new Set());

    const handleMouseDown = (cell) => {
        if (occupiedIndexes.has(cell.index)) return;
        setIsDragging(true);
        setSelectedDay(cell.dia);
        setSelectedIndexes(new Set([cell.index]));
    };

    const handleMouseEnter = (cell) => {
        if (!isDragging || cell.dia !== selectedDay || occupiedIndexes.has(cell.index)) return;
        setSelectedIndexes(prev => new Set(prev).add(cell.index));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setSelectedDay(null);
    };

    useEffect(() => {
        const stopDrag = () => setIsDragging(false);
        window.addEventListener('mouseup', stopDrag);
        return () => window.removeEventListener('mouseup', stopDrag);
    }, []);

    return (
        <div className={styles.outerWrapper}>
            <div className={styles.scheduleContainer} id="hoursScheduling">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {dias.map((dia, index) => (
                                <th key={index}>
                                    {new Date(dia).toLocaleDateString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                    })}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {indexedCells.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                            <td className={styles.hourLabel}>{row[0]?.horario}</td>
                            {row.map((cell) => (
                                <td key={cell.index} className={`${styles.scheduleCell}
                                        ${occupiedIndexes.has(cell.index) ? styles.occupied : ''}
                                        ${selectedIndexes.has(cell.index) ? styles.selected : ''}`}
                                    data-index={cell.index} data-day={cell.dia} data-time={cell.horario}
                                    onMouseDown={() => handleMouseDown(cell)}
                                    onMouseEnter={() => handleMouseEnter(cell)}
                                    onMouseUp={handleMouseUp}/>))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles.scrollbarCorner}></div>
        </div>
    );
}

export default ScheduleTable;