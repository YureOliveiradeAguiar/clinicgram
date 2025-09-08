import DateModal from './DateModal/DateModal';

import { useEffect, useState, useMemo } from 'react';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


export default function DatePicker({ appointment, isEditing=true, onSelect,
        startHours, setStartHours, endHours, setEndHours, scheduledDay, setScheduledDay,
        appointments, selectedClient, selectedWorker, selectedPlace,
        selectedStartTime, selectedEndTime, setSelectedStartTime, setSelectedEndTime,
        isDateValid, setIsDateValid
    }) {
    const [isDateModalOpen, setDateModalOpen] = useState(false);

    const localDateTimeToUTCISOStringNoSeconds = (day, time) => {
        const [year, month, dayOfMonth] = day.split('-').map(Number);
        const [hour, minute] = time.split(':').map(Number);

        const localDate = new Date(year, month - 1, dayOfMonth, hour, minute);

        const yearUTC = localDate.getUTCFullYear();
        const monthUTC = String(localDate.getUTCMonth() + 1).padStart(2, '0');
        const dayUTC = String(localDate.getUTCDate()).padStart(2, '0');
        const hourUTC = String(localDate.getUTCHours()).padStart(2, '0');
        const minuteUTC = String(localDate.getUTCMinutes()).padStart(2, '0');

        return `${yearUTC}-${monthUTC}-${dayUTC}T${hourUTC}:${minuteUTC}:00Z`;
    };

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
            year: 'numeric',
        });
        if (!withWeekday) return formattedDate;
        const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' });
        const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('.', '');
        return `${capitalizedWeekday}, ${formattedDate}`;
    }

    useEffect(() => {
        if (!startHours && !endHours && !scheduledDay) return;
        const startDate = localDateTimeToUTCISOStringNoSeconds(scheduledDay, startHours);
        const endDate = localDateTimeToUTCISOStringNoSeconds(scheduledDay, endHours);
        onSelect(startDate, endDate); // Sends formated dates to the fields sent to the backend.
        setSelectedStartTime(startDate);
        setSelectedEndTime(endDate);
    }, [scheduledDay]);

//=======================================Base Structure Of The Schedule Table=========================================
    const [startOffset, setStartOffset] = useState(0);
    const startDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + startOffset);
        return date;
    }, [startOffset]);

    const days = useMemo(() => generateDays(7, startDate), [startDate]);
    const times = useMemo(() => generateHours(), []);
    const matrix = useMemo(() => generateScheduleMatrix(days, times), [days, times]);

//=============================================Selected Indexes Logic====================================================
    // const [selectedIndexes, setSelectedIndexes] = useState(new Set());
    // useEffect(() => {
    //     if (selectedStartTime && selectedEndTime) {
    //         setSelectedIndexes(new Set(getIndexesFromTimeRange(selectedStartTime, selectedEndTime, matrix)));
    //     }
    // }, [selectedStartTime, selectedEndTime, matrix]);

    /* Gets the current selected indexes based on current dates selected. In theory the useMemo runs before any useEffect */
    const selectedIndexes = useMemo(() => {
        if (selectedStartTime && selectedEndTime) {
            return new Set(getIndexesFromTimeRange(selectedStartTime, selectedEndTime, matrix));
        }
        console.log("selectedIndexes: ", selectedIndexes);
        return new Set();
    }, [selectedStartTime, selectedEndTime, matrix]);

//===============================================Occupied Cells Logic===================================================== (maybe make into a useMemo too???)
    const [occupiedIndexes, setOccupiedIndexes] = useState(new Set());
    useEffect(() => { // For rendering the occupied cells based on the selected client, worker and place.
        if ((!selectedPlace && !selectedClient && !selectedWorker) || !appointments.length || !matrix.length) return;
        const filteredAppointments = appointments.filter( (appt) => {
            const samePlace = selectedPlace && appt.place.id === selectedPlace.id;
            const sameClient = selectedClient && appt.client.id === selectedClient.id;
            const sameWorker = selectedWorker  && appt.worker.id === selectedWorker.id;
            const sameId = appointment?.id === appt.id;
            return (samePlace || sameClient || sameWorker) && !sameId;
        });
        const indexes = new Set();
        for (const appt of filteredAppointments) {
            const start = appt.startTime;
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
        }
        setOccupiedIndexes(indexes); // Updates occupied indexes when refered client, worker, place changes.
        console.log("occupiedIndexes: ", indexes);
//============================When occupied indexes change, check for validity of selected indexes===========================
        // Checks for conflictant date selection.
        if (![...selectedIndexes].some((index) => indexes.has(index))) {
            console.log("DID NOT FOUND CONFLICT");
            setIsDateValid(true);
        } else {
            console.log("FOUND CONFLICT");
            setIsDateValid(false);
        }
    }, [selectedClient, selectedPlace, selectedWorker, appointments, matrix]);
//============================================================================================================================

    return (<>
        <div className={'inputContainer'}>
            <button className={`formButtonPicker ${true ? 'hasValue' : ""} ${!isEditing ? "readOnly" : ""}`}
                type="button" readOnly={!isEditing} onClick={() => setDateModalOpen(true)}
            >
                {(startHours && endHours && scheduledDay)
                    ? `${formatDate(scheduledDay, false)}, ${startHours} a ${endHours}`
                    : appointment ? displaySameDayTimeSpan(appointment.startTime, appointment.endTime): ''}
            </button>
            <p id="dobLabel" className="customLabel">Data</p>
        </div>
        <p className="errorMessage">{!isDateValid ? 'Selecione uma data válida' : ''}</p>
        {isDateModalOpen && (
            <DateModal isOpen={isDateModalOpen} onClose={() => setDateModalOpen(false)}
                startHours={startHours} setStartHours={setStartHours} endHours={endHours} setEndHours={setEndHours} scheduledDay={scheduledDay} setScheduledDay={setScheduledDay}
                startOffset={startOffset} setStartOffset={setStartOffset} startDate={startDate}
                days={days} times={times} matrix={matrix}
                selectedIndexes={selectedIndexes} occupiedIndexes={occupiedIndexes} isDateValid={isDateValid}
            />
        )}
    </>)
}