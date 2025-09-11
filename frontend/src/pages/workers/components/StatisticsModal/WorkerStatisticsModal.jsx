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
        const dataByTreatment = {};
        treatmentTypes.forEach((type) => {
            dataByTreatment[type.id] = daysInMonth.map((day) => {
                return filteredAppointments.filter((appointment) => {
                    const date = new Date(appointment.startTime);
                    return date.getDate() === day && appointment.treatmentId === type.id; //not optimal big filters inside loop
                }).length;
            });
        });
        return treatmentTypes.map((type, index) => ({
            label: type.name,
            data: dataByTreatment[type],
            backgroundColor: `hsl(${index * 137.5}, 70%, 60%)`,
        }));
    }, [filteredAppointments, treatmentTypes, daysInMonth]);
//=============================================================================================================

    useEffect(() => {
        console.log("datasets: ", datasets);
    }, [datasets]);

    return (
        <Modal title={"Controle de Frequência"} isOpen={isOpen} onClose={onClose} maxWidth='620px'>
            <div style={{ overflowX: 'auto' }}>
                <FrequencyChart daysInMonth={daysInMonth} prevMonthStart={prevMonthStart}
                totalAppointments={filteredAppointments ? filteredAppointments.length : 0} workerData={datasets} workerName={worker?.name || ''}/>
            </div>
        </Modal>
    );
}