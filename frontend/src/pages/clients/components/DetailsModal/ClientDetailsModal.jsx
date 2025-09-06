import DetailsModal from '@/components/DetailsModal/DetailsModal';
import DateInput from '../DateInput/DateInput';

import { useState, useEffect } from 'react';

import { formatPhone } from "@/utils/phoneUtils";
import calculateAge from './utils/calculateAge';

import usePatchFields from '@/hooks/usePatchFields.jsx';


export default function ClientDetailsModal({ client, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        name: client.name,
        whatsapp: client.whatsapp,
        dateOfBirth: client.dateOfBirth,
        observation: client.observation || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);

    const setDateInputFields = () => {
        if (client.dateOfBirth) {
            const [year, month, day] = client.dateOfBirth.split("-");
            setSelectedDay(Number(day));
            setSelectedMonth(Number(month));
            setSelectedMonthLabel(new Date(year, month - 1).toLocaleString("default", { month: "long" }));
            setSelectedYear(Number(year));
        }
    }
    useEffect(() => {
        setDateInputFields();
    }, [client]);

    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, client);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: client.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        setDateInputFields();
    }

    return (
        <DetailsModal title={isEditing ? "Edição do Paciente" : "Detalhes do Paciente"} isOpen={isOpen}
                isEditing={isEditing} setIsEditing={setIsEditing}
                onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}>
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.name}
                        className={`formInput ${!isEditing ? "readOnly": errors.name ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("name",(e.target.value))}/>
                    <label htmlFor="name">Nome Completo</label>
                    <p className="errorMessage">{errors.name || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" " readOnly={!isEditing}
                        className={`formInput ${!isEditing ? "readOnly": errors.whatsapp ? "formInputError" : ""}`} value={fields.whatsapp}
                        onChange={(e) => {setField("whatsapp", formatPhone(e.target.value));}}/>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <p className="errorMessage">{errors.whatsapp || ""}</p>
                </div>
                
                <DateInput fieldLabel={`Data de nascimento (${calculateAge(fields.dateOfBirth)})`}
                        hasError={errors.dateOfBirth} onDateChange={(newDate) => setField("dateOfBirth", newDate)} isReadOnly={!isEditing}
                        selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonthLabel={selectedMonthLabel}
                        setSelectedMonthLabel={setSelectedMonthLabel} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                        selectedYear={selectedYear} setSelectedYear={setSelectedYear}/>

                <div className="inputContainer">
                    <textarea  id="observations" name="observations" autoComplete="off" readOnly={!isEditing}
                        maxLength="200" placeholder=" " className={`formInput formTexarea ${!isEditing ? "readOnly": ""}`}
                        onChange={(e) => setField("observation", e.target.value)} value={fields.observation}/>
                    <label htmlFor="observations">Observações</label>
                    <span className={`textareaCounter ${!isEditing ? "readOnly": ""}`}>{fields.observation.length}/200</span>
                </div>
            </div>
        </DetailsModal>
    );
}