import styles from './ScheduleForm.module.css'

import SearchDropdown from '../SearchDropdown/SearchDropdown.jsx';
import ScheduleTable from '../ScheduleTable/ScheduleTable.jsx';
import { generateDays, generateHours, generateScheduleMatrix } from '@/utils/generateScheduleMatrix';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function ScheduleForm() {
    const navigate = useNavigate();

    const [status, setStatus] = useState({ message: "Registre um atendimento", type: "info" });

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const dias = generateDays();
    const horarios = generateHours();
    const indexedCells = generateScheduleMatrix(dias, horarios);

    
    useEffect(() => {
        // Fetching for rendering clients in the dropdown.
        fetch('/api/clients/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar clientes');
            return res.json();
        })
        .then(data => {
            setClients(data);
        })
        .catch(() => {
            setStatus({message: "Erro de conexão com o servidor", type: "error" });
        });
        // Fetching for rendering rooms in the dropdown.
        fetch('/api/rooms/list/', {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: 'include',
        })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar salas');
            return res.json();
        })
        .then(data => {
            setRooms(data);
        })
        .catch(() => {
            setStatus({message: "Erro de conexão com o servidor", type: "error" });
        });
    }, []);

    return (
        <div className={styles.mainWrapper}>
            <h2>Agendamento</h2>
            <p className={`statusMessage ${status.type}`}>{status.message}</p>
            <form className={styles.scheduleForm}>
                <div className={styles.formWrapper}>
                    <div className={styles.inputsWrapper}>
                        <div className={styles.clientWrapper}>
                            <SearchDropdown options={clients} selectedOption={selectedClient} onSelect={setSelectedClient}/>
                            <p className="errorMessage"></p>
                        </div>
                        <div className={styles.roomWrapper}>
                            <SearchDropdown options={rooms} selectedOption={selectedRoom} onSelect={setSelectedRoom}
                                labels = {{label: 'Selecione a sala', optionName : 'Selecione uma sala',
                                placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}/>
                            <p className="errorMessage"></p>
                        </div>
                    </div>
                    <div className={styles.hoursWrapper}>
                        <ScheduleTable id="hoursScheduling" dias={dias} indexedCells={indexedCells}/>
                        <p className="errorMessage"></p>
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

export default ScheduleForm