import AlertIcon from '@/assets/icons/alertSign.jsx'
import AppointsIcon from '@/assets/icons/appointsIcon';
import UserAddIcon from '@/assets/icons/userAddIcon';
import PlacesIcon from '@/assets/icons/placesIcon';
import styles from './ScheduleViewing.module.css';

import Navbar from '@/components/Navbar/Navbar.jsx';
import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable.jsx';
import AppointmentCard from '../AppointmentCard/AppointmentCard.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

import { useMemo, useState, useEffect} from 'react';

import { appointmentsFetch } from '@/utils/appointmentsFetch.js';
import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';

export default function ScheduleViewing() {
    const navItems = [
        { to: '/schedule/new', Icon: AppointsIcon, label: "Agendamento" },
        { to: '/clients/new', Icon: UserAddIcon, label: "Novo Cliente" },
        { to: '/places', Icon: PlacesIcon, label: "Salas" },
    ];

    const [status, setStatus] = useState({ message: "Selecione um horário", type: "info" });
    const [appointments, setAppointments] = useState([]);
    const [occupiedMap, setOccupiedMap] = useState(new Map());
    const [startOffset, setStartOffset] = useState(0);

    const [listMessage, setListMessage] = useState('');

    // Centralized base date info.
    const startDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + startOffset);
        return date;
    }, [startOffset]);
    const days = useMemo(() => generateDays(7, startDate), [startDate]);
    const rawMonth = startDate.toLocaleString('pt-BR', { month: 'long' });
    const monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const year = startDate.getFullYear();
    
    const times = useMemo(() => generateHours(), []);
    const matrix = useMemo(() => generateScheduleMatrix(days, times), [days, times]);

    useEffect(() => {
        appointmentsFetch() // Fetching for rendering appointments.
            .then(data => setAppointments(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    useEffect(() => {
        if (!appointments.length || !matrix.length) return;
        const map = new Map();
        for (const appt of appointments) {
            const apptIndexes = getIndexesFromTimeRange(appt.startTime, appt.endTime, matrix);
            apptIndexes.forEach(index => {
                const existing = map.get(index) || [];
                map.set(index, [...existing, appt]);
            });
        }
        setOccupiedMap(map);
        //console.log(map);
    }, [appointments, matrix]);

    // Fetching for deleting a client.
    const handleDelete = async (placeId) => {
        if (!window.confirm('Tem certeza que deseja excluir essa sala?')) return;
        try {
            const res = await fetch(`/api/places/delete/${placeId}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                setPlaces(prev => prev.filter(p => p.id !== placeId));
            } else {
                setStatus({ message: "Erro ao excluir sala", type: "error" });
            }
        } catch {
            setStatus({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    const colorPalette = ["#49ccc3ff", "#ffde58ff", "#b485ffff", "#ffab24ff",
        "#9d15a7ff", "#53b64bff", "#FF5E78", "#3C91E6",
    ];
    const appointmentColors = useMemo(() => { // Sort appointments for coloring & assigns colors
        const sortedAppointments = [...appointments].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        const colorMap = {};
        sortedAppointments.forEach((appointment, index) => {
            colorMap[appointment.id] = colorPalette[index % colorPalette.length];
        });
        return colorMap;
    }, [appointments]);

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Agenda</h2>
                <div className={styles.statusContainer}>
                    <p className={`statusMessage ${status.type}`}>{status.message}</p>
                </div>
                <Navbar items={navItems} />
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.TableWrapper}>
                    <ScheduleTable
                            setAppointments={setAppointments} setStatus={setStatus}
                            appointmentColors={appointmentColors} occupiedMap={occupiedMap}
                            days={days} times={times} indexedCells={matrix}
                            startOffset={startOffset} setStartOffset={setStartOffset}
                            monthName={monthName} year={year}/>
                </div>
                <div className={styles.appointmentList}>
                    {appointments.length > 0 ? (
                        appointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment} onDelete={handleDelete}
                                labelColor={appointmentColors[appointment.id]}/>
                    ))
                    ) : (
                        <p className="listMessage">{listMessage || 'Nenhum agendamento registrado.'}</p>
                    )}
                </div>
                <div className={styles.returnButtonContainer}>
                    <ReturnButton/>
                </div>
            </div>
        </div>
    );
}