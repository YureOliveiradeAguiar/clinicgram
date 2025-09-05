import DateModal from './DateModal/DateModal';

import { useState } from 'react';


export default function DatePicker({ appointment, isEditing=true, onSelect, hasError }) {
    const [isDateModalOpen, setDateModalOpen] = useState(false);

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [scheduledDay, setScheduledDay] = useState(null);

    const localDateTimeToUTCISOString = (day, time) => {
        const [year, month, dayOfMonth] = day.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        const localDate = new Date(year, month - 1, dayOfMonth, hour, minute);
        return localDate.toISOString(); // UTC ISO string with Z.
    }

    const formatDate = (dateString, withWeekday = false) => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // Local time (not UTC).
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
        if (!withWeekday) return formattedDate;
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
        return `${capitalizedWeekday}, ${formattedDate}`;
    }

    const handleSelect = (startTime, endTime) => {
        const startDate = localDateTimeToUTCISOString(scheduledDay, startTime);
        const endDate = localDateTimeToUTCISOString(scheduledDay, endTime);
        onSelect(startDate, endDate);
        setDateModalOpen(false);
    }

    return (<>
        <div className={'inputContainer'}>
            <button className={`formButtonPicker ${true ? 'hasValue' : ""} ${!isEditing ? "readOnly" : ""}`}
                type="button" readOnly={!isEditing} onClick={() => setDateModalOpen(true)}
            >
                {(startTime && endTime && scheduledDay)
                    ? `${startTime} às ${endTime} no dia ${formatDate(scheduledDay, false)}`
                    : appointment.startTime}
            </button>
            <p id="dobLabel" className="customLabel">Duração</p>
        </div>
        <p className="errorMessage">{hasError?.message || hasError?.message || " "}</p>
        {isDateModalOpen && (
            <DateModal isOpen={isDateModalOpen} onClose={() => setDateModalOpen(false)}
                startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime}
                scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
            />
        )}
    </>)
}