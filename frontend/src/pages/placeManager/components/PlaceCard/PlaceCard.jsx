import InfoIcon from '@/assets/icons/infoIcon';
import styles from './PlaceCard.module.css';

import DeleteButton from '@/components/DeleteButton/DeleteButton';

import { React, useRef, useEffect } from 'react';

export default function PlaceCard({ place, onDelete, isOpen, setOpenCardId }) {
    const daysOfWeek = [
        { label: "Seg", value: "monday" },
        { label: "Ter", value: "tuesday" },
        { label: "Qua", value: "wednesday" },
        { label: "Qui", value: "thursday" },
        { label: "Sex", value: "friday" },
        { label: "Sáb", value: "saturday" },
        { label: "Dom", value: "sunday" },
    ];

    const cardRef = useRef(null);

    const toggleCard = () => {
        setOpenCardId(prev => (prev === place.id ? null : place.id));
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
                <p className={styles.cardName} aria-label={`${place.icon || ''} ${place.name}`}>
                    {place.icon} {place.name}
                </p>
                <div className={styles.cardButtonSection}>
                    <button className={styles.infoButton} onClick={() => toggleCard()}>
                        <InfoIcon className={styles.infoIcon}/>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className={styles.cardBody}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nome:</span>
                        <span>{place.name}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Disponibilidade:</span>
                        <div className={styles.weekOptions}>
                            {daysOfWeek.map((day) => (
                                <label key={day.value} className={styles.dayToggle}>
                                    <input type="checkbox" value={day.value} />
                                    <span>{day.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.buttonRow}>
                        <DeleteButton onClick={() => onDelete(place.id)} />
                    </div>
                </div>
            )}
        </div>
    )
}