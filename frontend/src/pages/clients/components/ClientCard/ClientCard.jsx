import InfoIcon from '@/assets/icons/infoIcon';
import HistoryIcon from '@/assets/icons/historyIcon';
import styles from './ClientCard.module.css';

import { React, useRef, useEffect } from 'react';

export default function ClientCard({ client, selectedClient, setSelectedClient,
        modalStatus, setModalStatus }) {
    const cardRef = useRef(null);

    useEffect(() => {
        if (selectedClient?.id === client.id && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedClient?.id, client.id]);

    return (
        <div className={styles.clientCard} ref={cardRef}>
            <div className={styles.cardHeader}>
                <p className={styles.cardName} aria-label={`${client.icon || ''} ${client.name}`}>
                    {client.icon} {client.name}
                </p>
                <div className={styles.cardButtonSection}>
                    <button className={styles.cardButton}>
                        <HistoryIcon className={styles.buttonIcon}/>
                    </button>
                    <button className={styles.cardButton} onClick={() => {setSelectedClient(client);
                            modalStatus !== null && setModalStatus("");}}>
                        <InfoIcon className={styles.buttonIcon}/>
                    </button>
                </div>
            </div>
        </div>
    )
}