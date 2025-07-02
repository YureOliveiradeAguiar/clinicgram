import styles from './ScheduleTable.module.css';

export default function ScheduleTable({ occupiedIndexes, days, indexedCells, selectedIndexes }) {
    return (
        <div>
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
        </div>
    );
}