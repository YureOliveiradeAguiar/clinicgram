import ArrowDownIcon from '@/assets/icons/arrowDown.jsx'
import ArrowUpIcon from '@/assets/icons/arrowUp.jsx'
import styles from './AppointmentCard.module.css';

import { useRef, useEffect } from 'react';

import { useTime } from '../../hooks/useTime';

export default function AppointmentCard({ appointment, onDelete, isOpen, setOpenCardId }) {
    const colorPalette = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#845EC2",
        "#00C9A7", "#FF9671", "#2C73D2", "#0081CF", "#C34A36",];

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
    const toggleCard = () => {
        setOpenCardId(prev => (prev === appointment.id ? null : appointment.id));
    };

    useEffect(() => {
        if (isOpen && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [isOpen]);

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
        <div className={`${styles.appointmentCard} ${statusClass}`} ref={cardRef}>
            <div className={styles.cardHeader}>
                <div className={styles.cardColorLabel} style={{ backgroundColor: colorPalette[appointment.id % colorPalette.length] }}/>

                <div className={styles.cardTextSection}>
                    <p className={styles.cardName}>{appointment.client.name.split(' ')[0]} · {appointment.place.name}</p>
                    <p className={styles.cardDeets}>{formatDateRange(appointment.startTime, appointment.endTime)}</p>
                </div>
                <div className={styles.cardButtonSection}>
                    <button className={styles.expandButton} onClick={() => toggleCard()}>
                        {isOpen ? (
                            <ArrowUpIcon className={styles.expandIcon} />
                        ) : (
                            <ArrowDownIcon className={styles.expandIcon} />
                        )}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className={styles.cardBody}>
                    <p>Sala registrada.</p>
                    <button className={styles.deleteButton} onClick={() => onDelete(appointment.id)}>Excluir</button>
                </div>
            )}
        </div>
    )
}