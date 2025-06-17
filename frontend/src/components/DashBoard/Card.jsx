import styles from './Card.module.css'

function Card ({ title, Icon, link }) {
    return (
        <a href={link} className={styles.card}>
            {Icon && <Icon className={styles.icon}/>}
            <span className={styles.label}>{title}</span>
        </a>
    )
}

export default Card