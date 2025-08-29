import SaveIcon from '@/assets/icons/saveIcon';
import styles from './ClientRegisterModal.module.css'

import Modal from '@/components/Modal/Modal';
import ModalButton from '@/components/ModalButton/ModalButton';
import DateDropdown from '../DateDropdown/DateDropdown.jsx';

import { useState } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';


export default function ClientRegisterModal({ isOpen, onSuccess, onClose, setStatusMessage }) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted  }, setError, clearErrors } = useForm({mode:'onBlur'});

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedMonthLabel, setSelectedMonthLabel] = useState("");
    const [selectedYear, setSelectedYear] = useState(null);

    const whatsappValue = watch('whatsapp');

    const observationsValue = watch('observations') || '';

    const formatDateOfBirth = () => {
        if (!selectedYear || !selectedMonth || !selectedDay) return null;
        const mm = String(selectedMonth).padStart(2, '0');
        const dd = String(selectedDay).padStart(2, '0');
        return `${selectedYear}-${mm}-${dd}`;
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
    };

    const resetForm = () => {
        reset();
        setSelectedDay('');
        setSelectedMonth('');
        setSelectedYear('');
    };
    
    const onSubmit = async (data) => {
        const dateOfBirth = formatDateOfBirth();
        const rawPhone = normalizePhone(data.whatsapp);

        if (!dateOfBirth) {
            setError("dateOfBirth", {type: "manual", message: "Informe a data de nascimento completa"});
        }
        if (!rawPhone) {
            setError("whatsapp", {type: "manual", message: "WhatsApp é obrigatório"});
        }

        const payload = { ...data, rawPhone, dateOfBirth };
        try {
            const response = await fetch('/api/clients/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')},
                credentials: 'include',
                body: JSON.stringify(payload)});

            const result = await response.json();
            if (response.ok) {
                setStatusMessage({message: result.message, type: "success"});
                resetForm();
                onSuccess(result.client);
            } else {
                setStatusMessage({ message: "Erro ao registrar cliente", type: "error" });
            }
        } catch (error) {
            setStatusMessage({message: "Erro de conexão com o servidor", type: "error"});
        }
    };

    const handleError = () => {
        setStatusMessage({message: "Dados inválidos!", type: "error" });
        const dateOfBirth = formatDateOfBirth();
        if (!dateOfBirth) {
            setError("dateOfBirth", {type: "manual", message: "Informe a data de nascimento completa"});
        }
    };

    return (
        <Modal title="Novo Paciente" isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit, handleError)} className={styles.clientForm}>
                <div className="inputContainer">
                    <input type="text" id="name" name="name" autoComplete="off"
                        maxLength="70" placeholder=" "
                        className={`formInput ${errors.name ? "formInputError" : ""}`}
                        {...register('name', { required: "O nome é obrigatório" })}/>
                    <label htmlFor="name">Nome Completo</label>
                    <p className="errorMessage">{errors.name?.message || " "}</p>
                </div>

                <div className="inputContainer">
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14" placeholder=" "
                        className={`formInput ${errors.whatsapp ? "formInputError" : ""}`} value={whatsappValue || ""}
                        {...register('whatsapp', {required: "WhatsApp é obrigatório",
                            validate: (value) => {
                                const digits = value.replace(/\D/g, '');
                                if (digits.length < 10) return "Número incompleto";
                                return true;
                        }})}
                        onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            setValue('whatsapp', formatted, { shouldValidate: isSubmitted});
                        }}/>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <p className="errorMessage">{errors.whatsapp?.message || " "}</p>
                </div>

                <div className={styles.formGroup}>
                    <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
                    <div className={styles.dateWrapper} aria-labelledby="dobLabel">
                        <DateDropdown dropdownLabel={selectedDay || "Dia"} optionType={"days"} hasError={!!errors.dateOfBirth}
                            onSelect={(day) => {
                                setSelectedDay(day);
                                if (day && selectedMonth && selectedYear) {clearErrors('dateOfBirth');}
                            }}/>
                        <DateDropdown dropdownLabel={selectedMonthLabel || "Mês"} optionType={"months"} hasError={!!errors.dateOfBirth}
                            onSelect={(monthObject) => {
                                setSelectedMonth(monthObject.value);
                                setSelectedMonthLabel(monthObject.label);
                                if (selectedDay && monthObject.value && selectedYear) {clearErrors('dateOfBirth');}
                            }}/>
                        <DateDropdown dropdownLabel={selectedYear || "Ano"} optionType={"years"} hasError={!!errors.dateOfBirth}
                            onSelect={(year)=> {
                                setSelectedYear(year);
                                if (selectedDay && selectedMonth && year) {clearErrors('dateOfBirth');}
                            }}/>
                    </div>
                    <p className="errorMessage">{errors.dateOfBirth?.message || " "}</p>
                </div>

                <div className="inputContainer">
                    <textarea  id="observations" name="observations" autoComplete="off"
                        maxLength="200" placeholder=" " className={"formInput formTexarea"}
                        {...register('observations')}/>
                    <label htmlFor="observations">Observações</label>
                    <span className='textareaCounter'>{observationsValue.length}/200</span>
                </div>

                <div className={styles.buttonSection}>
                    <ModalButton Icon={SaveIcon} variant="save" type="submit" name="registrar" buttonTitle="Registrar"/>
                </div>
            </form>
        </Modal>
    );
}