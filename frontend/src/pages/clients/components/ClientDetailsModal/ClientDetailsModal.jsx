import TrashCan from '@/assets/icons/trashCan';
import EditIcon from '@/assets/icons/editIcon';
import SaveIcon from '@/assets/icons/saveIcon';
import CancelIcon from '@/assets/icons/cancelIcon';

import DetailsModal from '@/components/DetailsModal/DetailsModal';
import ModalButton from '@/components/ModalButton/ModalButton.jsx';
import DateInput from '../DateInput/DateInput';

import { useState, useEffect } from 'react';


export default function ClientDetailsModal({ client, onDelete, isOpen, onClose, onUpdate}) {

    const [isEditing, setIsEditing] = useState(false);
    
    const [editedName, setEditedName] = useState(client.name);
    const [editedWhatsapp, setEditedWhatsapp] = useState(client.whatsapp);

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);
    useEffect(() => {
        if (client.dateOfBirth) {
            const [year, month, day] = client.dateOfBirth.split("-");
            setSelectedDay(Number(day));
            setSelectedMonth(Number(month));
            setSelectedMonthLabel(new Date(year, month - 1).toLocaleString("default", { month: "long" }));
            setSelectedYear(Number(year));
        }
    }, [client]);

    const [editedDateOfBirth, setEditedDateOfBirth] = useState(client.dateOfBirth);
    const [editedObservation, setEditedObservation] = useState(client.observation || "");

    const handleSave = () => {
        const updatedFields = {};
        if (editedName !== client.name) {
            updatedFields.name = editedName;
        }
        if (normalizePhone(editedWhatsapp)  !== normalizePhone(client.whatsapp)) {
            updatedFields.whatsapp = editedWhatsapp;
        }
        if (editedDateOfBirth !== client.dateOfBirth) {
            updatedFields.dateOfBirth = editedDateOfBirth;
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

    const resetModal = () => {
        setIsEditing(false);
        setEditedName(client.name);
        setEditedWhatsapp(client.whatsapp);
        setEditedDateOfBirth(client.dateOfBirth);
        setEditedObservation(client.observation || "");
    }

    return (
        <DetailsModal title={isEditing ? "Edição do Paciente" : "Detalhes do Paciente"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
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
                
                <DateInput onDateChange={(newDate) => setEditedDateOfBirth(newDate)} isReadOnly={!isEditing}
                        selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonthLabel={selectedMonthLabel}
                        setSelectedMonthLabel={setSelectedMonthLabel} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>

                <div className="inputContainer">
                    <textarea  id="observations" name="observations" autoComplete="off" readOnly={!isEditing}
                        maxLength="200" placeholder=" " className={`formInput formTexarea ${!isEditing ? "readOnly": ""}`}
                        onChange={(e) => setEditedObservation(e.target.value)} value={editedObservation}/>
                    <label htmlFor="observations">Observações</label>
                    <span className={`textareaCounter ${!isEditing ? "readOnly": ""}`}>{editedObservation.length}/200</span>
                </div>
            </div>
        </DetailsModal>
    );
}
/*
<div className={styles.buttonRow}>
                <ModalButton Icon={TrashCan} onClick={onDelete} variant="delete"/>
                {!isEditing ? (
                    <ModalButton Icon={EditIcon} onClick={() => setIsEditing(true)} variant="edit"/> 
                ) : (<div className={styles.editButtonsRow}>
                        <ModalButton Icon={SaveIcon} onClick={() => handleSave()} variant="save"/> 
                        <ModalButton Icon={CancelIcon} variant="default" onClick={() => resetModal()}/>
                    </div>)}
            </div>
*/