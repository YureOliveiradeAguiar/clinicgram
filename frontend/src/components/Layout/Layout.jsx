import LogoImg from '@/assets/images/Logo.png'
import ListIcon from '@/assets/icons/listIcon'
import UserAddIcon from '@/assets/icons/userAddIcon.jsx'
import UsersIcon from '@/assets/icons/usersIcon.jsx'
import ScheduleIcon from '@/assets/icons/calendarIcon.jsx'
import AppointsIcon from '@/assets/icons/appointsIcon.jsx'
import PlacesIcon from '@/assets/icons/placesIcon.jsx'
//import waitingIcon from '@/assets/icons/clockIcon.jsx'
//import suppliesIcon from '@/assets/icons/boxes.jsx'
import HistoryIcon from '@/assets/icons/historyIcon'

import DesktopSidebar from './components/DesktopSidebar/DesktopSideBar.jsx'
import MobileDrawer from './components/MobileDrawer/MobileDrawer.jsx'
import ProfileMenu from './components/ProfileMenu/ProfileMenu.jsx'

import styles from './Layout.module.css';

import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useState,useEffect } from 'react';

import { getCookie } from '@/utils/csrf.js';


export default function Layout() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetch('/api/profile', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Erro ao carregar usuário');
                return res.json();
            })
            .then(data => { setUser(data); })
            .catch(err => { console.error('Erro ao buscar perfil do usuário:', err); });
    }, []);

    const panelOptions = [
        { title: "Registrar Cliente", Icon: UserAddIcon, link: "/clients/new" },
        { title: "Clientes", Icon: UsersIcon, link: "/clients" },
        { title: "Agendamento", Icon: AppointsIcon, link: "/schedule/new" },
        { title: "Agenda", Icon: ScheduleIcon, link: "/schedule" },
        //{ title: "Estoque", Icon: suppliesIcon, link: "" },
        //{ title: "Lista de Espera", Icon: waitingIcon, link: "" },
        { title: "Salas", Icon: PlacesIcon, link: "/places" },
        { title: "Histórico", Icon: HistoryIcon, link: "/history" },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const media = window.matchMedia("(max-width: 768px)");

        // Set initial value
        setIsMobile(media.matches);

        const listener = (e) => setIsMobile(e.matches);

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, []);

    useEffect(() => {
        if (isMobile) {
            setSidebarExpanded(false);
        }
    }, [isMobile]);

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
                <div className={styles.userHeading}>
                    <ProfileMenu isMobile={isMobile} user={user}/>
                </div>
            </header>
            <div className={styles.mainContent}>
                {isMobile ? (
                    <MobileDrawer panelOptions={panelOptions} currentPath={currentPath}
                        isOpen={sidebarExpanded} onClose={() => setSidebarExpanded(false)} />
                ) : (
                    <DesktopSidebar panelOptions={panelOptions} currentPath={currentPath}
                        sidebarExpanded={sidebarExpanded} />
                )}
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}