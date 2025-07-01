import styles from './ScheduleForm.module.css'
import { Link } from 'react-router-dom';
import ConfirmBackButtons from "@/components/ConfirmBackButtons/ConfirmBackButtons.jsx";

import SearchDropdown from '../SearchDropdown/SearchDropdown.jsx';
import SchedulingTable from '../SchedulingTable/SchedulingTable.jsx';

import { useMemo, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

import { getCookie } from '@/utils/csrf.js';
import { clientsFetch } from '../../utils/clientsFetch.js';
import { roomsFetch } from '../../utils/roomsFetch.js';
import { appointmentsFetch } from '../../utils/appointmentsFetch.js';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


function ScheduleForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({mode:'onBlur'});
    const [status, setStatus] = useState({ message: "Registre um atendimento", type: "info" });
    const navigate = useNavigate();

    const [clients, setClients] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedIndexes, setSelectedIndexes] = useState(new Set());

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [scheduledDay, setScheduledDay] = useState(null);

    const [appointments, setAppointments] = useState([]);
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());
    const days = useMemo(() => generateDays(), []);
    const times = useMemo(() => generateHours(), []);
    const matrix = useMemo(() => generateScheduleMatrix(days, times), [days, times]);
    
    useEffect(() => {
        appointmentsFetch() // Fetching for rendering appointments in the table.
            .then(data => setAppointments(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
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

    useEffect(() => { // For rendering the occupied cells based on the selected room.
        if (!selectedRoom || !appointments.length || !matrix.length) return;
        const roomAppointments = appointments.filter(
            (appt) => appt.room.id === selectedRoom.id
        );
        const indexes = new Set();
        for (const appt of roomAppointments) {
            const start = appt.startTime;
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
            // console.log(apptIndexes);
            // console.log("appt.startTime (UTC) ", appt.startTime);
            // console.log("appt.startTime (locale) ", start);
        }
        setOccupiedIndexes(indexes);
    }, [selectedRoom, appointments, matrix]);

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

    useEffect(()=> { // Resets selection when a new room is selected.
        setSelectedIndexes(new Set());
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setValue("schedule", null);
        clearErrors("schedule");
    }, [selectedRoom]);

    const resetForm = () => {
        reset(); // Reset from the react-hook-form.
        setSelectedClient(null);
        setSelectedRoom(null);
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setSelectedIndexes(new Set());
    };

    function localDateTimeToUTCISOString(day, time) {
        const [year, month, dayOfMonth] = day.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        const localDate = new Date(year, month - 1, dayOfMonth, hour, minute);
        return localDate.toISOString(); // UTC ISO string with Z.
    }

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
            startTime: localDateTimeToUTCISOString(schedule.day, schedule.start),
            endTime: localDateTimeToUTCISOString(schedule.day, schedule.end),
        };
        if (data.note && data.note.trim() !== "") {
            payload.note = data.note.trim();
        }

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
                const startLocal = new Date(result.startUTC);
                const endLocal = new Date(result.endUTC);
                const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hourCycle: 'h23',
                });
                setStatus({
                    message: `${result.firstName} agendado para o dia ${startLocal.getDate()} das ${timeFormatter.format(startLocal)} às ${timeFormatter.format(endLocal)} na sala: ${result.roomName}.` || "Agendamento confirmado!",
                    type: "success"
                });
                resetForm();
                appointmentsFetch()
                    .then(data => setAppointments(data))
                    .catch(() => {
                        setStatus({ message: "Erro de conexão com o servidor", type: "error" });
                    });
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
            <div className={styles.formHeader}>
                <h2>Novo Agendamento</h2>
                <nav className={styles.formNav} aria-label="Navegação de Agendamento">
                    <ul>
                        <li><Link to="/schedule/new">Agenda</Link></li>
                        <li><Link to="/clients/new">+Cliente</Link></li>
                        <li><Link to="/schedule/new">Salas</Link></li>
                    </ul>
                </nav>
            </div>
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
                            labels = {{label: 'Sala', optionName : 'Selecione uma sala',
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
                        <p className={styles.dropdownLabel}>Sobre</p>
                        <textarea id="note" name="note" rows={5} className={`formInput ${styles.formTextarea}`}
                            {...register('note')} placeholder="Notas opcionais aqui"/>
                    </div>
                </div>

                <div className={styles.hoursWrapper}>
                    <SchedulingTable occupiedIndexes={occupiedIndexes} hasError={!!errors.schedule}
                        days={days} times={times} indexedCells={matrix}
                        startTime={startTime} endTime={endTime}
                        setStartTime={setStartTime} setEndTime={setEndTime}
                        scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
                        selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}/>
                </div>

                <ConfirmBackButtons containerClass={styles.buttonsContainer}/>
            </form>
        </div>
    );
}

export default ScheduleForm