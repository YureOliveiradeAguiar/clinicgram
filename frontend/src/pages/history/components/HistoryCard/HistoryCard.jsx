import styles from './HistoryCard.module.css'

export default function HistoryCard({ record }) {
    return (
        <div className={styles.historyItem}>
            <h4>{record.description}</h4>
            <p>
                {record.action} por <b>{record.user || "Desconhecido"}</b> em{" "}
                {new Date(record.history_date).toLocaleString()}
            </p>
            {record.changes && Object.keys(record.changes).length > 0 && (
                <ul>
                    {Object.entries(record.changes).map(([field, [oldValue, newValue]]) => (
                        <li key={field}>
                            <strong>{field}:</strong> {(oldValue ?? "—")} → {(newValue ?? "—")}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}