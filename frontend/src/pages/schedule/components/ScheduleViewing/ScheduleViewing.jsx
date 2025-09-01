import styles from './ScheduleViewing.module.css';

import ScheduleTable from '@/components/ScheduleTable/ScheduleTable/ScheduleTable.jsx';
import AppointmentCard from '../AppointmentCard/AppointmentCard.jsx';
import ReturnButton from '@/components/ReturnButton/ReturnButton';

import { useMemo, useState, useEffect} from 'react';

import { appointmentsFetch } from '@/utils/appointmentsFetch.js';
import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';
import { useAutoClearStatus } from '@/utils/useAutoClearStatus';

export default function ScheduleViewing() {
    const [statusMessage, setStatusMessage] = useState('');
    useAutoClearStatus(statusMessage, setStatusMessage);

    const [appointments, setAppointments] = useState([]);
    const [occupiedMap, setOccupiedMap] = useState(new Map());
    const [startOffset, setStartOffset] = useState(0);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

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
        appointmentsFetch() // Fetching for rendering appointments.
            .then(data => setAppointments(data))
            .catch(() => {
                setStatusMessage({ message: "Erro de conexão com o servidor", type: "error" });
            });
    }, []);

    useEffect(() => {
        if (!matrix.length) return;
        if (!appointments.length) {
            setOccupiedMap(new Map());
            return;
        }
        const map = new Map();
        for (const appt of appointments) {
            const apptIndexes = getIndexesFromTimeRange(appt.startTime, appt.endTime, matrix);
            apptIndexes.forEach(index => {
                const existing = map.get(index) || [];
                map.set(index, [...existing, appt]);
            });
        }
        setOccupiedMap(map);
    }, [appointments, matrix]);

    const colorPalette = ["#49ccc3ff", "#ffde58ff", "#b485ffff", "#ffab24ff",
        "#9d15a7ff", "#53b64bff", "#FF5E78", "#3C91E6",
    ];
    const appointmentColors = useMemo(() => { // Sort appointments for coloring & assigns colors
        const sortedAppointments = [...appointments].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        const colorMap = {};
        sortedAppointments.forEach((appointment, index) => {
            colorMap[appointment.id] = colorPalette[index % colorPalette.length];
        });
        return colorMap;
    }, [appointments]);

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.formHeader}>
                <h2>Agenda</h2> 
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.TableWrapper}>
                    <ScheduleTable
                            setAppointments={setAppointments} setStatus={setStatusMessage}
                            appointmentColors={appointmentColors} occupiedMap={occupiedMap}
                            days={days} times={times} indexedCells={matrix}
                            startOffset={startOffset} setStartOffset={setStartOffset}
                            monthName={monthName} year={year}
                            selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment}/>
                </div>
                <div className={styles.appointmentList}>
                    {appointments.length > 0 ? (
                        appointments.map(appointment => (
                            <AppointmentCard key={appointment.id} appointment={appointment}
                                labelColor={appointmentColors[appointment.id]} setSelectedAppointment={setSelectedAppointment}/>
                    ))
                    ) : (
                        <p className="listMessage">Nenhum agendamento registrado</p>
                    )}
                </div>
                <div className={styles.returnButtonContainer}>
                    <ReturnButton/>
                </div>
            </div>
            {statusMessage?.message && (
                <div className={`statusMessage ${statusMessage.type}`}>
                    {statusMessage.message}
                </div>
            )}
        </div>
    );
}