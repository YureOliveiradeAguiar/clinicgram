import { useState, useEffect } from 'react';

import PhoneInput from '@/components/TelephoneInput/PhoneInput';
import DetailsModal from '@/components/DetailsModal/DetailsModal';
import DateInput from '../DateInput/DateInput';

import usePatchFields from '@/hooks/usePatchFields.jsx';

import calculateAge from './utils/calculateAge';


export default function ClientDetailsModal({ client, onDelete, isOpen, onClose, onUpdate, setStatusMessage}) {
    const contextFields = {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        password: "",
        whatsapp: client.whatsapp,
        dateOfBirth: client.dateOfBirth,
        observation: client.observation || "",
    };
    const { fields, errors, setField, validateAll, getUpdatedFields, resetFields } = usePatchFields(contextFields);

    const [isEditing, setIsEditing] = useState(false);

//=============================================Date dropdown handling===========================================
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

//============================================Selected Phone handling============================================
    const [phone, setPhone] = useState({ country: '', area: '', number: '' });

    const setPhoneInputFields = () => {
        if (client.whatsapp) {
            const [countryCode, areaCode, phoneNumber] = client.whatsapp.split(" ");
            setPhone({
                country: countryCode ? `+${countryCode}` : '',
                area: areaCode || '',
                number: phoneNumber || '',
            });
        }
    };

//=============================================Setting of client data=============================================
    useEffect(() => {
        setDateInputFields();
        setPhoneInputFields();
    }, [client]);

//==================================================Saving logic==================================================
    const handleSave = () => {
        const allValid = validateAll();
        if (!allValid) {
            setStatusMessage({message: "Dados inválidos!", type: "error" });
            return;
        }
        const updatedFields = getUpdatedFields(fields, client);
        console.log("updatedFields:: ", updatedFields);
        if (Object.keys(updatedFields).length > 0) {
            onUpdate({ id: client.id, ...updatedFields });
        }
        setIsEditing(false);
    };

    const resetModal = () => {
        setIsEditing(false);
        resetFields();
        setDateInputFields();
        setPhoneInputFields();
    }
//================================================================================================================

    return (
        <DetailsModal title={isEditing ? "Edição do Paciente" : "Detalhes do Paciente"} isOpen={isOpen}
            isEditing={isEditing} setIsEditing={setIsEditing}
            onSave={handleSave} onCancel={resetModal} onDelete={onDelete} onClose={onClose}
        >
            <div className={"standardFormulary"}>
                <div className="inputContainer">
                    <input type="text" id="firstName" name="firstName" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.firstName}
                        className={`formInput ${!isEditing ? "readOnly": errors.firstName ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("firstName",(e.target.value))}/>
                    <label htmlFor="firstName">Nome*</label>
                    <p className="errorMessage">{errors.firstName || ""}</p>
                </div>
                <div className="inputContainer">
                    <input type="text" id="lastName" name="lastName" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.lastName}
                        className={`formInput ${!isEditing ? "readOnly": errors.lastName ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("lastName",(e.target.value))}/>
                    <label htmlFor="lastName">Sobrenome*</label>
                    <p className="errorMessage">{errors.lastName || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="email" name="email" autoComplete="off"
                        maxLength="70" placeholder=" " value={fields.email}
                        className={`formInput ${!isEditing ? "readOnly": errors.email ? "formInputError" : ""}`} readOnly={!isEditing}
                        onChange={(e) => setField("email",(e.target.value))}/>
                    <label htmlFor="email">Email*</label>
                    <p className="errorMessage">{errors.email || ""}</p>
                </div>

                <div className="inputContainer">
                    <input type="password" id="password" name="password" autoComplete="new-password" maxLength={128} placeholder="" 
                        value={fields.password} className={`formInput ${!isEditing ? "readOnly" : errors.password ? "formInputError" : ""}`}
                        readOnly={!isEditing} onChange={(e) => setField("password", e.target.value)}
                    />
                    <label htmlFor="password">Nova Senha</label>
                    <p className="errorMessage">{errors.password || ""}</p>
                </div>

                <PhoneInput phone={phone} setPhone={setPhone} onChange={(newPhone) => setField('whatsapp', newPhone)}
                    isEditing={isEditing} errors={errors.whatsapp}
                />

                <DateInput fieldLabel={`Data de nascimento (${calculateAge(fields.dateOfBirth)})`}
                    hasError={errors.dateOfBirth} onDateChange={(newDate) => setField("dateOfBirth", newDate)} isReadOnly={!isEditing}
                    selectedDay={selectedDay} setSelectedDay={setSelectedDay} selectedMonthLabel={selectedMonthLabel}
                    setSelectedMonthLabel={setSelectedMonthLabel} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}
                    selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                />

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
//<div className="inputContainer">
//   <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" " readOnly={!isEditing}
//       className={`formInput ${!isEditing ? "readOnly": errors.whatsapp ? "formInputError" : ""}`} value={fields.whatsapp}
//       onChange={(e) => {setField("whatsapp", formatPhone(e.target.value));}}/>
//   <label htmlFor="whatsapp">WhatsApp</label>
//   <p className="errorMessage">{errors.whatsapp || ""}</p>
///div>