import styles from './HistoryItem.module.css'

export default function HistoryItem({ record }) {
    return (
        <div className={styles.historyItem}>
            <h4>{record.model} (ID {record.object_id})</h4>
            <p>
                Alterado por <b>{record.user || "Desconhecido"}</b> em{" "}
                {new Date(record.history_date).toLocaleString()}
            </p>
            {record.changes && Object.keys(record.changes).length > 0 && (
                <ul>
                    {Object.entries(record.changes).map(([field, [oldValue, newValue]]) => (
                        <li key={field}>
                            <strong>{field}:</strong> {oldValue} → {newValue}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}