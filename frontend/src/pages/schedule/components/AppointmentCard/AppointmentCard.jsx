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

    return (
        <div className={styles.clientCard} ref={cardRef}>
            <div className={styles.cardHeader}>
                <p className={styles.cardName}>{appointment.startTime}</p>
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
                    <p> Sala registrada.</p>
                    <button className={styles.deleteButton} onClick={() => onDelete(appointment.id)}>Excluir Sala</button>
                </div>
            )}
        </div>
    )
}