import styles from './AppointmentCard.module.css';

import { useRef } from 'react';

import { useTime } from '../../hooks/useTime';

export default function AppointmentCard({ appointment, labelColor, setSelectedAppointment }) {
    const now = useTime(5000);
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    let statusClass = '';
    if (now < start) {
        statusClass = styles.notStarted;
    } else if (now > end) {
        statusClass = styles.ended;
    } else {
        statusClass = styles.started;
    }

    const cardRef = useRef(null);

    const formatDateRange = (startIso, endIso) => {
        const start = new Date(startIso);
        const end = new Date(endIso);
        const weekday = start.toLocaleDateString('pt-BR', {
            weekday: 'short',
        }).replace('.', '');

        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        const datePart = start.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        const startTime = start.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        const endTime = end.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
        return `${capitalizedWeekday}, ${datePart} · ${startTime}-${endTime}`;
    }

    return (
        <div className={`${styles.appointmentCard} ${statusClass}`} ref={cardRef} onClick={() => setSelectedAppointment(appointment)}>
            <div className={styles.cardHeader}>
                <div className={styles.cardColorLabel} style={{ backgroundColor: labelColor }}/>

                <div className={styles.cardTextSection}>
                    <p className={styles.cardName}>{appointment.client.name.split(' ')[0]} · {appointment.place.name} {appointment.place.icon}</p>
                    <p className={styles.cardDeets}>{formatDateRange(appointment.startTime, appointment.endTime)}</p>
                </div>
                <div className={styles.cardButtonSection}>

                </div>
            </div>
        </div>
    )
}