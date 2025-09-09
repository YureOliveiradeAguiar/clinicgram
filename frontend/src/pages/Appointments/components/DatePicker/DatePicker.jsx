import DateModal from './DateModal/DateModal';

import { useEffect, useState, useMemo } from 'react';

import { generateDays, generateHours, generateScheduleMatrix, getIndexesFromTimeRange } from '@/utils/generateScheduleMatrix';


export default function DatePicker({ appointment, isEditing=true, onSelect,
        appointments, selectedClient, selectedWorker, selectedPlace,
        setHasDateError
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

//========================================Base Structure Of The Schedule Table==========================================
    const [startOffset, setStartOffset] = useState(0);
    const startDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() + startOffset);
        return date;
    }, [startOffset]);

    const days = useMemo(() => generateDays(7, startDate), [startDate]);
    const times = useMemo(() => generateHours(), []);
    const matrix = useMemo(() => generateScheduleMatrix(days, times), [days, times]);

//=======================================Interpreter of Selected Date Info===============================================
    /* Selected hours and day come from the table as values that change of time */
    const [selectedStartHours, setSelectedStartHours] = useState(null);
    const [selectedEndHours, setSelectedEndHours] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    /* Converts 2025-09-15 and 09:00 to 2025-09-15T09:00:00Z */
    const { selectedStartTime, selectedEndTime, } = useMemo(() => {
        if (selectedDay && selectedStartHours && selectedEndHours) {
            //console.log("selectedStartTime: ", localDateTimeToUTCISOStringNoSeconds(selectedDay, selectedStartHours));
            return {
                selectedStartTime: localDateTimeToUTCISOStringNoSeconds(selectedDay, selectedStartHours),
                selectedEndTime: localDateTimeToUTCISOStringNoSeconds(selectedDay, selectedEndHours),
            };
        }
        return { selectedStartTime: null, selectedEndTime: null };
    }, [selectedDay, selectedStartHours, selectedEndHours]);

//===============================================Selected Indexes Logic==================================================
    /* useMemo is for derived/computed values, that do not change over time, such as the selectedIndexes */
    const [selectedIndexes, setSelectedIndexes] = useState(new Set(getIndexesFromTimeRange(appointment.startTime, appointment.endTime, matrix)));
    //useEffect(() => {
    //    console.log("selectedIndexes: ", selectedIndexes);
    //}, [selectedIndexes]);

//===============================================Occupied Cells Logic=====================================================
    /* Updates occupied indexes when refered client, worker, place changes. */
    const occupiedIndexes = useMemo(() => {
        if ((!selectedPlace && !selectedClient && !selectedWorker) || !appointments.length || !matrix.length) return new Set();
        const filteredAppointments = appointments.filter( (appt) => {
            if (appointment?.id === appt.id) return false;
            const samePlace = selectedPlace && appt.place.id === selectedPlace.id;
            const sameClient = selectedClient && appt.client.id === selectedClient.id;
            const sameWorker = selectedWorker  && appt.worker.id === selectedWorker.id;
            return (samePlace || sameClient || sameWorker);
        });
        const indexes = new Set();
        for (const appt of filteredAppointments) {
            const start = appt.startTime; // string, 2025-09-15T09:00:00Z (UTC-0 => GMT) (6:00 in UTC-3)
            const end = appt.endTime;
            const apptIndexes = getIndexesFromTimeRange(start, end, matrix);
            apptIndexes.forEach(index => indexes.add(index));
        }
        //console.log("occupiedIndexes: ", indexes);
        return indexes;
    }, [selectedClient, selectedPlace, selectedWorker, appointments, matrix]);

//============================When occupied indexes change, check for validity of selected indexes===========================
    const isDateValid = useMemo(() => {
        if (![...selectedIndexes].some((index) => occupiedIndexes.has(index))) { // Checks for conflictant date selection.
            //console.log("DID NOT FOUND CONFLICT");
            setHasDateError(false);
            return true;
        } else {
            //console.log("FOUND CONFLICT");
            setHasDateError(true);
            return false;
        }
    },[occupiedIndexes, selectedIndexes]);

//=============================================Actual Date Sending ================================================
    useEffect(() => {
        if ((!selectedStartTime || !selectedEndTime)) return;
        onSelect(selectedStartTime, selectedEndTime); // Sends formated dates to the fields sent to the backend.
    }, [selectedDay]);

//=================================================================================================================

    return (<>
        <div className={'inputContainer'}>
            <button className={`formButtonPicker ${true ? 'hasValue' : ""} ${!isEditing ? "readOnly" : ""}`}
                type="button" readOnly={!isEditing} onClick={() => setDateModalOpen(true)}
            >
                {(selectedStartHours && selectedEndHours && selectedDay)
                    ? `${formatDate(selectedDay, false)}, ${selectedStartHours} a ${selectedEndHours}`
                    : appointment ? displaySameDayTimeSpan(appointment.startTime, appointment.endTime): ''}
            </button>
            <p id="dobLabel" className="customLabel">Data</p>
        </div>
        <p className="errorMessage">{!isDateValid ? 'Selecione uma data válida' : ''}</p>
        {isDateModalOpen && (
            <DateModal isOpen={isDateModalOpen} onClose={() => setDateModalOpen(false)}
                selectedStartHours={selectedStartHours} setSelectedStartHours={setSelectedStartHours} selectedEndHours={selectedEndHours}
                setSelectedEndHours={setSelectedEndHours} selectedDay={selectedDay} setSelectedDay={setSelectedDay}
                
                startOffset={startOffset} setStartOffset={setStartOffset} startDate={startDate}
                days={days} times={times} matrix={matrix}
                selectedIndexes={selectedIndexes} setSelectedIndexes={setSelectedIndexes}
                occupiedIndexes={occupiedIndexes} isDateValid={isDateValid}
            />
        )}
    </>)
}