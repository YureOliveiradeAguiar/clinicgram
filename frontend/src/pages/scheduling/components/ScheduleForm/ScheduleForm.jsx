import styles from './ScheduleForm.module.css'
import { Link } from 'react-router-dom';
import ConfirmBackButtons from "@/components/ConfirmBackButtons/ConfirmBackButtons.jsx";

import SearchDropdown from '../SearchDropdown/SearchDropdown.jsx';
import SchedulingTable from '../SchedulingTable/SchedulingTable.jsx';

import { useMemo, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { clientsFetch } from '../../utils/clientsFetch.js';
import { placesFetch } from '../../utils/placesFetch.js';
import { appointmentsFetch } from '../../utils/appointmentsFetch.js';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


function ScheduleForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({mode:'onBlur'});
    const [status, setStatus] = useState({ message: "Registre um atendimento", type: "info" });

    const [clients, setClients] = useState([]);
    const [places, setPlaces] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedIndexes, setSelectedIndexes] = useState(new Set());

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [scheduledDay, setScheduledDay] = useState(null);

    const [appointments, setAppointments] = useState([]);
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());

    const [startOffset, setStartOffset] = useState(0);

    // Centralized base date info.
    const startDate = useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() + startOffset);
      return date;
    }, [startOffset]);
    const days = useMemo(() => generateDays(7, startDate), [startDate]);
    const rawMonth = startDate.toLocaleString('pt-BR', { month: 'long' });
    const monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
    const year = startDate.getFullYear();

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
        placesFetch() // Fetching for rendering places in the dropdown.
            .then(data => setPlaces(data))
            .catch(() => {
                setStatus({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    useEffect(() => { // For rendering the occupied cells based on the selected place.
        if (!selectedPlace || !appointments.length || !matrix.length) return;
        const placeAppointments = appointments.filter(
            (appt) => appt.place.id === selectedPlace.id
        );
        const indexes = new Set();
        for (const appt of placeAppointments) {
            const start = appt.startTime;
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
            // console.log(apptIndexes);
            // console.log("appt.startTime (UTC) ", appt.startTime);
            // console.log("appt.startTime (locale) ", start);
        }
        setOccupiedIndexes(indexes);
    }, [selectedPlace, appointments, matrix]);

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

    useEffect(()=> { // Resets selection when a new place is selected.
        setSelectedIndexes(new Set());
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setValue("schedule", null);
        clearErrors("schedule");
    }, [selectedPlace, startOffset]);

    const resetForm = () => {
        reset(); // Reset from the react-hook-form.
        setSelectedClient(null);
        setSelectedPlace(null);
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
        const { selectedClient, selectedPlace, schedule } = data;

        if (!selectedClient) {setError("client", {type: "manual", message: "Selecione um cliente"});}
        if (!selectedPlace) {setError("placa", {type: "manual", message: "Selecione uma sala"});}
        if (!schedule || !schedule.day || !schedule.start || !schedule.end) {
            setError("schedule", { type: "manual", message: "Selecione um horário válido" });
        }
        if (!selectedClient || !selectedPlace || !schedule?.day || !schedule?.start || !schedule?.end) {
            setStatus({ message: "Dados inválidos!", type: "error" });
            return;
        }

        const payload = {
            clientId: selectedClient.id,
            placeId: selectedPlace.id,
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
                    message: `${result.firstName} agendado para o dia ${startLocal.getDate()} das ${timeFormatter.format(startLocal)} às ${timeFormatter.format(endLocal)} na sala: ${result.placeName}.` || "Agendamento confirmado!",
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
                        <SearchDropdown options={places} selectedOption={selectedPlace} hasError={!!errors.place}
                            labels = {{label: 'Sala', optionName : 'Selecione uma sala',
                                placeholder: 'Pesquisar sala...', noResults: 'Nenhuma sala registrada'}}
                            onSelect={(place) => {
                                if (!place) return;
                                setSelectedPlace(place);
                                clearErrors('place');
                                setValue('selectedPlace', place);
                            }}/>
                        <p className="errorMessage">{errors.place?.message || " "}</p>
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
                        selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}
                        startOffset={startOffset} setStartOffset={setStartOffset}
                        monthName={monthName} year={year}/>
                </div>

                <ConfirmBackButtons containerClass={styles.buttonsContainer}/>
            </form>
        </div>
    );
}

export default ScheduleForm