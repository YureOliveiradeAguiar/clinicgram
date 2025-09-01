import MedicalSuitcase from '@/assets/icons/medicalSuitcase.jsx'
import UsersIcon from '@/assets/icons/usersIcon.jsx'
import ScheduleIcon from '@/assets/icons/calendarIcon.jsx'
import PlacesIcon from '@/assets/icons/placesIcon.jsx'
import HistoryIcon from '@/assets/icons/historyIcon'

import Sidebar from './components/Sidebar/SideBar.jsx'
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
        { title: "Estagiários", Icon: MedicalSuitcase, link: "/staff" },
        { title: "Pacientes", Icon: UsersIcon, link: "/clients" },
        { title: "Salas", Icon: PlacesIcon, link: "/places" },
        {title: "Agendamento", Icon: UsersIcon, dropdown: [
            { title: "Registrar Consulta", link: "/schedule/new" },
            { title: "Lista de Espera", link: "/schedule/new" },
            { title: "Agendar consulta", link: "/schedule/new" },]},
        { title: "Agenda", Icon: ScheduleIcon, link: "/schedule" },
        //{ title: "Estoque", Icon: suppliesIcon, link: "" },
        { title: "Histórico", Icon: HistoryIcon, link: "/history" },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
            <div className={styles.sideContent}>
                {isMobile ? (
                    <MobileDrawer panelOptions={panelOptions} currentPath={currentPath}
                        isOpen={sidebarExpanded} onClose={() => setSidebarExpanded(false)} />
                ) : (
                    <Sidebar panelOptions={panelOptions} currentPath={currentPath}
                        setSidebarExpanded = {setSidebarExpanded} sidebarExpanded={sidebarExpanded} />
                )}
            </div>

            <div className={styles.mainContent}>
                <header className={styles.masthead}>
                    <div className={styles.heading}>
                        <h1 className={styles.brandName}>Clinicgram</h1>
                    </div>
                    <div className={styles.userHeading}>
                        <ProfileMenu isMobile={isMobile} user={user}/>
                    </div>
                </header>
                <div className={styles.pageContent}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}