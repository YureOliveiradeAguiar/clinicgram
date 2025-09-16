import Modal from '@/components/Modal/Modal';
import FrequencyChart from './components/FrequencyChart';
import { useMemo, useEffect } from 'react';


export default function WorkerStatisticsModal({ appointments, worker, isOpen, onClose }) {

//====================================Previous month boundaries===========================================
    const now = new Date();
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//===============================Get the amount of days in a given month=====================================
    const daysInMonth = useMemo(() => {
        const endDay = new Date(prevMonthStart.getFullYear(), prevMonthStart.getMonth() + 1, 0).getDate();
        return Array.from({ length: endDay }, (_, i) => i + 1);
    }, [prevMonthStart]);

//=======================Get the appointments for selectedWorker in the previous month=======================
    const filteredAppointments = useMemo(() => {
        if (!appointments || !worker) return [];

        return appointments.filter(appointment => {
            const localDate = new Date(appointment.startTime);
            return (
                appointment.workerId === worker.id &&
                localDate >= prevMonthStart &&
                localDate < thisMonthStart
            );
        });
    }, [appointments, worker, prevMonthStart, thisMonthStart]);

//=============================From filtered appointments get the unique treatments=========================
    const treatmentTypes = useMemo(() => {
        /* Pick a primitive property for uniqueness, id in this case, because object comparison wont work. */
        const unique = new Map();
        filteredAppointments.forEach(appointment => {
            const key = appointment.treatment.id;
            if (!unique.has(key)) unique.set(key, appointment.treatment);
        });
        return Array.from(unique.values());
    }, [filteredAppointments]);

//=====================================Group by day and treatment type========================================
    const datasets = useMemo(() => {
        /* Pre-aggregate: counts[treatmentId][day] = count */
        const counts = {};
        for (const appointment of filteredAppointments) {
            const date = new Date(appointment.startTime);
            const day = date.getDate();
            if (!counts[appointment.treatmentId]) {
                counts[appointment.treatmentId] = {};
            }
            counts[appointment.treatmentId][day] = (counts[appointment.treatmentId][day] || 0) + 1;
        }
        /* Now build datasets with fast lookups */
        return treatmentTypes.map((type, index) => ({
            label: type.name,
            data: daysInMonth.map((day) => counts[type.id]?.[day] || 0),
            backgroundColor: `hsl(${index * 137.5}, 70%, 60%)`,
        }));
    }, [filteredAppointments, treatmentTypes, daysInMonth]);
//=========================================Geting count for each patient=======================================
    const countsArray = useMemo(() => {
        const appointmentCounts = filteredAppointments.reduce((acc, appointment) => {
            if (!appointment.client) return acc; // skip reservations without client
            const name = appointment.client.name;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(appointmentCounts).map(
            ([name, count]) => `${count} - ${name}`
        );
    }, [filteredAppointments]);

//=============================================================================================================

    useEffect(() => {
        console.log("countsArray: ", countsArray);
    }, [countsArray]);

    return (
        <Modal title={"Controle de Frequência"} isOpen={isOpen} onClose={onClose} maxWidth='620px'>
            <div style={{ overflowX: 'auto' }}>
                <FrequencyChart daysInMonth={daysInMonth} prevMonthStart={prevMonthStart}
                totalAppointments={filteredAppointments ? filteredAppointments.length : 0}
                appointmentsByClient={countsArray}
                workerData={datasets} workerName={worker?.name || ''}/>
            </div>
        </Modal>
    );
}