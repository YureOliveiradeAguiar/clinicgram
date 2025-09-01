import InfoIcon from '@/assets/icons/infoIcon';
import BarChartIcon from '@/assets/icons/barChart';
import styles from './Card.module.css';

import { useRef, useEffect } from 'react';

import ModalButton from '../ModalButton/ModalButton';

export default function Card({ children, element, selectedElement, setOpenModal, setSelectedElement }) {
    const cardRef = useRef(null);

    useEffect(() => {
        if (selectedElement?.id === element.id && cardRef.current) {
            cardRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [selectedElement?.id, element.id]);

    return (
        <div className={styles.card} ref={cardRef}>
            <div className={styles.cardHeader}>
                {children}
            </div>
            <div className={styles.cardButtonSection}>
                <ModalButton Icon={BarChartIcon} onClick={() => {setOpenModal("statistics"); setSelectedElement(element)}}/>
                <ModalButton Icon={InfoIcon} onClick={() => {setOpenModal("properties");setSelectedElement(element)}}/>
            </div>
        </div>
    )
}