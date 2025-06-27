import styles from './ScheduleForm.module.css'

import SearchDropdown from '../SearchDropdown/SearchDropdown.jsx';
import SchedulingTable from '../SchedulingTable/SchedulingTable.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';
import { clientsFetch } from '../../utils/clientsFetch.js';
import { roomsFetch } from '../../utils/roomsFetch.js';


function ScheduleForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({mode:'onBlur'});
    const [status, setStatus] = useState({ message: "Registre um atendimento", type: "info" });
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [scheduledDay, setScheduledDay] = useState(null);

    const [selectedIndexes, setSelectedIndexes] = useState(new Set());
    
    useEffect(() => {
        clientsFetch() // Fetching for rendering clients in the dropdown.
            .then(data => setClients(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
        roomsFetch() // Fetching for rendering rooms in the dropdown.
            .then(data => setRooms(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    useEffect(() => {
        if (startTime && endTime && scheduledDay) {
            const scheduleData = {
                day: scheduledDay,
                start: startTime,
                end: endTime,
            };
            setValue("schedule", scheduleData);
            clearErrors("schedule");
        }
    }, [startTime, endTime, scheduledDay, setValue, clearErrors]);

    const resetForm = () => {
        reset(); // Reset from the react-hook-form.
        setSelectedClient(null);
        setSelectedRoom(null);
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setSelectedIndexes(new Set());
    };

    const onSubmit = async (data) => {
        const { selectedClient, selectedRoom, schedule } = data;

        if (!selectedClient) {setError("client", {type: "manual", message: "Selecione um cliente"});}
        if (!selectedRoom) {setError("room", {type: "manual", message: "Selecione uma sala"});}
        if (!schedule || !schedule.day || !schedule.start || !schedule.end) {
            setError("schedule", { type: "manual", message: "Selecione um horário válido" });
        }
        if (!selectedClient || !selectedRoom || !schedule?.day || !schedule?.start || !schedule?.end) {
            return;
        }

        const payload = {
            clientId: selectedClient.id,
            roomId: selectedRoom.id,
            startTime: `${schedule.day}T${schedule.start}`,
            endTime: `${schedule.day}T${schedule.end}`
        };
        if (data.note && data.note.trim() !== "") {
            payload.note = data.note.trim();
        }
        console.log(payload);
        try {
            const response = await fetch('/api/appointments/new/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (response.ok) {
                setStatus({ message: result.message || "Agendamento confirmado!", type: "success" });
                resetForm();
            } else {
                setStatus({ message: result.message || "Erro ao agendar", type: "error" });
            }
        } catch (error) {
            console.error("Erro real:", error);
            setStatus({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <h2>Agendamento</h2>
            <p className={`statusMessage ${status.type}`}>{status.message}</p>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.scheduleForm}>
                <div className={styles.inputsWrapper}>
                    <div className={styles.formGroup}>
                        <SearchDropdown options={clients} selectedOption={selectedClient}
                            hasError={!!errors.client} onSelect={(client) => {
                                if (!client) return;
                                setSelectedClient(client);
                                clearErrors('client');
                                setValue('selectedClient', client);
                            }}/>
                        <p className="errorMessage">{errors.client?.message || " "}</p>
                    </div>
                    <div className={styles.formGroup}>
                        <SearchDropdown options={rooms} selectedOption={selectedRoom} hasError={!!errors.room}
                            labels = {{label: 'Selecione a sala', optionName : 'Selecione uma sala',
                                placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}
                            onSelect={(room) => {
                                if (!room) return;
                                setSelectedRoom(room);
                                clearErrors('room');
                                setValue('selectedRoom', room);
                            }}/>
                        <p className="errorMessage">{errors.room?.message || " "}</p>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="note">Notas</label>
                        <textarea id="note" name="note" rows={5} className={`formInput ${styles.formTextarea}`}
                            {...register('note')} placeholder="Notas opcionais aqui"/>
                    </div>
                </div>

                <div className={styles.hoursWrapper}>
                    <SchedulingTable hasError={!!errors.schedule}
                        startTime={startTime} endTime={endTime}
                        setStartTime={setStartTime} setEndTime={setEndTime}
                        scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
                        selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}/>
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