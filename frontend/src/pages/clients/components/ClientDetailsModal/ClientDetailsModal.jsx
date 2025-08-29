import XIcon from '@/assets/icons/xIcon';
import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';
import styles from './ClientDetailsModal.module.css';

import Modal from '@/components/Modal/Modal';
import ModalButton from '@/components/ModalButton/ModalButton.jsx';
import DateInput from '../DateInput/DateInput';

import { useState, useEffect } from 'react';


export default function ClientDetailsModal({ client, onDelete, isOpen, onClose, onUpdate}) {

    const [isEditing, setIsEditing] = useState(false);
    
    const [editedName, setEditedName] = useState(client.name);
    const [editedWhatsapp, setEditedWhatsapp] = useState(client.whatsapp);

    const displayDate = (isoDate) => {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-');
        return `${d}/${m}/${y}`;
    };

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);
    useEffect(() => {
        if (client?.dateOfBirth) {
            const dob = new Date(client.dateOfBirth);
            setSelectedDay(dob.getDate());
            setSelectedMonthLabel(
                dob.toLocaleString("default", { month: "long" })
            );
            setSelectedYear(dob.getFullYear());
        }
    }, [client]);

    const [editedDateOfBirth, setEditedDateOfBirth] = useState(displayDate(client.dateOfBirth));
    const [editedObservation, setEditedObservation] = useState(client.observation || "");

    const handleSave = () => {
        const updatedFields = {};
        if (editedName !== client.name) {
            updatedFields.name = editedName;
        }
        if (normalizePhone(editedWhatsapp)  !== normalizePhone(client.whatsapp)) {
            updatedFields.whatsapp = editedWhatsapp;
        }
        const normalizedEditedDate = normalizeDate(editedDateOfBirth);
        if (normalizedEditedDate !== client.dateOfBirth) {
            updatedFields.dateOfBirth = normalizedEditedDate;
            setEditedDateOfBirth(displayDate(updatedFields.dateOfBirth));
        }
        if (editedObservation !== client.observation) {
            updatedFields.observation = editedObservation;
        }
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: client.id, ...updatedFields });
        }
        setIsEditing(false);
    };

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

    const calculateAge = (dateOfBirth) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    return (
        <Modal title={isEditing ? "Edição do Paciente" : "Detalhes do Paciente"} isOpen={isOpen} onClose={onClose}>
            <div className={styles.clientForm}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" placeholder=" " value={editedName}
                        className={`formInput ${!isEditing ? "readOnly": ""}`} readOnly={!isEditing}
                        onChange={(e) => setEditedName(e.target.value)}/>
                    <label htmlFor="name">Nome Completo</label>
                </div>

                <div className="inputContainer">
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" " readOnly={!isEditing}
                        className={`formInput ${!isEditing ? "readOnly": ""}`} value={editedWhatsapp || ""}
                        onChange={(e) => {setEditedWhatsapp(formatPhone(e.target.value));}}/>
                    <label htmlFor="whatsapp">WhatsApp</label>
                </div>
                
                <DateInput onDateChange={setEditedDateOfBirth} isReadOnly={!isEditing}
                        selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonthLabel={selectedMonthLabel}
                        setSelectedMonthLabel={setSelectedMonthLabel} selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>

                <div className="inputContainer">
                    <textarea  id="observations" name="observations" autoComplete="off" readOnly={!isEditing}
                        maxLength="200" placeholder=" " className={`formInput formTexarea ${!isEditing ? "readOnly": ""}`}
                        onChange={(e) => setEditedObservation(e.target.value)} value={editedObservation}/>
                    <label htmlFor="observations">Observações</label>
                    <span className={`textareaCounter ${!isEditing ? "readOnly": ""}`}>{editedObservation.length}/200</span>
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
                            setEditedDateOfBirth(displayDate(client.dateOfBirth));}}/>
                    </div>)}
            </div>
            <ModalButton Icon={XIcon} variant="close" onClick={onClose}/>
        </Modal>
    );
}