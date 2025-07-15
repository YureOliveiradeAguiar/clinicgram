import EditIcon from '@/assets/icons/editIcon.com'
import styles from './EditButton.module.css'

export default function EditButton ({onEdit}) {
    return (
        <button className={styles.editButton} onClick={onEdit}>
            <EditIcon className={styles.editIcon} />
        </button>
    )
}