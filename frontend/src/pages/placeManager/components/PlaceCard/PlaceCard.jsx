import InfoIcon from '@/assets/icons/infoIcon';
import HistoryIcon from '@/assets/icons/historyIcon';
import styles from './PlaceCard.module.css';

import { React, useRef, useEffect } from 'react';

export default function PlaceCard({ place, selectedPlace, setSelectedPlace,
        modalStatus, setModalStatus }) {
    // const daysOfWeek = [
    //     { label: "Seg", value: "monday" },
    //     { label: "Ter", value: "tuesday" },
    //     { label: "Qua", value: "wednesday" },
    //     { label: "Qui", value: "thursday" },
    //     { label: "Sex", value: "friday" },
    //     { label: "Sáb", value: "saturday" },
    //     { label: "Dom", value: "sunday" },
    // ];

    const cardRef = useRef(null);

    useEffect(() => {
        if (selectedPlace?.id === place.id && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedPlace?.id, place.id]);

    return (
        <div className={styles.placeCard} ref={cardRef}>
            <div className={styles.cardHeader}>
                <p className={styles.cardName} aria-label={`${place.icon || ''} ${place.name}`}>
                    {place.icon} {place.name}
                </p>
                <div className={styles.cardButtonSection}>
                    <button className={styles.cardButton} style={{opacity:0.1, cursor:'default',}}>
                        <HistoryIcon className={styles.buttonIcon}/>
                    </button>
                    <button className={styles.cardButton} onClick={() => {setSelectedPlace(place);
                            modalStatus !== null && setModalStatus("");}}>
                        <InfoIcon className={styles.buttonIcon}/>
                    </button>
                </div>
            </div>
        </div>
    )
}