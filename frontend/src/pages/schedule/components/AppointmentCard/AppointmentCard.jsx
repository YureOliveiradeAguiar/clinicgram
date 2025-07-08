import ArrowDownIcon from '@/assets/icons/arrowDown.jsx'
import ArrowUpIcon from '@/assets/icons/arrowUp.jsx'
import styles from './AppointmentCard.module.css';

import { useRef, useEffect } from 'react';

export default function AppointmentCard({ appointment, onDelete, isOpen, setOpenCardId }) {
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

    function formatDateRange(startIso, endIso) {
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
        <div className={styles.appointmentCard} ref={cardRef}>
            <div className={styles.cardHeader}>
                <p className={styles.cardName}>{formatDateRange(appointment.startTime, appointment.endTime)}</p>
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