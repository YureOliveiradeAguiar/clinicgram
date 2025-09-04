import styles from './Panel.module.css';


export default function Panel({ title, maxWidth='800px', header, children }) {
    return (
        <div className={styles.mainWrapper} style={{maxWidth: maxWidth}}>
            <div className={styles.heading}>
                <h2>{title}</h2>
                {header}
            </div>
            {children}
        </div>
    );
}