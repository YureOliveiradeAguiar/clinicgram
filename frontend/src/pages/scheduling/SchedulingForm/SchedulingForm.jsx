import styles from './SchedulingForm.module.css'
import ConfirmBackButtons from "@/components/ConfirmBackButtons/ConfirmBackButtons.jsx";

import SearchDropdown from '@/components/SearchDropdown/SearchDropdown.jsx';
import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable.jsx';

import { useMemo, useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

import { getCookie } from '@/utils/csrf.js';
import { clientsFetch } from '../utils/clientsFetch.js';
import { placesFetch } from '@/utils/placesFetch.js';
import { appointmentsFetch } from '@/utils/appointmentsFetch.js';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


export default function ScheduleForm() {
    const { register, handleSubmit, setValue, reset, formState: { errors }, setError, clearErrors } = useForm({ mode: 'onBlur' });
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

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
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
        clientsFetch() // Fetching for rendering clients in the dropdown.
            .then(data => setClients(data))
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
        placesFetch() // Fetching for rendering places in the dropdown.
            .then(data => setPlaces(data))
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    useEffect(() => { // For rendering the occupied cells based on the selected place and client.
        if ((!selectedPlace && !selectedClient) || !appointments.length || !matrix.length) return;
        const filteredAppointments = appointments.filter( (appt) => {
            const samePlace = selectedPlace && appt.place.id === selectedPlace.id;
            const sameClient = selectedClient && appt.client.id === selectedClient.id;
            return samePlace || sameClient;
        });
        const indexes = new Set();
        for (const appt of filteredAppointments) {
            const start = appt.startTime;
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
            // console.log(apptIndexes);
            // console.log("appt.startTime (UTC) ", appt.startTime);
            // console.log("appt.startTime (locale) ", start);
        }
        setOccupiedIndexes(indexes);
    }, [selectedClient, selectedPlace, appointments, matrix]);

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

    useEffect(() => {
        //console.log("occupiedIndexes: ", occupiedIndexes);
        //console.log("selectedIndexes: ", selectedIndexes);
        const hasConflict = [...selectedIndexes].some(idx => occupiedIndexes.has(idx));
        //console.log("conflict? ", hasConflict);
        if (hasConflict) {
            resetScheduleTime();
            setStatusMessage({ message: "O horário selecionado já está ocupado. Selecione outro horário.", type: "error" });
        }
    }, [occupiedIndexes]);

    useEffect(() => { // Resets when user moves table forwards or backwards in time.
        selectedIndexes.size && resetScheduleTime();
    }, [startOffset]);
    const resetScheduleTime = () => { // Reset for schedule table and selected time logic.
        setSelectedIndexes(new Set());
        setStartTime(null);
        setEndTime(null);
        setScheduledDay(null);
        setValue("schedule", null);
        clearErrors("schedule");
    }

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
        if (!selectedPlace) {setError("place", {type: "manual", message: "Selecione uma sala"});}
        if (!schedule || !schedule.day || !schedule.start || !schedule.end) {
            setError("schedule", { type: "manual", message: "Selecione um horário válido" });
        }
        if (!selectedClient || !selectedPlace || !schedule?.day || !schedule?.start || !schedule?.end) {
            setStatusMessage({ message: "Dados inválidos!", type: "error" });
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
                setStatusMessage({
                    message: `Agendado | ${result.firstName} | dia ${startLocal.getDate()} | ${timeFormatter.format(startLocal)} às ${timeFormatter.format(endLocal)} | ${result.placeName}.` || "Agendamento confirmado!",
                    type: "success"
                });
                resetForm();
                appointmentsFetch()
                    .then(data => setAppointments(data))
                    .catch(() => {
                        setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
                    });
            } else {
                setStatusMessage({ message: result.message || "Erro ao agendar", type: "error" });
            }
        } catch (error) {
            setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
        }
    };

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Agendamento</h2>
            </div>
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
                    <ScheduleTable mode={"scheduling"} occupiedIndexes={occupiedIndexes} hasError={!!errors.schedule}
                        days={days} times={times} indexedCells={matrix}
                        startTime={startTime} endTime={endTime}
                        setStartTime={setStartTime} setEndTime={setEndTime}
                        scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
                        selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}
                        startOffset={startOffset} setStartOffset={setStartOffset}
                        monthName={monthName} year={year}
                    />
                </div>

                <ConfirmBackButtons containerClass={styles.buttonsContainer}/>
            </form>
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </div>
    );
}