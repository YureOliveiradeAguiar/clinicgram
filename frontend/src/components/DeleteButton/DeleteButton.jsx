import TrashCan from '@/assets/icons/trashCan'
import styles from './DeleteButton.module.css'

export default function DeleteButton ({onDelete}) {
    return (
        <button className={styles.deleteButton} onClick={onDelete}>
            <TrashCan className={styles.deleteIcon} />
        </button>
    )
}