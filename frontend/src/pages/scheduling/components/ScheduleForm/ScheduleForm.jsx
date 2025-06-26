import styles from './ScheduleForm.module.css'

import SearchDropdown from '../SearchDropdown/SearchDropdown.jsx';
import SchedulingTable from '../SchedulingTable/SchedulingTable.jsx';

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';

function ScheduleForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, getValues, trigger, formState: { errors } } = useForm({mode:'onBlur'});

    const [status, setStatus] = useState({ message: "Registre um atendimento", type: "info" });

    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [scheduledDay, setScheduledDay] = useState(null);
    
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

    useEffect(() => {
        if (startTime && endTime && scheduledDay) {
            const scheduleData = { day: scheduledDay, start: startTime, end: endTime };
            setValue("schedule", scheduleData);
            trigger("schedule");
        }
    }, [startTime, endTime, scheduledDay]);

    const resetForm = () => {
        reset(); // reset react-hook-form
        setSelectedClient(null);
        setSelectedRoom(null);
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setSelectedIndexes(new Set());
    };

    const onSubmit = async (data) => {
        const { client, room, schedule } = data;

        if (!client) {
        setError("client", { type: "manual", message: "Selecione um cliente" });
        }
        if (!room) {
            setError("room", { type: "manual", message: "Selecione uma sala" });
        }
        if (!schedule || !schedule.day || !schedule.start || !schedule.end) {
            setError("schedule", { type: "manual", message: "Selecione um horário válido" });
        }
        if (!client || !room || !schedule?.day || !schedule?.start || !schedule?.end) {
            return;
        }

        const payload = {clientId: client.id, roomId: room.id,
            day: schedule.day, start: schedule.start, end: schedule.end};
        try {
            const response = await fetch('/api/schedule/new/', {
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
            setStatus({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    const handleError = () => {
        if (!getValues("client")) {
            setError("client", { type: "manual", message: "Selecione um cliente" });
        }
        if (!getValues("room")) {
            setError("room", { type: "manual", message: "Selecione uma sala" });
        }
        const schedule = getValues("schedule");
        if (!schedule?.start || !schedule?.end || !schedule?.day) {
            setError("schedule", { type: "manual", message: "Selecione um horário" });
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <h2>Agendamento</h2>
            <p className={`statusMessage ${status.type}`}>{status.message}</p>
            <form onSubmit={handleSubmit(onSubmit, handleError)} className={styles.scheduleForm}>
                <div className={styles.inputsWrapper}>
                    <div className={styles.clientWrapper}>
                        <SearchDropdown options={clients} selectedOption={selectedClient}
                            onSelect={(option) => {
                                setSelectedClient(option);
                                setValue("client", option);
                                trigger("client");
                            }}/>
                        <p className="errorMessage">{errors.client?.message || " "}</p>
                    </div>
                    <div className={styles.roomWrapper}>
                        <SearchDropdown options={rooms} selectedOption={selectedRoom}
                            labels = {{label: 'Selecione a sala', optionName : 'Selecione uma sala',
                                placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}
                            onSelect={(option) => {
                                setSelectedRoom(option);
                                setValue("room", option);
                                trigger("room");
                            }}/>
                        <p className="errorMessage">{errors.room?.message || " "}</p>
                    </div>
                </div>

                <div className={styles.hoursWrapper}>
                    <SchedulingTable startTime={startTime} endTime={endTime} scheduledDay={scheduledDay}
                        setStartTime={setStartTime} setEndTime={setEndTime} setScheduledDay={setScheduledDay}/>
                    <p className="errorMessage">{errors.schedule?.message || " "}</p>
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