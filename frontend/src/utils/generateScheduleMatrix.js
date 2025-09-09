export function generateScheduleMatrix(days, times) {
    let indexCounter = 0;

    return times.map(time => {
        return days.map(day => {
            const [year, month, dayNum] = day.split("-").map(Number);
            const [hour, minute] = time.split(":").map(Number);

            const start = new Date(year, month - 1, dayNum, hour, minute);
            const end = new Date(year, month - 1, dayNum, hour, minute + 15);

            return {
                day, time, index: indexCounter++,
                start: start.toISOString(), end: end.toISOString(),
            };
        });
    });
}

export function generateDays(numDays = 7, startDate = new Date()) {
    const days = [];
    for (let i = 0; i < numDays; i++) {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + i);
        days.push(nextDate.toISOString().split('T')[0]); // "YYYY-MM-DD"
    }
    return days;
}

export function generateHours(startHour = 6, endHour = 22, intervalMinutes = 15) {
    const hours = [];
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += intervalMinutes) {
            const hourString = h.toString().padStart(2, '0');
            const minuteString = m.toString().padStart(2, '0');
            hours.push(`${hourString}:${minuteString}`);
        }
    }
    return hours;
}

const getTimeFromNewDate = (dateString) => {
    return new Date (dateString).getTime();
}

export function getIndexesFromTimeRange(start, end, matrix2D) {
    const indexes = [];

    for (const row of matrix2D) {
        const startTD = getTimeFromNewDate(start);
        const endTD = getTimeFromNewDate(end);
        for (const cell of row) {
            const cellStartTD = getTimeFromNewDate(cell.start); // cell.start is a string, 2025-09-16T00:45:00.000Z = the GMT-0 from GMT-3
            const cellEndTD = getTimeFromNewDate(cell.end);
            //if (cell.index===0) {
            //    console.log ("Comparing ", new Date(start), "to", new Date (cellStart));
            //}
            if (cellStartTD < endTD && cellEndTD> startTD) {
                indexes.push(cell.index);
            }
        }
    }
    return indexes;
}