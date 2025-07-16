import styles from './ModalButton.module.css'

export default function ModalButton ({Icon, onClick, variant}) {
    return (
        <button className={`${styles.button} ${styles[variant + 'Button']}`} onClick={onClick}>
            <Icon className={`${styles.buttonIcon} ${styles[variant + 'Icon']}`}/>
        </button>
    )
}