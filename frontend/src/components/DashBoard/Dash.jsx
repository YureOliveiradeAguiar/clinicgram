import UserAddIcon from '../../assets/icons/userAddIcon.jsx'

import styles from './Dash.module.css'

function Dash () {
    const cards = [
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" },
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/register" }
    ];

    return (
        <div className={styles.dash}>
            {cards.map(({ title, Icon, link }, index) => (
                <a key={index} href={link} className={styles.card}>
                    {Icon && <Icon className={styles.icon} />}
                    <span>{title}</span>
                </a>
            ))}
        </div>
    )
}

export default Dash