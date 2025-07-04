export function generateScheduleMatrix(days, times) {
    let indexCounter = 0;

    return times.map(time => {
        return days.map(day => {
            const [year, month, dayNum] = day.split("-").map(Number);
            const [hour, minute] = time.split(":").map(Number);

            const start = new Date(Date.UTC(year, month - 1, dayNum, hour, minute));
            const end = new Date(Date.UTC(year, month - 1, dayNum, hour, minute + 15));

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

function localDateTime(day, time) {
    // day = 2025-06-30
    // time = 2025-06-30T06:00:00.000Z
    const [year, month, dayOfMonth] = day.split('-').map(Number);
    const timeStringPart = time.split('T')[1].substring(0, 5);
    const [hour, minute] = timeStringPart.split(':').map(Number);
    const localDate = new Date(year, month - 1, dayOfMonth, hour, minute);
    return localDate;
}

export function getIndexesFromTimeRange(start, end, matrix2D) {
    const indexes = [];

    for (const row of matrix2D) {
        for (const cell of row) {
            const cellStartUTC = localDateTime(cell.day, cell.start).toISOString();

            const cellEndLocal = localDateTime(cell.day, cell.end);
            cellEndLocal.setMinutes(cellEndLocal.getMinutes() + 15);

            const cellEndUTC = cellEndLocal.toISOString();
            // console.log ("Comparing ", start, "to", cellStart);
            if (start < cellEndUTC && end > cellStartUTC) {
                indexes.push(cell.index);
            }
        }
    }
    return indexes;
}