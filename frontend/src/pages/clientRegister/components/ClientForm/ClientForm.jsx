import styles from './ClientForm.module.css'

import CustomDropdown from '../Dropdown/Dropdown.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function ClientForm() {
    const { register, handleSubmit, reset } = useForm();
    const [status, setStatus] = useState({ message: "Registre um cliente", type: "info" });
    const navigate = useNavigate();

    const [days, setDays] = useState([]);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);

    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const formatDateOfBirth = () => {
        if (!selectedYear || !selectedMonth || !selectedDay) return null;
        const mm = String(selectedMonth).padStart(2, '0');
        const dd = String(selectedDay).padStart(2, '0');
        return `${selectedYear}-${mm}-${dd}`;
    };

    const resetForm = () => {
        reset();
        setSelectedDay('');
        setSelectedMonth('');
        setSelectedYear('');
    };

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
        const payload = { ...data, dateOfBirth };
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
            } else {
                setStatus({message: "Dados inválidos!", type: "error"});
            }
        } catch (error) {
            setStatus({message: "Erro de conexão com o servidor", type: "error"});
        }
    };

    const handleError = () => {
        setStatus({message: "Dados inválidos!", type: "error" });
    };

    return (
        <div className={styles.mainWrapper}>
            <h2>Registrar Cliente</h2>
            <form onSubmit={handleSubmit(onSubmit, handleError)} className={styles.clientForm}>
                <p className={`statusMessage ${status.type}`}>{status.message}</p>

                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" name="name" className="formInput"
                        autoComplete="off" maxLength="70" placeholder="Digite aqui"
                        {...register('name', { required: true })}/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <input type="text" id="whatsapp" name="whatsapp" className="formInput"
                        maxLength="20" placeholder="Digite aqui"
                        {...register('whatsapp', {required: true, minLength: {value: 12}})}/>
                </div>

                <div className={styles.formGroup}>
                    <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
                    <div className={styles.dateWrapper} aria-labelledby="dobLabel">
                        <CustomDropdown label={selectedDay || "Dia"} options={days} onSelect={setSelectedDay}/>
                        <CustomDropdown label={selectedMonth || "Mês"} options={months} onSelect={(name) => {
                            const monthNumber = months.indexOf(name) + 1; setSelectedMonth(monthNumber);}}/>
                        <CustomDropdown label={selectedYear || "Ano"} options={years} onSelect={setSelectedYear}/>
                    </div>
                </div>
                
                <div className={styles.buttonsContainer}>
                    <input type="submit" name="registrar" value="Registrar" className={styles.formButton}/>
                    <button type="button" onClick={() => navigate('/dashboard')} className={styles.formButton}>Voltar</button>
                </div>
            </form>
        </div>
    );
}

export default ClientForm