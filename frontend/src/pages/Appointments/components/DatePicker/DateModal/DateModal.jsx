import styles from './DateModal.module.css';

import { useState, useEffect, useMemo } from 'react';

import Modal from '@/components/Modal/Modal';
import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


export default function DateModal({ isOpen, onClose, appointments, setAppointments,
        startTime, setStartTime, endTime, setEndTime, scheduledDay, setScheduledDay,
        selectedClient, setSelectedClient, selectedWorker, setSelectedWorker, selectedPlace, setSelectedPlace
    }) {
    const [selectedIndexes, setSelectedIndexes] = useState(new Set());
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());
    const [error, setError] = useState(null);

    useEffect (() => {
        console.log("scheduledDay: ", scheduledDay);
    }, [scheduledDay]);

    const [startOffset, setStartOffset] = useState(0);
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
    useEffect(() => { // For rendering the occupied cells based on the selected client, worker and place.
        if ((!selectedPlace && !selectedClient && !selectedWorker) || !appointments.length || !matrix.length) return;
        const filteredAppointments = appointments.filter( (appt) => {
            const samePlace = selectedPlace && appt.place.id === selectedPlace.id;
            const sameClient = selectedClient && appt.client.id === selectedClient.id;
            const sameWorker = selectedWorker  && appt.worker.id === selectedWorker.id;
            return samePlace || sameClient || sameWorker;
        });
        const indexes = new Set();
        for (const appt of filteredAppointments) {
            const start = appt.startTime;
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
        }
        setOccupiedIndexes(indexes);
    }, [selectedClient, selectedPlace, selectedWorker, appointments, matrix]);

    return (
        <Modal title="Selecione um Horário" isOpen={isOpen} onClose={onClose} maxWidth='640px'>
            <div className={styles.hoursWrapper}>
                <ScheduleTable mode={"scheduling"} occupiedIndexes={occupiedIndexes} haserror={error}
                    days={days} times={times} indexedCells={matrix}
                    startTime={startTime} endTime={endTime}
                    setStartTime={setStartTime} setEndTime={setEndTime}
                    scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
                    selectedIndexes={selectedIndexes} setSelectedIndexes ={setSelectedIndexes}
                    startOffset={startOffset} setStartOffset={setStartOffset}
                    monthName={monthName} year={year}
                />
            </div>
            
        </Modal>
    );
}