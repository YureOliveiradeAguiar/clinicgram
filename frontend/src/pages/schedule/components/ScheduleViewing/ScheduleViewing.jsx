import AlertIcon from '@/assets/icons/alertSign.jsx'
import styles from './ScheduleViewing.module.css';

import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable.jsx';
import AppointmentCard from '../AppointmentCard/AppointmentCard.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

import { useMemo, useState, useEffect} from 'react';

import { appointmentsFetch } from '@/utils/appointmentsFetch.js';
import { generateDays, generateHours, generateScheduleMatrix } from '@/utils/generateScheduleMatrix';

export default function ScheduleViewing() {
    const [status, setStatus] = useState({ message: "Selecione um horário", type: "info" });
    const [appointments, setAppointments] = useState([]);
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());
    const [startOffset, setStartOffset] = useState(0);

    const [listMessage, setListMessage] = useState('');
    const [openCardId, setOpenCardId] = useState(null);

    useEffect(() => {
        appointmentsFetch() // Fetching for rendering appointments.
            .then(data => setAppointments(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);
    
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

    const addMinutesToTime = (timeString, minutesToAdd) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + minutesToAdd);

        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    function formatDate(dateString, withWeekday = false) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Local time (not UTC).
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
        });
        if (!withWeekday) return formattedDate;
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
        return `${capitalizedWeekday}, ${formattedDate}`;
    }

    // Fetching for deleting a client.
        const handleDelete = async (placeId) => {
            if (!window.confirm('Tem certeza que deseja excluir esse sala?')) return;
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

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Agenda</h2>
                <div className={styles.statusContainer}>
                    <p className={`statusMessage ${status.type}`}>{status.message}</p>
                </div>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.TableWrapper}>
                    <ScheduleTable occupiedIndexes={occupiedIndexes}
                        days={days} times={times} indexedCells={matrix}
                        startOffset={startOffset} setStartOffset={setStartOffset}
                        monthName={monthName} year={year}/>
                </div>
                <div className={styles.appointmentList}>
                    {appointments.length > 0 ? (
                        appointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment} onDelete={handleDelete}
                                isOpen={openCardId === appointment.id} setOpenCardId={setOpenCardId}/>
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