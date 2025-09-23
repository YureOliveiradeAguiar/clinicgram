import MedicalInfo from '@/assets/icons/medicalInfo.jsx'
import UsersIcon from '@/assets/icons/usersIcon.jsx'
import CalendarAddIcon from '@/assets/icons/calendarAddIcon.jsx'
import ScheduleIcon from '@/assets/icons/calendarIcon.jsx'
import PlacesIcon from '@/assets/icons/placesIcon.jsx'
import OpenBookIcon from '@/assets/icons/openBookIcon.jsx'
import HistoryIcon from '@/assets/icons/historyIcon'
import PillIcon from '@/assets/icons/pillIcon.jsx'
import ClipboardIcon from '@/assets/icons/clipboardIcon.jsx'

import Sidebar from './components/Sidebar/SideBar.jsx'
import MobileDrawer from './components/MobileDrawer/MobileDrawer.jsx'
import ProfileMenu from './components/ProfileMenu/ProfileMenu.jsx'

import styles from './Layout.module.css';

import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useState,useEffect } from 'react';

import { getCookie } from '@/utils/csrf.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';


export default function Layout() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);
    
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/profile/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao carregar usuário");
                return res.json();
            })
            .then(res => {
                setUser(res);
            })
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: 'error' });
            });
    }, []);

    const panelGroups = [
        {
            title: "Agendamento",
            items: [
                { title: "Consultas", Icon: CalendarAddIcon, link: "/appointments" },
                { title: "Agenda", Icon: ScheduleIcon, link: "/schedule" },
            ]
        },
        {
            title: "Externo",
            items: [
                { title: "Solicitações(beta)", Icon: ClipboardIcon, link: "/solicitations" },
            ]
        },
        {
            title: "Gerenciamento",
            items: [
                { title: "Pacientes", Icon: UsersIcon, link: "/clients" },
                { title: "Disciplinas", Icon: OpenBookIcon, link: "/disciplines" },
                { title: "Estagiários", Icon: MedicalInfo, link: "/workers" },
                { title: "Salas", Icon: PlacesIcon, link: "/places" },
                { title: "Procedimentos", Icon: PillIcon, link: "/treatments" },
                { title: "Histórico", Icon: HistoryIcon, link: "/history" },
            ]
        },
        //{title: "Minha Clínica", Icon: UsersIcon, dropdown: [
        //    { title: "Pacientes", link: "/schedule/new" },
        //    { title: "Estagiários", link: "/schedule/new" },
        //    { title: "Salas", link: "/schedule/new" },]},
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

    return (<>
        <div className={styles.appContainer}>
            <div className={styles.sideContent}>
                {isMobile ? (
                    <Sidebar panelGroups={panelGroups} currentPath={currentPath}
                        setSidebarExpanded = {setSidebarExpanded} sidebarExpanded={sidebarExpanded} />
                ) : (
                    <Sidebar panelGroups={panelGroups} currentPath={currentPath}
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
        {statusMessage?.message && (
            <div className={`statusMessage ${statusMessage.type}`}>
                {statusMessage.message}
            </div>
        )}
    </>);
}