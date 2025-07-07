import userAddIcon from '@/assets/icons/userAddIcon.jsx'
import usersIcon from '@/assets/icons/usersIcon.jsx'
import scheduleIcon from '@/assets/icons/calendarIcon.jsx'
import appointsIcon from '@/assets/icons/appointsIcon.jsx'
import placesIcon from '@/assets/icons/placesIcon.jsx'
//import waitingIcon from '@/assets/icons/clockIcon.jsx'
//import suppliesIcon from '@/assets/icons/boxes.jsx'
import LogOutIcon from '@/assets/icons/logOutIcon.jsx'

import styles from './Dash.module.css'

import { Link } from 'react-router-dom';

import handleLogout from '@/utils/handleLogout.js'

function Dash () {
    const cards = [
        { title: "Registrar Cliente", Icon: userAddIcon, link: "/clients/new" },
        { title: "Clientes", Icon: usersIcon, link: "/clients" },
        { title: "Agendamento", Icon: appointsIcon, link: "/schedule/new" },
        { title: "Agenda", Icon: scheduleIcon, link: "/schedule" },
        //{ title: "Estoque", Icon: suppliesIcon, link: "" },
        //{ title: "Lista de Espera", Icon: waitingIcon, link: "" },
        { title: "Salas", Icon: placesIcon, link: "/places" },
    ];

    return (
        <div className={styles.dash}>
            {cards.map(({ title, Icon, link }, index) => (
                <Link to={link} key={index} href={link} className={styles.card}>
                    {Icon && <Icon className={styles.icon} />}
                    <span>{title}</span>
                </Link>
            ))}
            <button onClick={handleLogout} className={styles.card}>
                {LogOutIcon && <LogOutIcon className={styles.icon} />}
                <span>Sair</span>
            </button>
        </div>
    )
}

export default Dash