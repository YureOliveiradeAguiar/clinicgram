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
        if (normalizePhone(editedWhatsapp)  !== normalizePhone(client.whatsapp)) {
            updatedFields.whatsapp = editedWhatsapp;
        }
        console.log("client.dateOfBirth: ", client.dateOfBirth);
        //console.log("editedDateOfBirth: ", editedDateOfBirth);
        if (editedDateOfBirth !== formatDate(client.dateOfBirth)) {
            updatedFields.dateOfBirth = normalizeDate(editedDateOfBirth);
            console.log(normalizeDate(editedDateOfBirth));
        }
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: client.id, ...updatedFields });
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

    const formatPhone = (value) => {
        if (!value) return "";
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 2) {
            return `(${cleaned}`;
        } else if (cleaned.length <= 6) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
        } else if (cleaned.length <= 10) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
        } else {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
        }
    };
    const formatDate = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 8);
        if (digits.length <= 2) {
            return digits;
        } else if (digits.length <= 4) {
            return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        } else {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        }
    };

    const normalizePhone = (formatted) => {
        if (!formatted) return "";
        const cleaned = formatted.replace(/\D/g, '');
        const ddd = cleaned.slice(0, 2);
        let number = cleaned.slice(2);
        if (number.length === 8 && number[0] !== '9') {
            number = '9' + number;
        }
        return `55${ddd}${number}`; // WhatsApp expects country code + DDD + number.
    }
    const normalizeDate = (dateStr) => {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length !== 3) return null;
        const [day, month, year] = parts;
        return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

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
                            <input type="tel" value={editedWhatsapp} className={styles.input} maxLength={14}
                                    placeholder="(99) 9999-9999"
                                    onChange={(e) => {setEditedWhatsapp(formatPhone(e.target.value));}}/>
                        ) : (
                            <span>{client.whatsapp}</span>
                        )}
                    </div>
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Nascimento:</span>
                        {isEditing ? (
                            <input type="text" value={editedDateOfBirth} className={styles.input}
                                    onChange={(e) => {setEditedDateOfBirth(formatDate(e.target.value));}}/>
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
                                setEditedName(client.name);
                                setEditedWhatsapp(client.whatsapp);
                                setEditedDateOfBirth(client.dateOfBirth);}}/>
                        </div>)}
                </div>
                <ModalButton Icon={XIcon} variant="close" onClick={onClose}/>
            </div>
        </div>
    );
}