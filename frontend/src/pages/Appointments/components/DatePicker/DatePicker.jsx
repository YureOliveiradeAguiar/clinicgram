import DateModal from './DateModal/DateModal';

import { useEffect, useState } from 'react';


export default function DatePicker({ appointment, isEditing=true, onSelect, hasError, 
        startTime, setStartTime, endTime, setEndTime, scheduledDay, setScheduledDay
    }) {
    const [isDateModalOpen, setDateModalOpen] = useState(false);

    const localDateTimeToUTCISOString = (day, time) => {
        const [year, month, dayOfMonth] = day.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        const localDate = new Date(year, month - 1, dayOfMonth, hour, minute);
        return localDate.toISOString(); // UTC ISO string with Z.
    }

    const displaySameDayTimeSpan = (start, end) => {
        /* New Date is required because django will return a string, not date, and toStrings methods of
        a string will just return the same string back. appointment.startTime is 2025-09-04T12:14:20Z */
        // The get methods for date elements and toString functions are how you convert UTC to local time.
        // .toString() = "Tue Oct 28 2025 11:30:00 GMT-0300 (Brasilia Standard Time)"
        // .toLocaleString() = "28/10/2025, 11:30:00"
        // .toLocaleTimeString() = "11:30:00"
        // .getFullYear() .getMonth() (Careful: 0 = January, 11 = December)
        // .getDate() .getHours() .getMinutes() .getSeconds()
        // slice is (from, to) and -3 const from the oposite direction.

        const startTimeDisplay = new Date (start).toLocaleString().slice(0,-3);
        const endTimeDisplay = new Date (end).toLocaleTimeString().slice(0,-3);
        return (`${startTimeDisplay} a ${endTimeDisplay}`)
    }

    const formatDate = (dateString, withWeekday = false) => { // Local time (not UTC).
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

    useEffect(() => {
        if (!startTime && !endTime && !scheduledDay) return;
        const startDate = localDateTimeToUTCISOString(scheduledDay, startTime);
        const endDate = localDateTimeToUTCISOString(scheduledDay, endTime);
        onSelect(startDate, endDate);
    }, [scheduledDay]);

    return (<>
        <div className={'inputContainer'}>
            <button className={`formButtonPicker ${true ? 'hasValue' : ""} ${!isEditing ? "readOnly" : ""}`}
                type="button" readOnly={!isEditing} onClick={() => setDateModalOpen(true)}
            >
                {(startTime && endTime && scheduledDay)
                    ? `${formatDate(scheduledDay, false)}, ${startTime} a ${endTime}`
                    : displaySameDayTimeSpan(appointment.startTime, appointment.endTime)}
            </button>
            <p id="dobLabel" className="customLabel">Data</p>
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