import userAddIcon from '@/assets/icons/userAddIcon.jsx'
import usersIcon from '@/assets/icons/usersIcon.jsx'
import scheduleIcon from '@/assets/icons/scheduleIcon.jsx'
import appointsIcon from '@/assets/icons/appointsIcon.jsx'
import roomsIcon from '@/assets/icons/roomsIcon.jsx'
import waitingIcon from '@/assets/icons/waitingIcon.jsx'
import suppliesIcon from '@/assets/icons/suppliesIcon.jsx'
import logOutIcon from '@/assets/icons/logOutIcon.jsx'

import styles from './Dash.module.css'

import { Link } from 'react-router-dom';

function Dash () {
    const cards = [
        { title: "Registrar Cliente", Icon: userAddIcon, link: "/clients/new" },
        { title: "Clientes", Icon: usersIcon, link: "/clients" },
        { title: "Agendamento", Icon: appointsIcon, link: "" },
        { title: "Agenda", Icon: scheduleIcon, link: "" },
        { title: "Estoque", Icon: suppliesIcon, link: "" },
        { title: "Lista de Espera", Icon: waitingIcon, link: "" },
        { title: "Registrar Sala", Icon: roomsIcon, link: "" },
        { title: "Sair", Icon: logOutIcon, link: "" }
    ];

    return (
        <div className={styles.dash}>
            {cards.map(({ title, Icon, link }, index) => (
                <Link to={link} key={index} href={link} className={styles.card}>
                    {Icon && <Icon className={styles.icon} />}
                    <span>{title}</span>
                </Link>
            ))}
        </div>
    )
}

export default Dash