import styles from './HistoryCard.module.css'

export default function HistoryCard({ record, handleRollback }) {
    return (
        <div className={styles.historyItem}>
            <div>
                <h4>{record.description}</h4>
                <p>
                    {record.action} por <b>{record.user || "Desconhecido"}</b> em{" "}
                    {new Date(record.date).toLocaleString()}
                </p>
                {record.changes && record.changes.length > 0 && (
                    <p>
                        <i>Campos alterados: {record.changes.join(", ")}</i>
                    </p>
                )}
            </div>
            <button onClick={() => handleRollback(record.id)} className={styles.rollbackButton}>
                Reverter até aqui
            </button>
        </div>
    );
}