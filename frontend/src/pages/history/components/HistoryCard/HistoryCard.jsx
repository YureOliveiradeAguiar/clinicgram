import styles from './HistoryCard.module.css'


export default function HistoryCard({ record, handleRollback }) {
    return (
        <div className={styles.historyItem}>
            <div className={styles.historyContent}>
                <div className={styles.textBlock}>
                    <h4 className={styles.title}>{record.description}</h4>
                    <p className={styles.meta}>
                        {record.action} por <b>{record.user || "Desconhecido"}</b> em{" "}
                        <time dateTime={record.date}>{new Date(record.date).toLocaleString()}</time>
                    </p>
                    {record.changes?.length > 0 && (
                        <p className={styles.changes}>
                            <i>Alterações: {record.changes.join(", ")}</i>
                        </p>
                    )}
                </div>
                <button onClick={() => handleRollback(record.id)} className={styles.rollbackButton}>
                    Reverter até aqui
                </button>
            </div>
        </div>
    );
}