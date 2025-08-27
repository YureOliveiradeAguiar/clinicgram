import styles from "./NewElementButton.module.css"

export default function NewElementButton ({Icon, title, onClick}) {
    return (
        <button className={styles.newElementButton} onClick={onClick}>
            <Icon className={styles.icon} />
            <span>{title}</span>
        </button>
    )
}