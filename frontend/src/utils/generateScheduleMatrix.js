export function generateScheduleMatrix(dates, times) {
    let indexCounter = 0;

    return times.map(horario => {
        return dates.map(dia => {
            return {
                horario,
                dia,
                index: indexCounter++,
            };
        });
    });
}

export function generateDays(numDays = 14) {
    const today = new Date();
    const days = [];

    for (let i = 0; i < numDays; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
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