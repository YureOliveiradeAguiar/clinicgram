import AlertIcon from '@/assets/icons/alertSign.jsx'
import styles from './ScheduleTable.module.css';

import TableTopBar from '../TableTopBar/TableTopBar.jsx';
import AppointmentModal from '../AppointmentModal/AppointmentModal';

import { useState, useEffect } from 'react';

import { getCookie } from '@/utils/csrf';

export default function ScheduleTable({ mode = 'viewing',
    occupiedMap, setStatus, setAppointments, appointmentColors, // Viewing.
    selectedAppointment, setSelectedAppointment, // Viewing.
    // Scheduling >.
    occupiedIndexes,
    days, indexedCells,
    scheduledDay, setScheduledDay,
    selectedIndexes, setSelectedIndexes,
    startTime, setStartTime, endTime, setEndTime, hasError = false,
    //Base Structure >.
    startOffset = { startOffset }, setStartOffset = { setStartOffset },
    monthName = { monthName }, year = { year }
    }) {

    const [isDragging, setIsDragging] = useState(false); // Scheduling.
    const [selectedDay, setSelectedDay] = useState(null); // Scheduling.
    const [lastSelectedIndex, setLastSelectedIndex] = useState(null); // Scheduling.

    const numColumns = days.length;
    const isAdjacentInColumn = (a, b) => Math.abs(a - b) === numColumns;

    const descriptionText = startTime && endTime
        ? `Selecionado: ${startTime} às ${endTime} • ${formatDate(scheduledDay, true)} • ${monthName} • ${year}`
        : 'Clique e arraste para selecionar';
    const errorText = 'Selecione um horário válido';

    const addMinutesToTime = (timeString, minutesToAdd) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes + minutesToAdd);

        const pad = n => n.toString().padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    function formatDate(dateString, withWeekday = false) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Local time (not UTC).
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
        });
        if (!withWeekday) return formattedDate;
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
        return `${capitalizedWeekday}, ${formattedDate}`;
    }

    const handleMouseDown = (cell) => {
        if (occupiedIndexes.has(cell.index)) return;
        setIsDragging(true);
        setSelectedDay(cell.day);
        setSelectedIndexes(new Set([cell.index]));
        setLastSelectedIndex(cell.index);
    };
    const handleMouseEnter = (cell) => {
        if (!isDragging || cell.day !== selectedDay || occupiedIndexes.has(cell.index)) return;

        if (isAdjacentInColumn(lastSelectedIndex, cell.index)) {
            setSelectedIndexes(prev => {
                const updated = new Set(prev);
                updated.add(cell.index);
                return updated;
            });
            setLastSelectedIndex(cell.index);
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
        setSelectedDay(null);
        setLastSelectedIndex(null);
        if (selectedIndexes.size > 0) {
            const sorted = [...selectedIndexes].sort((a, b) => a - b);
            const firstCell = indexedCells.flat().find(cell => cell.index === sorted[0]);
            const lastCell = indexedCells.flat().find(cell => cell.index === sorted[sorted.length - 1]);
            if (firstCell && lastCell) {
                const day = firstCell.day;
                const start = firstCell.time;
                const end = addMinutesToTime(lastCell.time, 15);
                setScheduledDay(day);
                setStartTime(start);
                setEndTime(end);
            }
        }
    };

    useEffect(() => {
        const stopDrag = () => setIsDragging(false);
        window.addEventListener('mouseup', stopDrag);
        return () => window.removeEventListener('mouseup', stopDrag);
    }, []);

    const handleDeleteAppointment = async () => { // Viewing.
        if (!selectedAppointment) return;
        if (!window.confirm('Tem certeza que deseja excluir esse agendamento?')) return;
        try {
            const res = await fetch(`/api/appointments/delete/${selectedAppointment.id}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });
            if (res.ok) {
                const idToDelete = selectedAppointment.id;
                setStatus({ message: "Agendamento excluído com sucesso", type: "success" });
                setSelectedAppointment(null); // Closes the modal.
                setAppointments(prev => // Filters out the deleted appointment.
                    prev.filter(appt => appt.id !== idToDelete)
                );
            } else {
                setStatus({ type: "error", message:<>
                    <AlertIcon className={styles.icon} />
                    Erro ao excluir o agendamento</>});
            }
        } catch {
            setStatus({ type: "error", message:<>
                    <AlertIcon className={styles.icon} />
                    Erro de conexão com o servidor</>});
        }
    };

    const getMaxIndexForAppt = (appointmentId) => {
        let maxIndex = -1;
        for (const [cellIndex, appointments] of occupiedMap.entries()) {
            appointments.forEach((appt, i) => {
                if (appt.id === appointmentId && i > maxIndex) {
                    maxIndex = i;
                }
            });
        }
        return maxIndex;
    };

    return (
        <div>
            <TableTopBar startOffset={startOffset} setStartOffset={setStartOffset} monthName={monthName} year={year}/>
            <div className={`${styles.scheduleWrapper} ${hasError ? styles.scheduleWrapperError : ''}`}>
                <div className={styles.scheduleContainer} id="hoursScheduling">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {days.map((day, index) => (
                                    <th key={index}>{formatDate(day, true)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {indexedCells.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td>
                                        <span className={styles.hourLabel}>{row[0]?.time}</span>
                                    </td>
                                    {row.map((cell) => (
                                        <td key={cell.index} data-index={cell.index} data-day={cell.day} data-time={cell.time}
                                            className={`${styles.scheduleCell}
                                                ${mode === 'scheduling' && occupiedIndexes?.has(cell.index) ? styles.occupied : ''}
                                                ${mode === 'scheduling' && selectedIndexes?.has(cell.index) ? styles.selected : ''}`}
                                            style={{cursor: (mode === 'scheduling' && !occupiedIndexes?.has(cell.index)) ? 'pointer' : 'default'}}
                                            onMouseDown={ mode === 'scheduling' ? () => handleMouseDown(cell) : undefined }
                                            onMouseEnter={ mode === 'scheduling' ? () => handleMouseEnter(cell) : undefined }
                                            onMouseUp={ mode === 'scheduling' ? handleMouseUp : undefined }
                                        >
                                            {mode === 'viewing' && occupiedMap?.has(cell.index) && (
                                                <div className={styles.appointmentGrid}>
                                                    {occupiedMap.get(cell.index).map((appointment) => (
                                                        <div key={appointment.id} className={styles.appointmentBlock}
                                                                    style={{ backgroundColor: appointmentColors[appointment.id],
                                                                        marginLeft: `${32 * getMaxIndexForAppt(appointment.id)}px`,
                                                                        borderBottom: `6px solid ${appointmentColors[appointment.id]}`, }}
                                                                    onClick={() => setSelectedAppointment(appointment)}>
                                                                {appointment.place.icon || ''}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.scrollbarCorner}></div>
            </div>
            {mode === 'scheduling' && (
                <div className={`${styles.description} ${hasError ? styles.descriptionError : ''}`}>
                {hasError && AlertIcon && <AlertIcon className={styles.icon}/>}
                {hasError ? errorText : descriptionText}
            </div>
            )}
            
            {selectedAppointment && (
                <AppointmentModal appointment={selectedAppointment} onClose={() => setSelectedAppointment(null)}
                        onDelete={ handleDeleteAppointment }/>
            )}
        </div>
    );
}