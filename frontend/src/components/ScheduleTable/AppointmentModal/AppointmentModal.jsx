import { useRef, useEffect } from 'react';
import styles from './AppointmentModal.module.css';

export default function AppointmentModal({ appointment, onClose }) {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    function formatDate(dateString) {
        if (!dateString) return 'Data inválida';
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <h2>Detalhes do Agendamento</h2>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Cliente:</span>
                    <span>{appointment.client.name}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Local:</span>
                    <span>{appointment.place.name}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Início:</span>
                    <span>{formatDate(appointment.startTime)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Fim:</span>
                    <span>{formatDate(appointment.endTime)}</span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.label}>Nota:</span>
                    <span>{appointment.note || 'Sem notas'}</span>
                </div>

                <div className={styles.buttonRow}>
                    <button className={styles.closeButton} onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
