import XIcon from '@/assets/icons/xIcon';
import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon.com';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';
import styles from './ClientModal.module.css';

import ModalButton from '@/components/ModalButton/ModalButton.jsx';

import { useRef, useState, useEffect } from 'react';

export default function ClientModal({ closeOnClickOutside=true, client, onDelete, onClose, onUpdate, modalStatus}) {
    const modalRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    
    const [editedName, setEditedName] = useState(client.name);
    const [editedWhatsapp, setEditedWhatsapp] = useState(client.whatsapp);
    const [editedDateOfBirth, setEditedDateOfBirth] = useState(client.dateOfBirth);

    const handleSave = () => {
        const updatedFields = {};
        if (editedName !== client.name) {
            updatedFields.name = editedName;
        }
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ ...client, ...updatedFields });
        }
        setIsEditing(false);
    };

    useEffect(() => { // For outside click = close handling.
        if (!closeOnClickOutside) return;
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [closeOnClickOutside, onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <h2>Detalhes do Cliente</h2>
                <p className={styles.statusMessage}>{modalStatus}</p>
                <div className={styles.infoContent}>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nome:</span>
                        {isEditing ? (
                            <>
                                <input type="text" value={editedName} className={styles.input}
                                    onChange={(e) => setEditedName(e.target.value)} />
                            </>
                        ) : (<>
                            <span>{client.name}</span>
                        </>)}
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>WhatsApp:</span>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={editedWhatsapp}
                                className={styles.input}
                                onChange={(e) => setEditedWhatsapp(e.target.value)}
                            />
                        ) : (
                            <span>{client.whatsapp}</span>
                        )}
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nascimento:</span>
                        {isEditing ? (
                            <input
                                type="date"
                                value={editedDateOfBirth}
                                className={styles.input}
                                onChange={(e) => setEditedDateOfBirth(e.target.value)}
                            />
                        ) : (
                            <span>{client.dateOfBirth}</span>
                        )}
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <ModalButton Icon={TrashCan} onClick={onDelete} variant="delete"/>
                    {!isEditing ? (
                        <ModalButton Icon={EditIcon} onClick={() => setIsEditing(true)} variant="edit"/> 
                    ) : (<div className={styles.editButtonsRow}>
                            <ModalButton Icon={SaveIcon} onClick={() => handleSave()} variant="save"/> 
                            <ModalButton Icon={CancelIcon} variant="default" onClick={() => {
                                setIsEditing(false);
                                setEditedName(client.name);}}/>
                        </div>)}
                </div>
                <ModalButton Icon={XIcon} variant="close" onClick={onClose}/>
            </div>
        </div>
    );
}