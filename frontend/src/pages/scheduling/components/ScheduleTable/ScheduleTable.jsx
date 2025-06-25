import styles from './ScheduleTable.module.css';

function ScheduleTable({ dias = [], indexedCells = [], occupiedIndexes = new Set() }) {
    return (
        <div className={styles.scheduleSection}>
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
                                    <td>{row[0]?.horario}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cell.index}
                                            className={`${styles.scheduleCell} ${occupiedIndexes.has(cell.index) ? styles.occupied : ''}`}
                                            data-index={cell.index}
                                            data-day={cell.dia}
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

export default ScheduleTable;