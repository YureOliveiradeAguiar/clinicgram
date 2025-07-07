import ArrowDownIcon from '@/assets/icons/arrowDown.jsx'
import ArrowUpIcon from '@/assets/icons/arrowUp.jsx'
import styles from './PlaceCard.module.css';

import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlaceCard({ place, onDelete, isOpen, setOpenCardId }) {
    const navigate = useNavigate();
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
                <p className={styles.cardName}>{place.name}</p>
                <div className={styles.cardButtonSection}>
                    <button className={styles.scheduleButton} onClick={() => navigate('/scheduling')}>Agendar</button>
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
                    <p> Sala registrada há 1 ano.</p>
                    <button className={styles.deleteButton} onClick={() => onDelete(client.id)}>Excluir Sala</button>
                </div>
            )}
        </div>
    )
}