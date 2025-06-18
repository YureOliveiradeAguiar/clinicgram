import styles from './ClientForm.module.css'

import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

function ClientForm() {
    const navigate = useNavigate();
    const [statusMessage, setStatusMessage] = useState("Registre um cliente");

    const BirthDateDropdowns = () => {
        const [birthDate, setBirthDate] = useState({
            day: '',
            month: '',
            year: '',
        });
    }

    const onSubmit = async (data) => {

    }

    return (
        <div className={styles.mainWrapper}>
            <h2>Registrar Cliente</h2>
            <form className={styles.clientForm}>
                <p id={styles.statusMessage}>{statusMessage}</p>

                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo</label>
                    <input type="text" id="name" name="name" className="formInput"
                        maxLength="100" placeholder="Digite aqui"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="whatsapp">WhatsApp</label>
                    <input type="text" id="whatsapp" name="whatsapp" className="formInput"
                        maxLength="100" placeholder="Digite aqui"/>
                </div>

                <div className={styles.formGroup}>
                    <p id="dobLabel" className="fieldLabel">Data de Nascimento</p>
                    <div className="dateWrapper" aria-labelledby="dobLabel">
                        <select name="day" value={birthDate.day}>
                            <option value="">Dia</option>
                            {days.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        <select name="month" value={birthDate.month}>
                            <option value="">Mês</option>
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>{m.name}</option>
                            ))}
                        </select>
                        <select name="year" value={birthDate.year}>
                            <option value="">Ano</option>
                            {years.map((y) => (
                              <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
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