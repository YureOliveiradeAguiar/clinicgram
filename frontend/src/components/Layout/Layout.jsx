import LogoImg from '@/assets/images/Logo.png'
import ListIcon from '@/assets/icons/listIcon'
import userAddIcon from '@/assets/icons/userAddIcon.jsx'
import usersIcon from '@/assets/icons/usersIcon.jsx'
import scheduleIcon from '@/assets/icons/calendarIcon.jsx'
import appointsIcon from '@/assets/icons/appointsIcon.jsx'
import placesIcon from '@/assets/icons/placesIcon.jsx'
//import waitingIcon from '@/assets/icons/clockIcon.jsx'
//import suppliesIcon from '@/assets/icons/boxes.jsx'
import LogOutIcon from '@/assets/icons/logOutIcon.jsx'

import styles from './Layout.module.css';

import { Link, useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import handleLogout from '@/utils/handleLogout.js'

export default function Layout() {
    const panelOptions = [
        { title: "Registrar Cliente", Icon: userAddIcon, link: "/clients/new" },
        { title: "Clientes", Icon: usersIcon, link: "/clients" },
        { title: "Agendamento", Icon: appointsIcon, link: "/schedule/new" },
        { title: "Agenda", Icon: scheduleIcon, link: "/schedule" },
        //{ title: "Estoque", Icon: suppliesIcon, link: "" },
        //{ title: "Lista de Espera", Icon: waitingIcon, link: "" },
        { title: "Salas", Icon: placesIcon, link: "/places" },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    return (
        <div className={styles.appContainer}>
            <header className={styles.masthead}>
                <div className={styles.heading}>
                    <button className={styles.panelButton} onClick={toggleSidebar}>
                        <ListIcon className={styles.panelButtonIcon}/>
                    </button>
                    <div className={styles.brand}>
                        <img src={LogoImg} alt="Clinicgram" />
                        <h1>Clinicgram</h1>
                    </div>
                </div>
                <div>user</div>
            </header>
            <div className={styles.mainContent}>
                <div className={styles.sidePanel}>
                    {panelOptions.map(({ title, Icon, link }, index) => {
                        const isActive = currentPath === link;
                        return (
                            <Link to={link} key={index} href={link}
                                className={`${styles.panelOption} ${isActive ? styles.activeOption : ''}`}>
                                {Icon && <Icon className={styles.icon} />}
                                {sidebarExpanded && <span>{title}</span>}
                            </Link>
                        );
                    })}
                    <button onClick={handleLogout} className={styles.panelOption}>
                        {LogOutIcon && <LogOutIcon className={styles.icon} />}
                        {sidebarExpanded && <span>Sair</span>}
                    </button>
                </div>
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}