import UsersIcon from '@/assets/icons/usersIcon';
import styles from './ClientForm.module.css'

import Navbar from '@/components/Navbar/Navbar.jsx';
import DateDropdown from '../DateDropdown/DateDropdown.jsx';
import ConfirmBackButtons from "@/components/ConfirmBackButtons/ConfirmBackButtons.jsx";

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';

function ClientForm() {
    const navItems = [
        { to: '/clients', Icon: UsersIcon, label: "Clientes" },
    ];
    
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitted  }, setError, clearErrors } = useForm({mode:'onBlur'});
    const [status, setStatus] = useState({ message: "Registre um cliente", type: "info" });

    const [days, setDays] = useState([]);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const whatsappValue = watch('whatsapp');

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

    const resetStatus = () => {
        setStatus({ message: "Registre um cliente", type: "info" });
    }

    useEffect(() => {
        fetch('/api/clients/date-options/', {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                setDays(data.days);
                setMonths(data.months);
                setYears(data.years);
            })
            .catch(() => {
                setStatus({ message: "Erro ao carregar opções de data", type: "error" });
            });
    }, []);
    
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
                setStatus({message: result.message, type: "success"});
                resetForm();
            }
        } catch (error) {
            setStatus({message: "Erro de conexão com o servidor", type: "error"});
        }
    };

    const handleError = () => {
        // setStatus({message: "Dados inválidos!", type: "error" });
        const dateOfBirth = formatDateOfBirth();
        if (!dateOfBirth) {
            setError("dateOfBirth", {type: "manual", message: "Informe a data de nascimento completa"});
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Novo Cliente</h2>
                <Navbar items={navItems}/>
            </div>
            <form onSubmit={handleSubmit(onSubmit, handleError)} className={styles.clientForm}>
                <p className={`statusMessage ${status.type}`}>{status.message}</p>
                
                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" name="name"  autoComplete="off"
                        maxLength="70" placeholder="Digite aqui"
                        className={errors.name ? styles.formInputError : 'formInput'}
                        {...register('name', { required: "O nome é obrigatório" })}/>
                    <p className="errorMessage">{errors.name?.message || " "}</p>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <input type="text" id="whatsapp" name="whatsapp" maxLength="14"
                        placeholder="(99) 9999-9999" onFocus={resetStatus}
                        className={errors.whatsapp ? styles.formInputError : 'formInput'} value={whatsappValue || ""}
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
                    <p className="errorMessage">{errors.whatsapp?.message || " "}</p>
                </div>

                <div className={styles.formGroup}>
                    <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
                    <div className={styles.dateWrapper} aria-labelledby="dobLabel">
                        <DateDropdown label={selectedDay || "Dia"} options={days} hasError={!!errors.dateOfBirth}
                            onSelect={(day) => {
                                setSelectedDay(day);
                                if (day && selectedMonth && selectedYear) {clearErrors('dateOfBirth');}
                            }}/>
                        <DateDropdown label={months[selectedMonth - 1] || "Mês"} options={months} hasError={!!errors.dateOfBirth}
                            onSelect={(name) => {
                                const monthNumber = months.indexOf(name) + 1;
                                setSelectedMonth(monthNumber);
                                if (selectedDay && monthNumber && selectedYear) {clearErrors('dateOfBirth');}
                            }}/>
                        <DateDropdown label={selectedYear || "Ano"} options={years} hasError={!!errors.dateOfBirth}
                            onSelect={(year)=> {
                                setSelectedYear(year);
                                if (selectedDay && selectedMonth && year) {clearErrors('dateOfBirth');}
                            }}/>
                    </div>
                    <p className="errorMessage">{errors.dateOfBirth?.message || " "}</p>
                </div>

                <ConfirmBackButtons containerClass={styles.buttonsContainer}/>
            </form>
        </div>
    );
}

export default ClientForm